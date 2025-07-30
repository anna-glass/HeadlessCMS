//
// organization.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// organization types
//

export interface Organization {
  id: string;
  user_id: string;
  name: string;
  domain?: string;
  slug: string;
  logo_url?: string;
  created_at: string;
}

export interface CreateOrganizationRequest {
  name: string;
  domain?: string;
  slug?: string;
  logo_url?: string;
} 