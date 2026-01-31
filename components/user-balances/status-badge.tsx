import { cn } from "@/lib/utils";

const statusConfig = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-100 text-rose-700 border-rose-200",
    cancelled: "bg-slate-100 text-slate-700 border-slate-200",
};

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize", config)}>
            {status}
        </span>
    );
}