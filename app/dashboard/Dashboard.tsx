'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/types/product";
import { DashboardStats } from "@/lib/types/transaction";
import { DollarSign, ShoppingCart, Bell } from "lucide-react";
import { RevenueChart } from "@/components/RevenueChart";
import { InventoryAddedChart } from "@/components/InventoryAddedChart";
import { InventoryStatusDonut } from "@/components/InventoryStatusDonut";
import { InventoryCategoryChart } from "@/components/InventoryCategoryChart";
import { PageLoader } from "@/components/ui/loader";

interface DashboardProps {
  products: Product[];
}

export default function Dashboard({ products }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    total_revenue: 0,
    total_sales: 0,
    total_products: 0,
    recent_transactions: [],
    top_selling_products: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Sales and inventory overview
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
    </div>
  );
} 