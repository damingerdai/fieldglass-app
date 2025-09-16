import { cn } from "@/lib/utils";
import * as React from "react";

interface NavbarProps extends React.ComponentProps<"nav"> {
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = (props) => {
  const { title, className, ...rest } = props;

  return (
    <nav
      className={cn(
        className,
        "sticky px-4 h-16 w-full z-10 flex items-center shadow-md",
      )}
      {...rest}
    >
      <h1 className="font-bold hover:rotate-6">{title}</h1>
      <div className="flex-1"></div>
    </nav>
  );
};
