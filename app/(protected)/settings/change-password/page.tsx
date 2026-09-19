import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ChangePasswordForm } from '@/components/change-password-form';

export const metadata = {
  title: 'Change Password'
};

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto max-w-xl space-y-8 p-4 md:p-8">
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-slate-500 hover:text-slate-900"
          render={<Link href="/settings" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Settings
        </Button>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Change Password
          </h1>
          <p className="text-muted-foreground">
            Enter your current password and a new one to update it.
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Password Requirements</CardTitle>
          <CardDescription>
            At least 8 characters (max 16), containing both letters and numbers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
