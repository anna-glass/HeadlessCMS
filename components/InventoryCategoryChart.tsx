"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader } from "@/components/ui/loader";

interface CategoryData {
  category: string;
  draft: number;
  live: number;
  sold: number;
  scheduled: number;
  archived: number;
}

const STATUS_COLORS = {
  draft: '#f59e0b',
  live: '#10b981',
  sold: '#8b5cf6',
  scheduled: '#3b82f6',
  archived: '#6b7280'
};

export function InventoryCategoryChart() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategoryData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dashboard/inventory-category');
      if (response.ok) {
        const data = await response.json();
        setCategoryData(data);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label || 'Uncategorized'}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory by Category & Status</CardTitle>
        <CardDescription>
          Product distribution across categories and statuses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tickFormatter={formatNumber}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="draft" stackId="a" fill={STATUS_COLORS.draft} name="Draft" />
              <Bar dataKey="live" stackId="a" fill={STATUS_COLORS.live} name="Live" />
              <Bar dataKey="sold" stackId="a" fill={STATUS_COLORS.sold} name="Sold" />
              <Bar dataKey="scheduled" stackId="a" fill={STATUS_COLORS.scheduled} name="Scheduled" />
              <Bar dataKey="archived" stackId="a" fill={STATUS_COLORS.archived} name="Archived" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p>No category data available</p>
              <p className="text-sm">Add products with categories to see the breakdown</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 