import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-2 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 border-b">
              <tr>
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[...Array(6)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-12" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-5 w-40" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
