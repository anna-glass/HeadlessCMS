//
// dashboard-utils.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// dashboard calculation utilities
//

import { Product } from './types/product';
import { SalesStatistics, TopSellingProduct, MonthlyRevenue, InventoryStatus } from './types/dashboard';

export function calculateSalesStatistics(products: Product[]): SalesStatistics {
  // Filter sold products
  const soldProducts = products.filter(p => p.status === 'sold');
  
  // Calculate total revenue (sum of prices of sold items)
  const totalRevenue = soldProducts.reduce((sum, product) => sum + product.price, 0);
  
  // Calculate total sold items
  const totalSoldItems = soldProducts.length;
  
  // Calculate average order value
  const averageOrderValue = totalSoldItems > 0 ? totalRevenue / totalSoldItems : 0;
  
  // Calculate conversion rate (sold items / total items)
  const conversionRate = products.length > 0 ? (totalSoldItems / products.length) * 100 : 0;
  
  // Calculate top selling products (for now, just use sold products)
  const topSellingProducts: TopSellingProduct[] = soldProducts
    .map(product => ({
      id: product.id,
      name: product.name,
      totalSold: 1, // Assuming 1 item sold per product for now
      revenue: product.price,
      image: product.images?.[0]
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  // Calculate revenue by month (mock data for now)
  const revenueByMonth: MonthlyRevenue[] = generateMockMonthlyRevenue();
  
  // Calculate inventory status
  const inventoryStatus = calculateInventoryStatus(products);
  
  return {
    totalRevenue,
    totalSoldItems,
    averageOrderValue,
    conversionRate,
    topSellingProducts,
    revenueByMonth,
    inventoryStatus
  };
}

function calculateInventoryStatus(products: Product[]): InventoryStatus {
  const totalProducts = products.length;
  const liveProducts = products.filter(p => p.status === 'live').length;
  const draftProducts = products.filter(p => p.status === 'draft').length;
  const soldProducts = products.filter(p => p.status === 'sold').length;
  const archivedProducts = products.filter(p => p.status === 'archived').length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  
  return {
    totalProducts,
    liveProducts,
    draftProducts,
    soldProducts,
    archivedProducts,
    lowStockProducts,
    outOfStockProducts
  };
}

function generateMockMonthlyRevenue(): MonthlyRevenue[] {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthKey = date.toISOString().slice(0, 7); // "2024-01"
    
    // Generate mock data with some randomness
    const revenue = Math.floor(Math.random() * 50000) + 10000; // $100-$600
    const soldItems = Math.floor(Math.random() * 20) + 1; // 1-20 items
    
    months.push({
      month: monthKey,
      revenue,
      soldItems
    });
  }
  
  return months;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount / 100); // Convert cents to dollars
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
} 