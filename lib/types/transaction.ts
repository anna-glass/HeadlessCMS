//
// transaction.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// transaction types
//

export interface Transaction {
  id: string;
  organization_id: string;
  product_id: string;
  quantity: number;
  unit_price: number; // stored in cents
  total_amount: number; // stored in cents
  created_at: string;
  product?: Product; // joined product data
}

export interface CreateTransactionRequest {
  product_id: string;
  quantity?: number;
  unit_price: number; // in cents
  total_amount: number; // in cents
}

export interface UpdateTransactionRequest {
  product_id?: string;
  quantity?: number;
  unit_price?: number; // in cents
  total_amount?: number; // in cents
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
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  total_sales: number;
  total_products: number;
  recent_transactions: Transaction[];
  top_selling_products: Array<{
    product_id: string;
    product_name: string;
    total_quantity: number;
    total_revenue: number;
  }>;
} 