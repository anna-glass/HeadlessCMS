//
// drop.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// drop types
//

export interface Drop {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  products?: Product[]; // Products included in this drop
}

export interface CreateDropRequest {
  title: string;
  description?: string;
  scheduled_at: string;
  product_ids?: string[]; // Array of product IDs to include in the drop
}

export interface UpdateDropRequest {
  title?: string;
  description?: string;
  scheduled_at?: string;
  status?: "scheduled" | "live" | "completed" | "cancelled";
  product_ids?: string[]; // Array of product IDs to include in the drop
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category?: string;
  status: "draft" | "scheduled" | "live" | "sold" | "archived";
  drop_id?: string;
  created_at: string;
  updated_at: string;
} 