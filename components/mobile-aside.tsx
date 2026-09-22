'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Aside } from './aside';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

export function MobileAside() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<button type="button" className="p-2" />}>
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-70">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Mobile navigation side menu for Leave Flow application.
        </SheetDescription>
        <Aside onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
