'use client';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import type * as React from 'react';
import { SidebarMenuItem } from './ui/sidebar';
import { SidebarMenuButton } from './app-sidebar-button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from 'cn';

interface AsideItemProps {
  title: React.ReactNode;
  icon: LucideIcon;
  href: string;
  onNavigate?: () => void;
}

export function AsideItem(props: AsideItemProps) {
  const { title, icon: Icon, href, onNavigate } = props;
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    pathname.startsWith(href) ||
    pathname.startsWith(`${href}/`);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={
          <Link
            href={href}
            onClick={onNavigate}
            className="w-full flex items-center"
          />
        }
        isActive={isActive}
        className={cn(
          'group relative flex items-center gap-3 px-3 py-6 rounded-xl transition-all duration-300',
          isActive
            ? 'bg-[#F4EEFC] text-[#7C3AED] shadow-sm shadow-purple-100/50'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center p-1.5 rounded-lg transition-colors',
            isActive ? 'bg-white shadow-sm' : 'group-hover:text-slate-900'
          )}
        >
          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span
          className={cn(
            'ml font-medium text-[14px] transition-all',
            isActive ? 'translate-x-0.5' : ''
          )}
        >
          {title}
        </span>
        {isActive && (
          <ChevronRight className="ml-auto w-4 h-4 opacity-50 animate-in slide-in-from-left--2 duration-300" />
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
