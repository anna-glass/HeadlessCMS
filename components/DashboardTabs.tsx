'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types/product";
import { DashboardStats } from "@/lib/types/transaction";
import { DollarSign, ShoppingCart, Bell, BarChart3, Receipt } from "lucide-react";
import { RevenueChart } from "@/components/RevenueChart";
import { InventoryAddedChart } from "@/components/InventoryAddedChart";
import { InventoryStatusDonut } from "@/components/InventoryStatusDonut";
import { InventoryCategoryChart } from "@/components/InventoryCategoryChart";
import SalesTable from "@/components/SalesTable";

interface DashboardTabsProps {
  products: Product[];
  transactions: any[];
}

export default function DashboardTabs({ products, transactions }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'sales'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    total_revenue: 0,
    total_sales: 0,
    total_products: 0,
    recent_transactions: [],
    top_selling_products: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100); // Convert from cents
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon 
  }: {
    title: string;
    value: string;
    description: string;
    icon: any;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats.total_revenue)}
          description="Revenue for the current month"
          icon={DollarSign}
        />
        <StatCard
          title="Monthly Sales"
          value={formatNumber(stats.total_sales)}
          description="Sales for the current month"
          icon={ShoppingCart}
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">New notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('overview')}
          className="flex items-center space-x-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span>Overview</span>
        </Button>
        <Button
          variant={activeTab === 'sales' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('sales')}
          className="flex items-center space-x-2"
        >
          <Receipt className="h-4 w-4" />
          <span>Sales</span>
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Charts and Detailed Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Revenue Chart */}
            <div className="col-span-4">
              <RevenueChart />
            </div>

            {/* Inventory Status Donut */}
            <div className="col-span-3">
              <InventoryStatusDonut />
            </div>
          </div>

          {/* Inventory Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Inventory Added Over Time */}
            <div>
              <InventoryAddedChart />
            </div>

            {/* Category Chart */}
            <div>
              <InventoryCategoryChart />
            </div>
          </div>
        </>
      )}

      {activeTab === 'sales' && (
        <div className="space-y-4">
          <SalesTable initialData={transactions} />
        </div>
      )}
    </div>
  );
} 