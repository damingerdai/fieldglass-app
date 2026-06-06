import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function LeaveNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 max-w-md mx-auto text-center space-y-6">
      <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
        <FileQuestion className="h-12 w-12" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Request Not Found
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          The leave request you are looking for doesn&apos;t exist, or you might not have permission to view it.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <Button variant="outline" asChild className="rounded-xl w-full sm:flex-1">
          <Link href="/leave-requests" className="flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Link>
        </Button>
        <Button asChild className="rounded-xl w-full sm:flex-1">
          <Link href="/leave-requests/create" className="flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>
    </div>
  );
}