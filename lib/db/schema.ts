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