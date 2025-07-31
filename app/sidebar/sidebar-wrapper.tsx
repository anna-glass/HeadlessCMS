//
// sidebar-wrapper.tsx
// anna 6/29/25
// chapter street inc, 2025 ©
// sidebar wrapper component
//

import { checkUserOrganization } from "@/lib/check-organization";
import { AppSidebar } from "./app-sidebar";

export async function SidebarWrapper() {
  const organization = await checkUserOrganization();
  
  return <AppSidebar organization={organization} />;
} 