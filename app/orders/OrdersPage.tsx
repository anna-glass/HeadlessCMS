'use client'

import { useState, useEffect } from "react";
import OrdersTable from "@/components/OrdersTable";
import { PageLoader } from "@/components/ui/loader";

interface OrdersPageProps {
  initialData: any[];
}

export default function OrdersPage({ initialData }: OrdersPageProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View and manage your customer orders
        </p>
      </div>

      {/* Orders Table */}
      <OrdersTable initialData={initialData} />
    </div>
  );
} 