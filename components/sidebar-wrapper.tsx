import { checkUserOrganization } from "@/lib/check-organization";
import { AppSidebar } from "./app-sidebar";

export async function SidebarWrapper() {
  const organization = await checkUserOrganization();
  
  return <AppSidebar organization={organization} />;
} 