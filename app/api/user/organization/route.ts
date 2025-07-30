//
// user/organization/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// check if user has organization
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../../stack';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's first organization
    const userOrganizations = await sql`
      SELECT * FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;
    
    const organization = userOrganizations.length > 0 ? userOrganizations[0] : null;
    
    return NextResponse.json({ organization });
  } catch (error) {
    console.error('Error checking user organization:', error);
    return NextResponse.json(
      { error: 'Failed to check user organization' },
      { status: 500 }
    );
  }
} 