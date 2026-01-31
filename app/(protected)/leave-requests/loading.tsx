import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto bg-white">
            <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 bg-slate-100" />
                    <Skeleton className="h-4 w-64 bg-slate-50" />
                </div>
                <Skeleton className="h-11 w-32 rounded-xl bg-slate-900/5" />
            </div>

            <div className="grid gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="flex flex-col md:flex-row items-center p-8 gap-8 border border-slate-50 rounded-2xl"
                    >
                        <div className="space-y-3 min-w-[140px]">
                            <Skeleton className="h-5 w-20 rounded-full bg-slate-100" />
                            <Skeleton className="h-6 w-28 bg-slate-100" />
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-lg bg-slate-50" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-12 bg-slate-50" />
                                    <Skeleton className="h-4 w-32 bg-slate-100" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-lg bg-slate-50" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-12 bg-slate-50" />
                                    <Skeleton className="h-4 w-16 bg-slate-100" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end w-full md:w-auto">
                            <Skeleton className="h-9 w-24 rounded-lg bg-slate-50" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}