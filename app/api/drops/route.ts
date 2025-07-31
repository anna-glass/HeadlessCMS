//
// drops/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// drops api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../stack';
import { sql } from '@/lib/db';
import { CreateDropRequest } from '@/lib/types/drop';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateDropRequest = await request.json();
    const { title, description, scheduled_at, product_ids } = body;

    if (!title) {
      return NextResponse.json({ error: 'Drop title is required' }, { status: 400 });
    }

    if (!scheduled_at) {
      return NextResponse.json({ error: 'Scheduled date/time is required' }, { status: 400 });
    }

    // Get the user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Create the drop
    const result = await sql`
      INSERT INTO drops (organization_id, title, description, scheduled_at)
      VALUES (${organizationId}, ${title}, ${description || ''}, ${scheduled_at})
      RETURNING *
    `;

    const drop = result[0];

    // If product_ids are provided, update the products to include them in this drop
    if (product_ids && product_ids.length > 0) {
      await sql`
        UPDATE products 
        SET drop_id = ${drop.id}, status = 'scheduled', updated_at = NOW()
        WHERE id = ANY(${product_ids}) AND organization_id = ${organizationId}
      `;
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
      WHERE d.id = ${drop.id}
      GROUP BY d.id
    `;

    return NextResponse.json(dropWithProducts[0] || drop);
  } catch (error) {
    console.error('Error creating drop:', error);
    return NextResponse.json(
      { error: 'Failed to create drop' },
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

    // Get drops with their associated products
    const drops = await sql`
      SELECT 
        d.*,
        COALESCE(
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
          ) FILTER (WHERE p.id IS NOT NULL), 
          '[]'::json
        ) as products
      FROM drops d
      LEFT JOIN products p ON d.id = p.drop_id AND p.organization_id = d.organization_id
      WHERE d.organization_id = ${organizationId}
      GROUP BY d.id
      ORDER BY d.scheduled_at DESC
    `;

    return NextResponse.json(drops);
  } catch (error) {
    console.error('Error fetching drops:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drops' },
      { status: 500 }
    );
  }
} 