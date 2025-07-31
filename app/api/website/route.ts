//
// website/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// website api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../stack';
import { sql } from '@/lib/db';
import { WebsiteData } from '@/lib/types/website';

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: WebsiteData = await request.json();

    // Get the user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({ error: 'No organization found for user' }, { status: 400 });
    }

    const organizationId = userOrganizations[0].id;

    // Get or create theme
    let themeId: string;
    if (body.theme && body.theme.startsWith('custom-')) {
      // Handle custom theme creation
      const customThemeName = body.theme.replace('custom-', '');
      const themeResult = await sql`
        INSERT INTO themes (name, color_primary, color_secondary, color_tertiary, color_light, color_dark, font_heading, font_body, radius, is_custom, organization_id)
        VALUES (${customThemeName}, '#475569', '#64748b', '#94a3b8', '#f1f5f9', '#0f172a', 'Inter', 'Inter', '0.5rem', true, ${organizationId})
        RETURNING id
      `;
      themeId = themeResult[0].id;
    } else {
      // Use existing theme or default to slate
      const themeName = body.theme || 'slate';
      const themeResult = await sql`
        SELECT id FROM themes WHERE name = ${themeName} AND is_custom = false LIMIT 1
      `;
      if (themeResult.length === 0) {
        return NextResponse.json({ error: 'Theme not found' }, { status: 400 });
      }
      themeId = themeResult[0].id;
    }

    // Get or create website
    let websiteResult = await sql`
      SELECT id FROM websites WHERE organization_id = ${organizationId}
    `;
    
    let websiteId: string;
    if (websiteResult.length === 0) {
      // Create new website
      const newWebsiteResult = await sql`
        INSERT INTO websites (organization_id, theme_id)
        VALUES (${organizationId}, ${themeId})
        RETURNING id
      `;
      websiteId = newWebsiteResult[0].id;
    } else {
      // Update existing website theme
      websiteId = websiteResult[0].id;
      await sql`
        UPDATE websites SET theme_id = ${themeId}, updated_at = NOW()
        WHERE id = ${websiteId}
      `;
    }

    // Save navigation data
    await sql`
      INSERT INTO navigations (website_id, announcement, logo_url)
      VALUES (${websiteId}, ${body.announcement || null}, ${body.logo || null})
      ON CONFLICT (website_id) DO UPDATE SET
        announcement = EXCLUDED.announcement,
        logo_url = EXCLUDED.logo_url,
        updated_at = NOW()
    `;

    const navigationResult = await sql`
      SELECT id FROM navigations WHERE website_id = ${websiteId}
    `;
    const navigationId = navigationResult[0].id;

    // Clear existing navigation items and insert new ones
    await sql`DELETE FROM navigation_items WHERE navigation_id = ${navigationId}`;
    
    // Filter out empty navigation items and only insert valid ones
    if (body.navigation_items && body.navigation_items.length > 0) {
      const validItems = body.navigation_items.filter(item => 
        item && item.label && item.label.trim() !== '' && item.slug && item.slug.trim() !== ''
      );
      
      for (let i = 0; i < validItems.length; i++) {
        const item = validItems[i];
        await sql`
          INSERT INTO navigation_items (navigation_id, label, slug, sort_order)
          VALUES (${navigationId}, ${item.label}, ${item.slug}, ${i})
        `;
      }
    }

    // Save hero data
    await sql`
      INSERT INTO heroes (website_id, image_1_url, image_2_url, title, subtitle, cta_text, include_intro, intro_text)
      VALUES (${websiteId}, ${body.hero_image_1 || null}, ${body.hero_image_2 || null}, ${body.hero_title || null}, ${body.hero_subtitle || null}, ${body.hero_cta || null}, ${body.include_intro || false}, ${body.intro_text || null})
      ON CONFLICT (website_id) DO UPDATE SET
        image_1_url = EXCLUDED.image_1_url,
        image_2_url = EXCLUDED.image_2_url,
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        cta_text = EXCLUDED.cta_text,
        include_intro = EXCLUDED.include_intro,
        intro_text = EXCLUDED.intro_text,
        updated_at = NOW()
    `;

    // Save blog posts settings
    await sql`
      INSERT INTO post_settings (website_id, include_posts)
      VALUES (${websiteId}, ${body.include_blog || false})
      ON CONFLICT (website_id) DO UPDATE SET
        include_posts = EXCLUDED.include_posts,
        updated_at = NOW()
    `;

    // Clear existing post links and insert new ones
    await sql`DELETE FROM post_links WHERE website_id = ${websiteId}`;
    
    // Filter out empty blog posts and only insert valid ones
    if (body.blog_posts && body.blog_posts.length > 0) {
      const validPosts = body.blog_posts.filter(post => 
        post && post.title && post.title.trim() !== '' && post.slug && post.slug.trim() !== ''
      );
      
      for (let i = 0; i < validPosts.length; i++) {
        const post = validPosts[i];
        // Check if post exists, if not create it
        let postResult = await sql`
          SELECT id FROM posts WHERE slug = ${post.slug} AND organization_id = ${organizationId}
        `;
        
        let postId: string;
        if (postResult.length === 0) {
          // Create new post
          const newPostResult = await sql`
            INSERT INTO posts (organization_id, title, slug, image_url, body)
            VALUES (${organizationId}, ${post.title}, ${post.slug}, ${post.image || null}, ${post.body || null})
            RETURNING id
          `;
          postId = newPostResult[0].id;
        } else {
          postId = postResult[0].id;
        }
        
        // Link post to website
        await sql`
          INSERT INTO post_links (website_id, post_id, sort_order)
          VALUES (${websiteId}, ${postId}, ${i})
        `;
      }
    }

    // Save footer data
    await sql`
      INSERT INTO footers (website_id, include_email_list, email_list_title, email_list_cta)
      VALUES (${websiteId}, ${body.include_email_list || false}, ${body.email_list_title || null}, ${body.email_list_cta || null})
      ON CONFLICT (website_id) DO UPDATE SET
        include_email_list = EXCLUDED.include_email_list,
        email_list_title = EXCLUDED.email_list_title,
        email_list_cta = EXCLUDED.email_list_cta,
        updated_at = NOW()
    `;

    const footerResult = await sql`
      SELECT id FROM footers WHERE website_id = ${websiteId}
    `;
    const footerId = footerResult[0].id;

    // Clear existing footer items and insert new ones
    await sql`DELETE FROM footer_items WHERE footer_id = ${footerId}`;
    
    // Filter out empty footer items and only insert valid ones
    if (body.footer_items && body.footer_items.length > 0) {
      const validItems = body.footer_items.filter(item => 
        item && item.label && item.label.trim() !== '' && item.slug && item.slug.trim() !== ''
      );
      
      for (let i = 0; i < validItems.length; i++) {
        const item = validItems[i];
        await sql`
          INSERT INTO footer_items (footer_id, label, slug, sort_order)
          VALUES (${footerId}, ${item.label}, ${item.slug}, ${i})
        `;
      }
    }

    // Clear existing social links and insert new ones
    await sql`DELETE FROM social_links WHERE footer_id = ${footerId}`;
    
    // Filter out empty social links and only insert valid ones
    if (body.social_links && body.social_links.length > 0) {
      const validLinks = body.social_links.filter(link => 
        link && link.trim() !== ''
      );
      
      for (const link of validLinks) {
        // Extract platform from URL or use a default
        const platform = link.includes('instagram') ? 'Instagram' :
                        link.includes('facebook') ? 'Facebook' :
                        link.includes('pinterest') ? 'Pinterest' :
                        link.includes('tiktok') ? 'TikTok' : 'Other';
        
        await sql`
          INSERT INTO social_links (footer_id, platform, url)
          VALUES (${footerId}, ${platform}, ${link})
        `;
      }
    }

    return NextResponse.json({ success: true, websiteId });
  } catch (error) {
    console.error('Error saving website data:', error);
    return NextResponse.json(
      { error: 'Failed to save website data' },
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

    // Get website data
    const websiteResult = await sql`
      SELECT w.*, t.name as theme_name
      FROM websites w
      JOIN themes t ON w.theme_id = t.id
      WHERE w.organization_id = ${organizationId}
    `;

    if (websiteResult.length === 0) {
      return NextResponse.json({ error: 'No website found' }, { status: 404 });
    }

    const website = websiteResult[0];

    // Get navigation data
    const navigationResult = await sql`
      SELECT * FROM navigations WHERE website_id = ${website.id}
    `;
    
    const navigationItemsResult = await sql`
      SELECT * FROM navigation_items 
      WHERE navigation_id = ${navigationResult[0]?.id || null}
      ORDER BY sort_order
    `;

    // Get hero data
    const heroResult = await sql`
      SELECT * FROM heroes WHERE website_id = ${website.id}
    `;

    // Get blog posts data
    const postSettingsResult = await sql`
      SELECT * FROM post_settings WHERE website_id = ${website.id}
    `;
    
    const postLinksResult = await sql`
      SELECT pl.*, p.title, p.slug, p.image_url, p.body
      FROM post_links pl
      JOIN posts p ON pl.post_id = p.id
      WHERE pl.website_id = ${website.id}
      ORDER BY pl.sort_order
    `;

    // Get footer data
    const footerResult = await sql`
      SELECT * FROM footers WHERE website_id = ${website.id}
    `;
    
    const footerItemsResult = await sql`
      SELECT * FROM footer_items 
      WHERE footer_id = ${footerResult[0]?.id || null}
      ORDER BY sort_order
    `;
    
    const socialLinksResult = await sql`
      SELECT * FROM social_links 
      WHERE footer_id = ${footerResult[0]?.id || null}
    `;

    // Construct WebsiteData object
    const websiteData: WebsiteData = {
      theme: website.theme_name,
      announcement: navigationResult[0]?.announcement || '',
      logo: navigationResult[0]?.logo_url || '',
      navigation_items: navigationItemsResult.map(item => ({
        label: item.label,
        slug: item.slug
      })),
      hero_image_1: heroResult[0]?.image_1_url || '',
      hero_image_2: heroResult[0]?.image_2_url || '',
      hero_title: heroResult[0]?.title || '',
      hero_subtitle: heroResult[0]?.subtitle || '',
      hero_cta: heroResult[0]?.cta_text || '',
      include_intro: heroResult[0]?.include_intro || false,
      intro_text: heroResult[0]?.intro_text || '',
      include_blog: postSettingsResult[0]?.include_posts || false,
      blog_posts: postLinksResult.map(link => ({
        title: link.title,
        image: link.image_url || '',
        body: link.body || '',
        slug: link.slug
      })),
      include_email_list: footerResult[0]?.include_email_list || false,
      email_list_title: footerResult[0]?.email_list_title || '',
      email_list_cta: footerResult[0]?.email_list_cta || '',
      social_links: socialLinksResult.map(link => link.url),
      footer_items: footerItemsResult.map(item => ({
        label: item.label,
        slug: item.slug
      }))
    };

    return NextResponse.json(websiteData);
  } catch (error) {
    console.error('Error fetching website data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch website data' },
      { status: 500 }
    );
  }
} 