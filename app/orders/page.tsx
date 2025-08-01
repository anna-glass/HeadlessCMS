//
// orders/page.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// orders page
//

import SignInPage from "../signin/page";
import { stackServerApp } from "../stack";
import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/lib/check-organization";
import { sql } from "@/lib/db";
import OrdersPage from "./OrdersPage";

export default async function OrdersPageWrapper() {
  const user = await stackServerApp.getUser();

  if (!user) {
    return <SignInPage />;
  }

  // Check if user has an organization
  const organization = await checkUserOrganization();
  
  if (!organization) {
    // User doesn't have an organization, redirect to onboarding
    redirect('/onboarding');
  }

  // Fetch transactions for this user's organization
  let transactions: any[] = [];
  try {
    const userTransactions = await sql`
      SELECT t.*, p.name as product_name, p.images as product_images
      FROM transactions t
      JOIN products p ON t.product_id = p.id
      JOIN organizations o ON p.organization_id = o.id
      WHERE o.user_id = ${user.id}
      ORDER BY t.created_at DESC
    `;
    transactions = userTransactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }

  return (
    <div className="w-full">
      <OrdersPage initialData={transactions} />
    </div>
  );
} 