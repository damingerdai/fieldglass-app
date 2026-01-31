import { Navbar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Aside } from "@/components/aside";

export default async function Layout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar title="Fieldglass App" user={data.user} />
      <div className="flex-1 md:grid md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block border-r border-slate-100 bg-white">
          <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
            <Aside />
          </div>
        </aside>

        <main className="flex-1 overflow-x-hidden bg-slate-50/30">
          <div className="h-full p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}