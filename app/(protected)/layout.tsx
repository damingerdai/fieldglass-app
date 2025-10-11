import { Navbar } from "@/components/navbar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarMenuButton } from "@/components/app-sidebar-button";
import { createClient } from "@/utils/supabase/server";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar title="Fieldglass App" user={data?.user} />
      <div className="flex w-full h-[calc(100vh - 64px]">
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
        <main>{children}</main>
      </div>
    </>
  );
}
