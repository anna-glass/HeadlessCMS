import SignInPage from "../signin/page";
import { stackServerApp } from "../stack";
import Inventory from "./Inventory";
import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/lib/check-organization";

export default async function InventoryPage() {
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

  return (
    <div className="w-9/10">
      <Inventory initialData={[]} />
    </div>
  );
}