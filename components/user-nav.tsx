'use client';

import { User } from '@supabase/supabase-js';
import {
  LogIn,
  LogOut,
  Settings,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserAvatar } from './user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/utils/supabase/client';

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative group h-9 w-9 rounded-xl overflow-hidden focus:outline-none ring-offset-background transition-all hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 active:scale-95 shadow-sm border border-slate-200">
          <UserAvatar email={user?.email ?? ''} />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-2 shadow-xl rounded-xl border-slate-100"
        forceMount
      >
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-primary/10 rounded-md text-[10px] font-bold text-primary flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    ACTIVE
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none text-slate-900 truncate capitalize">
                    {user.email?.split('@')[0]}
                  </p>
                  <p className="text-[11px] font-medium leading-tight text-slate-400 truncate mt-1">
                    {user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-2 bg-slate-50" />

            <DropdownMenuItem
              className="flex items-center px-3 py-2.5 rounded-lg text-slate-600 focus:bg-[#F4EEFC] focus:text-[#7C3AED] transition-colors cursor-pointer group"
              onClick={() => router.push('/settings')}
            >
              <Settings className="mr-3 h-4 w-4 text-slate-400 group-focus:text-[#7C3AED]" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-slate-50" />

            <DropdownMenuItem
              className="flex items-center px-3 py-2.5 rounded-lg text-red-500 focus:bg-red-50 focus:text-red-600 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() => router.push('/login')}
            className="flex items-center p-3 rounded-lg focus:bg-primary/5 cursor-pointer font-medium"
          >
            <LogIn className="mr-3 h-4 w-4 text-primary" />
            <span>Sign In to Dashboard</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
