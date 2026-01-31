"use client";

import * as React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import { SidebarMenuButton } from "./app-sidebar-button";
import { CalendarCheck2, ChevronRight, HomeIcon, LayoutDashboard, Palmtree, SendHorizontal, TreePalm } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Leave Entitlements", href: "/leave-entitlements", icon: CalendarCheck2 },
  { title: "My Requests", href: "/leave-requests", icon: SendHorizontal }
];

export const Aside: React.FC = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full w-full bg-white/80 backdrop-blur-md">
      <SidebarGroup>
        <SidebarGroupLabel className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
          Main Menu
        </SidebarGroupLabel>
        <SidebarGroupContent className="px-2">
          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-6 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-[#F4EEFC] text-[#7C3AED] shadow-sm shadow-purple-100/50"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Link href={item.href} className="w-full flex items-center">
                      <div className={cn(
                        "flex items-center justify-center p-1.5 rounded-lg transition-colors",
                        isActive ? "bg-white shadow-sm" : "group-hover:text-slate-900"
                      )}>
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      </div>

                      <span className={cn(
                        "ml-1 font-medium text-[14px] transition-all",
                        isActive ? "translate-x-0.5" : ""
                      )}>
                        {item.title}
                      </span>

                      {isActive && (
                        <ChevronRight className="ml-auto w-4 h-4 opacity-50 animate-in slide-in-from-left-2 duration-300" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <div className="mt-auto p-4 mx-4 mb-6 rounded-2xl bg-gradient-to-br from-[#7C3AED]/5 to-[#F4EEFC] border border-[#F4EEFC]">
        <p className="text-[12px] font-semibold text-[#7C3AED]">Premium Plan</p>
        <p className="text-[11px] text-[#7C3AED]/60">Manage leave efficiently.</p>
      </div>
    </div>
  );
};
