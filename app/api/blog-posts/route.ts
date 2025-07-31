//
// blog-posts/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// blog posts api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../stack';
import { sql } from '@/lib/db';
import { BlogPost } from '@/lib/types/website';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: BlogPost = await request.json();
    const { title, image, body, slug } = body;

    if (!title) {
      return NextResponse.json({ error: 'Post title is required' }, { status: 400 });
    }

    // Get the user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Create the blog post
    const result = await sql`
      INSERT INTO posts (organization_id, title, slug, image_url, body)
      VALUES (${organizationId}, ${title}, ${slug || title.toLowerCase().replace(/\s+/g, '-')}, ${image || null}, ${body || null})
      RETURNING *
    `;

    const post = result[0];
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
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

    // Get the user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Get all blog posts for the organization
    const posts = await sql`
      SELECT * FROM posts 
      WHERE organization_id = ${organizationId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
} 