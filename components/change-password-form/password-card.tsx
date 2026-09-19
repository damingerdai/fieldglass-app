import { KeyRound, Lock } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export function PasswordCard() {
  return (
    <Card className="border-none shadow-sm bg-white h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="size-5 text-primary" />
          Password
        </CardTitle>
        <CardDescription>
          Set a unique password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4EEFC] text-[#7C3AED]">
              <Lock className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">••••••••</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 hover:bg-white hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
            render={<Link href="/settings/change-password" />}
          >
            Change
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
