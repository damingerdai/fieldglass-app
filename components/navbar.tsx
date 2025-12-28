import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import * as React from "react";
import { UserNav } from "./user-nav";

interface NavbarProps extends React.ComponentProps<"nav"> {
  title?: string;
  user?: User;
}

export const Navbar: React.FC<NavbarProps> = (props) => {
  const { title, user, className, ...rest } = props;

  return (
    <nav
      className={cn(
        className,
        "bg-background sticky top-0 z-50 px-4 h-16 w-full flex items-center shadow-md",
      )}
      {...rest}
    >
      <h1 className="font-bold hover:rotate-6">{title}</h1>
      <div className="flex-1"></div>
      <UserNav user={user || null} />
    </nav>
  );
};
