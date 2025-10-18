import * as React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import { SidebarMenuButton } from "./app-sidebar-button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export const Aside: React.FC = () => {
  return (
    <aside className="flex flex-col w-56 border-r border-solid border-[#F4EEFC]">
      <SidebarGroup>
        <SidebarGroupLabel>Home</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="dashboard">
                  <HomeIcon />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </aside>
  );
};
