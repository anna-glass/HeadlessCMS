//
// schema.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// database schema definitions
//

// SQL schema for organizations table:
/*
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- no foreign key constraint
  name TEXT NOT NULL,
  domain TEXT,
  slug TEXT UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
*/

// SQL schema for s3_files table:
/*
CREATE TABLE s3_files (
  id SERIAL PRIMARY KEY,
  object_key TEXT UNIQUE NOT NULL,
  file_url TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  upload_timestamp TIMESTAMPTZ DEFAULT NOW(),
  file_size BIGINT NOT NULL
);
*/

// SQL schema for products table:
/*
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- stored in cents
  stock INTEGER NOT NULL DEFAULT 0,
  images TEXT[], -- array of image URLs
  category TEXT, -- single category per product
  drop_id UUID REFERENCES drops(id), -- nullable reference to drops table
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'live', 'sold', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
*/

// SQL schema for product_settings table:
/*
CREATE TABLE product_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    available_categories TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (organization_id)
);
*/

// SQL schema for themes table:
/*
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    color_primary VARCHAR(7) NOT NULL,
    color_secondary VARCHAR(7) NOT NULL,
    color_tertiary VARCHAR(7) NOT NULL,
    color_light VARCHAR(7) NOT NULL,
    color_dark VARCHAR(7) NOT NULL,
    font_heading VARCHAR(100) NOT NULL,
    font_body VARCHAR(100) NOT NULL,
    radius VARCHAR(20) NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (
      (is_custom = TRUE AND organization_id IS NOT NULL) OR
      (is_custom = FALSE AND organization_id IS NULL)
    )
);
*/

// SQL schema for websites table:
/*
CREATE TABLE websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    theme_id UUID NOT NULL REFERENCES themes(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (organization_id)
);
*/

// SQL schema for navigations table:
/*
CREATE TABLE navigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    announcement TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (website_id)
);
*/

// SQL schema for navigation_items table:
/*
CREATE TABLE navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    navigation_id UUID NOT NULL REFERENCES navigations(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
*/

// SQL schema for heroes table:
/*
CREATE TABLE heroes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    image_1_url TEXT,
    image_2_url TEXT,
    title TEXT,
    subtitle TEXT,
    cta_text VARCHAR(255),
    include_intro BOOLEAN DEFAULT TRUE,
    intro_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (website_id)
);
*/

// SQL schema for posts table:
/*
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    image_url TEXT,
    body TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
*/

// SQL schema for post_links table:
/*
CREATE TABLE post_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (website_id, post_id)
);
*/

// SQL schema for post_settings table:
/*
CREATE TABLE post_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    include_posts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (website_id)
);
*/

// SQL schema for footers table:
/*
CREATE TABLE footers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    include_email_list BOOLEAN DEFAULT TRUE,
    email_list_title VARCHAR(255),
    email_list_cta VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (website_id)
);
*/

// SQL schema for footer_items table:
/*
CREATE TABLE footer_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    footer_id UUID NOT NULL REFERENCES footers(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
*/

// SQL schema for social_links table:
/*
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    footer_id UUID NOT NULL REFERENCES footers(id) ON DELETE CASCADE,
    platform VARCHAR(100) NOT NULL, -- e.g. 'Instagram'
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (footer_id, platform)
);
*/

// SQL schema for drops table:
/*
CREATE TABLE drops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
*/