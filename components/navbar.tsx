import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import * as React from 'react';
import { UserNav } from './user-nav';
import Link from 'next/link';
import { AlertCircle, CalendarDays, CheckCircle2 } from 'lucide-react';
import { MobileAside } from './mobile-aside';

interface NavbarProps extends React.ComponentProps<'nav'> {
  title?: string;
  user?: User;
}

export const Navbar: React.FC<NavbarProps> = props => {
  const { title, user, className, ...rest } = props;

  const isEmailVerified = !!user?.email_confirmed_at;

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all',
        className
      )}
      {...rest}
    >
      <div className="mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8 gap-2">
        <div className="md:hidden">
          <MobileAside />
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 group transition-all"
        >
          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg group-hover:rotate-6 transition-transform">
            <CalendarDays className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline-block font-bold text-xl tracking-tight uppercase">
            {title || 'Fieldglass App'}
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          <div className="flex-col items-end mr-2 hidden md:flex">
            <span className="text-sm font-medium leading-none">
              {user?.email?.split('@')[0]}
            </span>
            {user && (
              <div className="flex items-center gap-1">
                {isEmailVerified ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Workspace active
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium animate-pulse">
                      Pending verification
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <UserNav user={user || null} />
        </div>
      </div>
    </nav>
  );
};
