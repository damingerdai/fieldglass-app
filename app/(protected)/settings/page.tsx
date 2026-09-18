import { MFAManagement } from '@/components/mfa';

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account security settings.
        </p>
      </div>

      <MFAManagement />
    </div>
  );
}
