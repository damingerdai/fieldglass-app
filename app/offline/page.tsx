import { WifiOff } from 'lucide-react';

export const metadata = {
  title: 'Offline'
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <WifiOff className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          You are offline
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your connection seems unavailable. Cached pages can still be viewed,
          but actions need a network connection.
        </p>
      </div>
      <a
        href="/"
        className="text-sm font-medium text-[#7C3AED] underline underline-offset-4"
      >
        Retry
      </a>
    </div>
  );
}
