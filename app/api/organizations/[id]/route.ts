//
// organizations/[id]/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// individual organization api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../../stack';
import { sql } from '@/lib/db';

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
    const body = await request.json();
    const { name, domain, logo_url } = body;

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    // Update the organization (only if it belongs to the user)
    const result = await sql`
      UPDATE organizations 
      SET 
        name = ${name},
        domain = ${domain || null},
        logo_url = ${logo_url || null},
        updated_at = now()
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const organization = result[0];
    return NextResponse.json(organization);
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get the organization (only if it belongs to the user)
    const result = await sql`
      SELECT * FROM organizations 
      WHERE id = ${id} AND user_id = ${user.id}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const organization = result[0];
    return NextResponse.json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization' },
      { status: 500 }
    );
  }
} 