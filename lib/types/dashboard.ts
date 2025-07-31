//
// dashboard.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// dashboard types and interfaces
//

export interface SalesStatistics {
  totalRevenue: number; // in cents
  totalSoldItems: number;
  averageOrderValue: number; // in cents
  conversionRate: number; // percentage
  topSellingProducts: TopSellingProduct[];
  revenueByMonth: MonthlyRevenue[];
  inventoryStatus: InventoryStatus;
}

export interface TopSellingProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number; // in cents
  image?: string;
}

export interface MonthlyRevenue {
  month: string; // "2024-01", "2024-02", etc.
  revenue: number; // in cents
  soldItems: number;
}

export interface InventoryStatus {
  totalProducts: number;
  liveProducts: number;
  draftProducts: number;
  soldProducts: number;
  archivedProducts: number;
  lowStockProducts: number; // products with stock < 10
  outOfStockProducts: number;
}

export interface DashboardFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: 'draft' | 'scheduled' | 'live' | 'sold' | 'archived';
} 