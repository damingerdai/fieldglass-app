import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Your Leave Entitlements
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Manage and view your available vacation and sick leave balances.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild size="sm" className="shadow-sm">
                        <Link href="/leave-entitlements/create" className="flex items-center gap-1">
                            <Plus className="w-4 h-4" />
                            <span>Create Entitlement</span>
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground bg-muted/20">
                Leave entitlements list will appear here...
            </div>
        </div>
    );
}   