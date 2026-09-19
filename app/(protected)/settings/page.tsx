import { MFAManagement } from '@/components/mfa';
import { PasswordCard } from '@/components/change-password-form';

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account security settings.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <MFAManagement />
        <PasswordCard />
      </div>
    </div>
  );
}
