import { Navbar } from "@/components/navbar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar title="Fieldglass App" />
      <main className="flex min-h-screen px-4 pt-4">{children}</main>
    </>
  );
}
