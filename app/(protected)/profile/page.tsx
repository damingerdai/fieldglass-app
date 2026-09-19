import { format } from 'date-fns';
import {
  AlertCircle,
  CalendarCheck2,
  Clock,
  Fingerprint,
  KeyRound,
  Mail,
  ShieldCheck,
  TrendingUp,
  type LucideIcon
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AvatarUpload } from '@/components/avatar-upload';
import { getUserBalances } from '@/components/user-balances/actions';
import { ProfileForm } from '@/components/profile-form';
import { createClient } from '@/utils/supabase/server';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Profile'
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const [{ data, error }, { data: aal }, balancesRes] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    getUserBalances()
  ]);

  if (error || !data?.user) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <p className="text-muted-foreground">Unable to load profile.</p>
      </div>
    );
  }

  const user = data.user;
  const balances = balancesRes.data || [];

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split('@')[0] ||
    'User';
  const provider =
    (user.app_metadata?.provider as string | undefined) || 'email';
  const isEmailVerified = !!user.email_confirmed_at;
  const isMfaEnabled = aal?.currentLevel === 'aal2';

  const totalGranted = balances.reduce(
    (acc, curr) => acc + Number(curr.granted),
    0
  );
  const totalUsed = balances.reduce((acc, curr) => acc + Number(curr.used), 0);
  const totalRemaining = totalGranted - totalUsed;
  const usagePercentage =
    totalGranted > 0 ? Math.round((totalUsed / totalGranted) * 100) : 0;

  const detailRows: {
    icon: LucideIcon;
    label: string;
    value: string;
    valueClassName?: string;
  }[] = [
    {
      icon: Fingerprint,
      label: 'User ID',
      value: user.id,
      valueClassName: 'font-mono text-xs'
    },
    {
      icon: KeyRound,
      label: 'Auth Provider',
      value: provider
    },
    {
      icon: CalendarCheck2,
      label: 'Member Since',
      value: user.created_at
        ? format(new Date(user.created_at), 'MMM d, yyyy')
        : '-'
    },
    {
      icon: Clock,
      label: 'Last Sign In',
      value: user.last_sign_in_at
        ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy HH:mm')
        : '-'
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Profile
        </h1>
        <p className="text-muted-foreground">
          View and manage your personal information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-7">
        <div className="md:col-span-4 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-24 bg-linear-to-r from-[#7C3AED] to-[#a78bfa]" />
            <CardContent className="relative -mt-12 pb-6">
              <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-md">
                <AvatarUpload
                  email={user.email ?? ''}
                  avatarUrl={
                    user.user_metadata?.avatar_url as string | undefined
                  }
                />
              </div>
              <div className="mt-4 space-y-1">
                <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
                <p className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  className={
                    isEmailVerified
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                  }
                >
                  {isEmailVerified ? (
                    <>
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3" /> Pending Verification
                    </>
                  )}
                </Badge>
                <Badge
                  variant="outline"
                  className="capitalize border-slate-200 text-slate-600"
                >
                  {provider} account
                </Badge>
                <Badge
                  className={
                    isMfaEnabled
                      ? 'bg-[#F4EEFC] text-[#7C3AED]'
                      : 'bg-slate-100 text-slate-500'
                  }
                >
                  MFA {isMfaEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                Click the avatar to upload a new one (JPG, PNG, WEBP or GIF, max
                1MB).
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Edit Profile</CardTitle>
              <CardDescription>
                Update your display name shown across the app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm
                defaultFullName={
                  (user.user_metadata?.full_name as string | undefined) ?? ''
                }
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
              <CardDescription>Read-only account information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {detailRows.map((row, index) => (
                <div key={row.label}>
                  {index > 0 && <Separator className="my-3 bg-slate-50" />}
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <row.icon className="h-4 w-4 text-slate-400 shrink-0" />
                      {row.label}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-medium text-slate-900 truncate sm:max-w-[55%] sm:text-right',
                        row.valueClassName
                      )}
                    >
                      {row.value}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1.5">
                <CardTitle className="text-lg">Leave Summary</CardTitle>
                <CardDescription>Your current balances.</CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-[#7C3AED]" />
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-slate-50 p-2.5 sm:p-3">
                  <p className="text-lg font-bold text-slate-900">
                    {totalGranted}
                  </p>
                  <p className="text-[11px] text-slate-400">Granted</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 sm:p-3">
                  <p className="text-lg font-bold text-slate-900">
                    {totalUsed}
                  </p>
                  <p className="text-[11px] text-slate-400">Used</p>
                </div>
                <div className="rounded-xl bg-[#F4EEFC] p-2.5 sm:p-3">
                  <p className="text-lg font-bold text-[#7C3AED]">
                    {totalRemaining}
                  </p>
                  <p className="text-[11px] text-[#7C3AED]/70">Remaining</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Overall usage</span>
                  <span>{usagePercentage}%</span>
                </div>
                <Progress
                  value={usagePercentage}
                  className="h-2 bg-slate-100"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-slate-200 hover:bg-white hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
                render={<Link href="/dashboard" />}
              >
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
