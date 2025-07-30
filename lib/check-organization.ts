//
// check-organization.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// server-side function to check if user has organization
//

import { stackServerApp } from '../app/stack';
import { Organization } from './types/organization';
import { sql } from './db';

export async function checkUserOrganization(): Promise<Organization | null> {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return null;
    }

    // Get user's first organization
    const userOrganizations = await sql`
      SELECT * FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;
    
    return userOrganizations.length > 0 ? (userOrganizations[0] as Organization) : null;
  } catch (error) {
    console.error('Error checking user organization:', error);
    return null;
  }
} 