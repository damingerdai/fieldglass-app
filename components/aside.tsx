'use client';

import type * as React from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from './ui/sidebar';
import {
  CalendarCheck2,
  LayoutDashboard,
  SendHorizontal,
  Settings,
  UserRound
} from 'lucide-react';
import Link from 'next/link';
import { AsideItem } from '@/components/aside-item';

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    title: 'Leave Entitlements',
    href: '/leave-entitlements',
    icon: CalendarCheck2
  },
  { title: 'My Requests', href: '/leave-requests', icon: SendHorizontal }
];

const footerItems = [
  { title: 'Profile', href: '/profile', icon: UserRound },
  { title: 'Settings', href: '/settings', icon: Settings }
];

interface AsideProps {
  onNavigate?: () => void;
}

export const Aside: React.FC<AsideProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col justify-between h-full w-full bg-white/80 backdrop-blur-md">
      <SidebarGroup className="border-b pb-6">
        <SidebarGroupLabel className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">
          Main Menu
        </SidebarGroupLabel>
        <SidebarGroupContent className="px-2">
          <SidebarMenu className="gap-1">
            {navItems.map(item => (
              <AsideItem
                key={item.title}
                title={item.title}
                icon={item.icon}
                href={item.href}
                onNavigate={onNavigate}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupContent className="px-2 pb-2">
          <SidebarMenu className="gap-1">
            {footerItems.map(item => (
              <AsideItem
                key={item.title}
                title={item.title}
                icon={item.icon}
                href={item.href}
                onNavigate={onNavigate}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <Link
          href="/premium-upgrade"
          onClick={onNavigate}
          className="mt-auto p-4 mx-4 mb-6 rounded-2xl bg-linear-to-br from-[#7C3AED]/5 to-[#F4EEFC] border border-[#F4EEFC]"
        >
          <p className="text-[12px] font-semibold text-[#7C3AED]">
            Premium Plan
          </p>
          <p className="text-[11px] text-[#7C3AED]/60">
            Manage leave efficiently.
          </p>
        </Link>
      </SidebarGroup>
    </div>
  );
};
