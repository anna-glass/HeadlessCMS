//
// dashboard/revenue/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// revenue data api route
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

    // Get query parameters for date range
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    // Get user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json([]);
    }

    const organizationId = userOrganizations[0].id;

    // Build the query with optional date filtering
    let query = sql`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as revenue,
        COUNT(*) as transactions
      FROM transactions 
      WHERE organization_id = ${organizationId}
    `;

    const params: any[] = [];
    if (fromDate) {
      query = sql`${query} AND created_at >= ${fromDate}`;
    }
    if (toDate) {
      query = sql`${query} AND created_at <= ${toDate}`;
    }

    query = sql`
      ${query}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const revenueData = await query;

    return NextResponse.json(revenueData);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
} 