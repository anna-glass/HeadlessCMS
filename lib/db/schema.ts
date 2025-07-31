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
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'live', 'sold', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
*/