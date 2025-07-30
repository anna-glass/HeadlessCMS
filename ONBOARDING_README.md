# Organization Onboarding Flow

This document describes the onboarding flow implementation for new users to create an organization after signing up.

## Overview

When a user creates an account using Stack Auth, they are automatically redirected to an onboarding flow where they must create an organization before accessing the main application.

## Flow

1. **User signs up** → Stack Auth handles account creation
2. **User is redirected to main app** → `/` page checks if user has an organization
3. **If no organization exists** → User is redirected to `/onboarding`
4. **User creates organization** → Form submits to `/api/organizations`
5. **User is redirected to main app** → Now with organization created

## Files Created/Modified

### New Files
- `app/onboarding/page.tsx` - Onboarding form page
- `app/api/organizations/route.ts` - API for creating organizations
- `app/api/user/organization/route.ts` - API for checking user organization
- `lib/check-organization.ts` - Server-side utility to check organization
- `lib/types/organization.ts` - TypeScript types for organization
- `lib/db/schema.ts` - Database schema reference

### Modified Files
- `app/page.tsx` - Added organization check and redirect logic
- `app/inventory/page.tsx` - Added organization check and redirect logic

## Database Schema

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- no foreign key constraint
  name TEXT NOT NULL,
  domain TEXT,
  slug TEXT UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Implementation Notes

### Current State
The implementation includes:
- ✅ Complete UI for organization creation
- ✅ API routes for organization management
- ✅ TypeScript types and interfaces
- ✅ Redirect logic for users without organizations
- ✅ Form validation and error handling

### TODO
You need to implement the actual database connection:

1. **Choose your ORM** (Drizzle, Prisma, etc.)
2. **Set up database connection** in `lib/db/`
3. **Replace placeholder code** in:
   - `app/api/organizations/route.ts`
   - `app/api/user/organization/route.ts`
   - `lib/check-organization.ts`

### Example Database Integration

If using Drizzle ORM:

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { organizations } from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// In your API routes:
const newOrg = await db.insert(organizations).values({
  user_id: user.id,
  name,
  domain,
  slug,
  logo_url
}).returning();

// Check user organization:
const userOrg = await db.select().from(organizations).where(eq(organizations.user_id, user.id)).limit(1);
```

## Features

- **Auto-generated slugs** from organization name
- **Form validation** with required fields
- **Error handling** with user-friendly messages
- **Responsive design** that matches your existing UI
- **Type safety** with TypeScript interfaces
- **Server-side validation** and authentication checks

## Testing

1. Create a new account using the signup page
2. You should be automatically redirected to `/onboarding`
3. Fill out the organization form
4. Submit and verify you're redirected to the main app
5. Try accessing `/inventory` - should work without redirect
6. Sign out and sign in with existing account - should go directly to main app 