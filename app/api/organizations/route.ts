//
// organizations/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// organizations api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../stack';
import { Organization, CreateOrganizationRequest } from '@/lib/types/organization';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateOrganizationRequest = await request.json();
    const { name, domain, slug, logo_url } = body;

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Insert organization into database
    const result = await sql`
      INSERT INTO organizations (user_id, name, domain, slug, logo_url)
      VALUES (${user.id}, ${name}, ${domain || null}, ${generatedSlug}, ${logo_url || null})
      RETURNING *
    `;

    const organization: Organization = result[0] as Organization;

    return NextResponse.json(organization);
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
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

    // Get user's organizations
    const userOrganizations = await sql`
      SELECT * FROM organizations WHERE user_id = ${user.id}
    `;

    return NextResponse.json(userOrganizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
} 