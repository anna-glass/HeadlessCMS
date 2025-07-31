import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../../stack';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { objectKey, publicFileUrl, fileSize } = await request.json();
    
    if (!objectKey || !publicFileUrl || !fileSize) {
      return NextResponse.json(
        { error: 'objectKey, publicFileUrl, and fileSize are required' }, 
        { status: 400 }
      );
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

    // Save metadata to s3_files table
    await sql`
      INSERT INTO s3_files (object_key, file_url, organization_id, file_size)
      VALUES (${objectKey}, ${publicFileUrl}, ${organizationId}, ${fileSize})
    `;

    console.log(`Metadata saved for S3 object: ${objectKey}`);
    
    return NextResponse.json({ 
      success: true,
      objectKey,
      publicFileUrl,
      organizationId
    });
  } catch (error) {
    console.error('Metadata Save Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save metadata' }, 
      { status: 500 }
    );
  }
} 