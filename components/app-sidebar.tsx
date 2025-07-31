'use client'

import { Home, Package, Edit, BarChart3, Globe, FileText } from "lucide-react"
import { useState } from "react"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

import Image from "next/image"
import { UserButton } from '@stackframe/stack';
import { Organization } from "@/lib/types/organization";
import { OrganizationEditModal } from "./organization-edit-modal";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Website",
    url: "/website",
    icon: Globe,
  },
  {
    title: "Blog Posts",
    url: "/blog-posts",
    icon: FileText,
  },
]

interface AppSidebarProps {
  organization: Organization | null;
}

export function AppSidebar({ organization }: AppSidebarProps) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(organization);

  const handleOrganizationUpdated = (updatedOrganization: Organization) => {
    setCurrentOrganization(updatedOrganization);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-4">
          {currentOrganization?.logo_url ? (
            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
              <Image 
                src={currentOrganization.logo_url} 
                alt={currentOrganization.name} 
                width={40} 
                height={40} 
                className="w-full h-full object-cover"
                priority 
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-sm font-semibold truncate">
              {currentOrganization?.name || 'Organization'}
            </h3>
          </div>
          <OrganizationEditModal
            organization={currentOrganization}
            onOrganizationUpdated={handleOrganizationUpdated}
            trigger={
              <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                <Edit className="w-4 h-4 text-gray-500" />
              </button>
            }
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <UserButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}