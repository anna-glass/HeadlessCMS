//
// products/settings/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// product settings api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../../stack';
import { sql } from '@/lib/db';
import { CreateProductSettingsRequest, UpdateProductSettingsRequest } from '@/lib/types/product';

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
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Get product settings for this organization
    const settings = await sql`
      SELECT * FROM product_settings WHERE organization_id = ${organizationId}
    `;

    if (settings.length === 0) {
      // Create default settings if none exist
      const defaultSettings = await sql`
        INSERT INTO product_settings (organization_id, available_tags)
        VALUES (${organizationId}, '{}')
        RETURNING *
      `;
      return NextResponse.json(defaultSettings[0]);
    }

    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error('Error fetching product settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateProductSettingsRequest = await request.json();
    const { available_categories } = body;

    // Get user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Create product settings
    const result = await sql`
      INSERT INTO product_settings (organization_id, available_categories)
      VALUES (${organizationId}, ${available_categories || []})
      RETURNING *
    `;

    const settings = result[0];
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error creating product settings:', error);
    return NextResponse.json(
      { error: 'Failed to create product settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateProductSettingsRequest = await request.json();
    const { available_categories } = body;

    // Get user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Update product settings
    const result = await sql`
      UPDATE product_settings 
      SET available_categories = ${available_categories || []}, updated_at = NOW()
      WHERE organization_id = ${organizationId}
      RETURNING *
    `;

    if (result.length === 0) {
      // Create settings if they don't exist
      const createResult = await sql`
        INSERT INTO product_settings (organization_id, available_categories)
        VALUES (${organizationId}, ${available_categories || []})
        RETURNING *
      `;
      return NextResponse.json(createResult[0]);
    }

    const settings = result[0];
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating product settings:', error);
    return NextResponse.json(
      { error: 'Failed to update product settings' },
      { status: 500 }
    );
  }
} 