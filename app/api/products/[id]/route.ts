//
// products/[id]/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// individual product api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../../stack';
import { sql } from '@/lib/db';
import { UpdateProductRequest } from '@/lib/types/product';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body: UpdateProductRequest = await request.json();
    const { name, description, price, stock, images, status } = body;

    // Get user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Update the product (only if it belongs to the user's organization)
    const result = await sql`
      UPDATE products 
      SET 
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        price = COALESCE(${price}, price),
        stock = COALESCE(${stock}, stock),
        images = COALESCE(${images}, images),
        status = COALESCE(${status}, status),
        updated_at = now()
      WHERE id = ${id} AND organization_id = ${organizationId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = result[0];
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Delete the product (only if it belongs to the user's organization)
    const result = await sql`
      DELETE FROM products 
      WHERE id = ${id} AND organization_id = ${organizationId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 