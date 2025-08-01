//
// transactions/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// transactions api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../stack';
import { sql } from '@/lib/db';
import { CreateTransactionRequest } from '@/lib/types/transaction';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateTransactionRequest = await request.json();
    const { product_id, quantity, unit_price, total_amount } = body;

    if (!product_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    if (!unit_price || !total_amount) {
      return NextResponse.json({ error: 'Unit price and total amount are required' }, { status: 400 });
    }

    // Get the user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Create the transaction
    const result = await sql`
      INSERT INTO transactions (organization_id, product_id, quantity, unit_price, total_amount)
      VALUES (${organizationId}, ${product_id}, ${quantity || 1}, ${unit_price}, ${total_amount})
      RETURNING *
    `;

    const transaction = result[0];
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json([]);
    }

    const organizationId = userOrganizations[0].id;

    // Get transactions with product data
    const transactions = await sql`
      SELECT 
        t.*,
        json_build_object(
          'id', p.id,
          'name', p.name,
          'description', p.description,
          'price', p.price,
          'stock', p.stock,
          'images', p.images,
          'category', p.category,
          'status', p.status,
          'created_at', p.created_at,
          'updated_at', p.updated_at
        ) as product
      FROM transactions t
      LEFT JOIN products p ON t.product_id = p.id
      WHERE t.organization_id = ${organizationId}
      ORDER BY t.sold_at DESC
    `;

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
} 