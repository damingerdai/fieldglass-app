import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import * as React from 'react';
import { UserNav } from './user-nav';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

interface NavbarProps extends React.ComponentProps<'nav'> {
  title?: string;
  user?: User;
}

export const Navbar: React.FC<NavbarProps> = props => {
  const { title, user, className, ...rest } = props;

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all',
        className
      )}
      {...rest}
    >
      <div className="mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 group transition-all"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg group-hover:rotate-6 transition-transform">
            <CalendarDays className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline-block font-bold text-xl tracking-tight uppercase">
            {title || 'Leave Flow'}
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2 hidden md:flex">
            <span className="text-sm font-medium leading-none">
              {user?.email?.split('@')[0]}
            </span>
            <span className="text-[10px] text-muted-foreground">
              Workspace active
            </span>
          </div>
          <UserNav user={user || null} />
        </div>
      </div>
    </nav>
  );
};
