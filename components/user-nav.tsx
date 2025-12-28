"use client";

import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";

interface UserNavProps {
  user: User | null;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-9 w-9 rounded-full focus:outline-none ring-offset-background transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 active:scale-95">
          <UserAvatar email={user?.email ?? ""} />
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56" forceMount>
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">
                  {user.email?.split('@')[0]}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={() => router.push("/profile")}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem 
              className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={handleLogin} className="cursor-pointer">
            <LogIn className="mr-2 h-4 w-4" />
            <span>Sign In</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}