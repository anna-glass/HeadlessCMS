//
// page.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// home page
//

import { stackServerApp } from "./stack";
import SignInPage from "./signin/page";
import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/lib/check-organization";
import InventoryPage from "./inventory/page";

export default async function Home() {
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

  return <InventoryPage />;
}

