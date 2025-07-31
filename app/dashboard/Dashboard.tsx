'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/types/product";
import { calculateSalesStatistics, formatCurrency, formatPercentage, formatNumber } from "@/lib/dashboard-utils";
import { SalesStatistics } from "@/lib/types/dashboard";
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import Image from "next/image";

interface DashboardProps {
  products: Product[];
}

export default function Dashboard({ products }: DashboardProps) {
  const [stats] = useState<SalesStatistics>(() => calculateSalesStatistics(products));

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    trend 
  }: {
    title: string;
    value: string;
    description: string;
    icon: any;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center text-xs mt-1">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
              {trend.value}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your sales and inventory performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          description="Total revenue from sold items"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Sold Items"
          value={formatNumber(stats.totalSoldItems)}
          description="Total number of items sold"
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Average Order Value"
          value={formatCurrency(stats.averageOrderValue)}
          description="Average revenue per sale"
          icon={Package}
          trend={{ value: -2.1, isPositive: false }}
        />
        <StatCard
          title="Conversion Rate"
          value={formatPercentage(stats.conversionRate)}
          description="Percentage of items sold"
          icon={Users}
          trend={{ value: 5.3, isPositive: true }}
        />
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue trends over the last 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Revenue chart will be implemented here</p>
                <p className="text-sm">Using a charting library like Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>
              Current inventory breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Products</span>
              <span className="font-medium">{stats.inventoryStatus.totalProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Live Products</span>
              <span className="font-medium text-green-600">{stats.inventoryStatus.liveProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Draft Products</span>
              <span className="font-medium text-yellow-600">{stats.inventoryStatus.draftProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Sold Products</span>
              <span className="font-medium text-blue-600">{stats.inventoryStatus.soldProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Low Stock</span>
              <span className="font-medium text-orange-600">{stats.inventoryStatus.lowStockProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Out of Stock</span>
              <span className="font-medium text-red-600">{stats.inventoryStatus.outOfStockProducts}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>
            Your best performing products by revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topSellingProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {product.image ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.totalSold} sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-muted-foreground">#{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sold products yet</p>
              <p className="text-sm">Start selling to see your top performers</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 