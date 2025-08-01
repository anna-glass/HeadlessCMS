//
// dashboard/stats/route.ts
// anna 6/29/25
// chapter street inc, 2025 ©
// dashboard stats api route
//

import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '../../../stack';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organization
    const userOrganizations = await sql`
      SELECT id FROM organizations WHERE user_id = ${user.id} LIMIT 1
    `;

    if (userOrganizations.length === 0) {
      return NextResponse.json({
        total_revenue: 0,
        total_sales: 0,
        total_products: 0,
        recent_transactions: [],
        top_selling_products: []
      });
    }

    const organizationId = userOrganizations[0].id;

    // Get total revenue (sum of all transaction amounts)
    const revenueResult = await sql`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM transactions 
      WHERE organization_id = ${organizationId}
    `;
    const total_revenue = revenueResult[0].total_revenue;

    // Get total sales (count of transactions)
    const salesResult = await sql`
      SELECT COUNT(*) as total_sales
      FROM transactions 
      WHERE organization_id = ${organizationId}
    `;
    const total_sales = salesResult[0].total_sales;

    // Get total products
    const productsResult = await sql`
      SELECT COUNT(*) as total_products
      FROM products 
      WHERE organization_id = ${organizationId}
    `;
    const total_products = productsResult[0].total_products;

    // Get recent transactions (last 10)
    const recentTransactions = await sql`
      SELECT 
        t.*,
        json_build_object(
          'id', p.id,
          'name', p.name,
          'description', p.description,
          'price', p.price,
          'stock', p.stock,
          'images', p.images,
          'category', p.category,
          'status', p.status,
          'created_at', p.created_at,
          'updated_at', p.updated_at
        ) as product
      FROM transactions t
      LEFT JOIN products p ON t.product_id = p.id
      WHERE t.organization_id = ${organizationId}
      ORDER BY t.created_at DESC
      LIMIT 10
    `;

    // Get top selling products
    const topSellingProducts = await sql`
      SELECT 
        p.id as product_id,
        p.name as product_name,
        SUM(t.quantity) as total_quantity,
        SUM(t.total_amount) as total_revenue
      FROM transactions t
      JOIN products p ON t.product_id = p.id
      WHERE t.organization_id = ${organizationId}
      GROUP BY p.id, p.name
      ORDER BY total_quantity DESC
      LIMIT 5
    `;

    return NextResponse.json({
      total_revenue,
      total_sales,
      total_products,
      recent_transactions: recentTransactions,
      top_selling_products: topSellingProducts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 