//
// drops/[id]/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// individual drop api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../../stack';
import { sql } from '@/lib/db';
import { UpdateDropRequest } from '@/lib/types/drop';

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
    const body: UpdateDropRequest = await request.json();
    const { title, description, scheduled_at, status, product_ids } = body;

    // Get user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Update the drop
    const result = await sql`
      UPDATE drops 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        scheduled_at = COALESCE(${scheduled_at}, scheduled_at),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${id} AND organization_id = ${organizationId}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    const drop = result[0];

    // If product_ids are provided, update the products
    if (product_ids !== undefined) {
      // First, remove all products from this drop and reset their status to draft
      await sql`
        UPDATE products 
        SET drop_id = NULL, status = 'draft', updated_at = NOW()
        WHERE drop_id = ${id} AND organization_id = ${organizationId}
      `;

      // Then add the new products to this drop and set their status to scheduled
      if (product_ids && product_ids.length > 0) {
        await sql`
          UPDATE products 
          SET drop_id = ${id}, status = 'scheduled', updated_at = NOW()
          WHERE id = ANY(${product_ids}) AND organization_id = ${organizationId}
        `;
      }
    }

    // Return the drop with its products
    const dropWithProducts = await sql`
      SELECT 
        d.*,
        json_agg(
          CASE WHEN p.id IS NOT NULL THEN
            json_build_object(
              'id', p.id,
              'name', p.name,
              'description', p.description,
              'price', p.price,
              'stock', p.stock,
              'images', p.images,
              'tags', p.tags,
              'status', p.status,
              'drop_id', p.drop_id,
              'created_at', p.created_at,
              'updated_at', p.updated_at
            )
          ELSE NULL END
        ) FILTER (WHERE p.id IS NOT NULL) as products
      FROM drops d
      LEFT JOIN products p ON d.id = p.drop_id AND p.organization_id = d.organization_id
      WHERE d.id = ${id}
      GROUP BY d.id
    `;

    return NextResponse.json(dropWithProducts[0] || drop);
  } catch (error) {
    console.error('Error updating drop:', error);
    return NextResponse.json(
      { error: 'Failed to update drop' },
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

    // First, remove all products from this drop and reset their status to draft
    await sql`
      UPDATE products 
      SET drop_id = NULL, status = 'draft', updated_at = NOW()
      WHERE drop_id = ${id} AND organization_id = ${organizationId}
    `;

    // Then delete the drop
    const result = await sql`
      DELETE FROM drops 
      WHERE id = ${id} AND organization_id = ${organizationId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting drop:', error);
    return NextResponse.json(
      { error: 'Failed to delete drop' },
      { status: 500 }
    );
  }
} 