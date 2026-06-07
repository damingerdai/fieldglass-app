import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 text-center">
      <h1 className="text-9xl font-black text-slate-200 select-none">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-4">Page Not Found</h2>
      <p className="text-slate-500 mt-2 max-w-sm">
        Sorry, the page you are looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Button asChild className="mt-6 rounded-xl">
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
