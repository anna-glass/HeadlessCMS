//
// inventory/page.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// inventory management page
//

import SignInPage from "../signin/page";
import { stackServerApp } from "../../stack";
import Inventory from "./Inventory";
import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/lib/check-organization";
import { sql } from "@/lib/db";
import { Product } from "@/lib/types/product";

export default async function InventoryPage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    return <SignInPage />;
  }

  // Check if user has an organization
  const organization = await checkUserOrganization();
  
  if (!organization) {
    // User doesn't have an organization, redirect to onboarding
    redirect('/admin/onboarding');
  }

  // Fetch products for this user's organization
  let products: Product[] = [];
  try {
    const userProducts = await sql`
      SELECT p.* FROM products p
      JOIN organizations o ON p.organization_id = o.id
      WHERE o.user_id = ${user.id}
      ORDER BY p.created_at DESC
    `;
    products = userProducts as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="w-full">
      <Inventory initialData={products} />
    </div>
  );
}
