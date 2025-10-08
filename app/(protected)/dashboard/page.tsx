"use client";

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>hello this is dashboard view</SidebarInset>
    </SidebarProvider>
  );
}
