import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';

export default function LeaveRequestLoading() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-slate-300 py-2 px-3">
          <ChevronLeft className="h-4 w-4" />
          <Skeleton className="h-4 w-24 bg-slate-200" />
        </div>
      </div>

      <Card className="border-slate-100 shadow-none rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-48 bg-slate-200 rounded-lg" />
                <Skeleton className="h-5 w-16 bg-slate-200 rounded-full" />
              </div>
              <Skeleton className="h-3 w-36 bg-slate-200/80 rounded" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <Skeleton className="h-11 w-11 bg-slate-200 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-16 bg-slate-200 rounded" />
                <Skeleton className="h-5 w-32 bg-slate-200 rounded" />
                <Skeleton className="h-3 w-4 bg-slate-200/60 rounded" />
                <Skeleton className="h-5 w-32 bg-slate-200 rounded" />
              </div>
            </div>

            <div className="flex items-start gap-4 border-t sm:border-t-0 sm:border-l border-slate-200/60 pt-6 sm:pt-0 sm:pl-6">
              <Skeleton className="h-11 w-11 bg-slate-200 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-16 bg-slate-200 rounded" />
                <Skeleton className="h-8 w-20 bg-slate-200 rounded" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 bg-slate-200 rounded" />
              <Skeleton className="h-3 w-28 bg-slate-200 rounded" />
            </div>
            <div className="border border-slate-100 rounded-xl p-4 space-y-2 min-h-[80px]">
              <Skeleton className="h-4 w-full bg-slate-200/80 rounded" />
              <Skeleton className="h-4 w-5/6 bg-slate-200/80 rounded" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 bg-slate-200 rounded-full" />
              <Skeleton className="h-3 w-40 bg-slate-200" />
            </div>
            <Skeleton className="h-8 w-36 bg-slate-200/60 rounded-xl self-start sm:self-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
