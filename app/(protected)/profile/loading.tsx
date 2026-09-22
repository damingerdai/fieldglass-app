import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:gap-8 md:p-8">
      <span role="status" className="sr-only">
        Loading profile...
      </span>

      <div aria-hidden="true" className="flex flex-col gap-2">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-6 w-80 max-w-full" />
      </div>

      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-6 motion-reduce:[&_[data-slot=skeleton]]:animate-none md:grid-cols-7"
      >
        <div className="flex flex-col gap-6 md:col-span-4">
          <Card className="overflow-hidden border-none shadow-sm">
            <Skeleton className="h-24 w-full rounded-none" />
            <CardContent className="relative -mt-12 pb-6">
              <div className="size-24 rounded-2xl bg-card p-1 shadow-md">
                <Skeleton className="size-full rounded-2xl" />
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-5 w-56 max-w-full" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="mt-3 h-4 w-96 max-w-full" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-80 max-w-full" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 md:col-span-3">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-52 max-w-full" />
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {['user-id', 'provider', 'member-since', 'last-sign-in'].map(
                (id, index) => (
                  <div key={id}>
                    {index > 0 && <Separator className="my-3" />}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="size-4 shrink-0" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-5 w-36 max-w-full sm:max-w-[55%]" />
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-40 max-w-full" />
              </div>
              <Skeleton className="size-4 shrink-0" />
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-2">
                {['granted', 'used', 'remaining'].map(id => (
                  <Skeleton key={id} className="h-16 rounded-xl sm:h-17" />
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
