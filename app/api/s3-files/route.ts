import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../stack';
import { sql } from '@/lib/db';
import { S3File } from '@/lib/types/s3-file';

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
      return NextResponse.json(
        { error: 'User has no organization' }, 
        { status: 400 }
      );
    }

    const organizationId = userOrganizations[0].id;

    // Get S3 files for this organization
    const s3Files = await sql`
      SELECT * FROM s3_files 
      WHERE organization_id = ${organizationId}
      ORDER BY upload_timestamp DESC
    `;

    return NextResponse.json(s3Files as S3File[]);
  } catch (error) {
    console.error('Error fetching S3 files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch S3 files' },
      { status: 500 }
    );
  }
} 