//
// utils.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// utility functions
//

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { stackServerApp } from '../app/stack';
import { Organization } from './types/organization';
import { sql } from './db';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to generate URL-friendly slugs
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

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
