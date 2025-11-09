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
    <>
      <Navbar title="Fieldglass App" user={data?.user} />
      <div className="flex w-full h-[calc(100vh_-_64px)]">
        <Aside />
        <main className="w-full">{children}</main>
      </div>
    </>
  );
}
