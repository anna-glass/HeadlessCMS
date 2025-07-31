//
// product.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// product types
//

export interface Product {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  price: number; // stored in cents
  stock: number;
  images: string[];
  category?: string; // single category per product
  drop_id?: string; // nullable reference to drops table
  status: "draft" | "scheduled" | "live" | "sold" | "archived";
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price?: number; // in cents
  stock?: number;
  images?: string[];
  category?: string;
  status?: "draft" | "scheduled" | "live" | "sold" | "archived"; // Optional for API, but always set to 'draft' for new products
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number; // in cents
  stock?: number;
  images?: string[];
  category?: string;
  status?: "draft" | "scheduled" | "live" | "sold" | "archived";
}

export interface ProductSettings {
  id: string;
  organization_id: string;
  available_categories: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateProductSettingsRequest {
  available_categories?: string[];
}

export interface UpdateProductSettingsRequest {
  available_categories?: string[];
} 