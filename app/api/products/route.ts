//
// products/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// products api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../stack';
import { sql } from '@/lib/db';
import { CreateProductRequest } from '@/lib/types/product';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateProductRequest = await request.json();
    const { name, description, price, stock, images, status } = body;

    if (!name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    // First, get the user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Create the product
    const result = await sql`
      INSERT INTO products (organization_id, name, description, price, stock, images, status)
      VALUES (${organizationId}, ${name}, ${description || ''}, ${price || 0}, ${stock || 0}, ${images || []}, ${status || 'draft'})
      RETURNING *
    `;

    const product = result[0];
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
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

    // Get products for this organization
    const products = await sql`
      SELECT * FROM products WHERE organization_id = ${organizationId} ORDER BY created_at DESC
    `;

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 