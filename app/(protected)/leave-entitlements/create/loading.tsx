import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <div className="flex flex-col space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start space-x-3 rounded-md border p-4">
                            <Skeleton className="h-4 w-4 rounded-full mt-1" />
                            <div className="space-y-2 w-full">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-36" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-20 w-full" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}