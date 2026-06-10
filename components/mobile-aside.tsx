'use client';

import { Menu } from 'lucide-react';
import { Aside } from './aside';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function MobileAside() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2">
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-[280px]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Mobile navigation side menu for Leave Flow application.
        </SheetDescription>
        <Aside />
      </SheetContent>
    </Sheet>
  );
}