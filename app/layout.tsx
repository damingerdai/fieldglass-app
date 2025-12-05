import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fieldglass App",
  description: "A website to track your vacation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`antialiased`}>
        {children}
        <Toaster
            position="top-right"
          />
      </body>
    </html>
  );
}
