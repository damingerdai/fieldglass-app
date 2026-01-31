import { Button } from "@/components/ui/button";
import { Calculator, CalendarDays, Clock, Inbox, Plus } from "lucide-react";
import Link from "next/link";
import { getLeaveEntitlements } from "@/components/leave-entitlements/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DeleteLeaveEntitlementsButton } from "@/components/leave-entitlements";

export default async function Page() {
    const { data: entitlements, success, error } = await getLeaveEntitlements();
    if (!success) {
        return (
            <div className="p-6 text-destructive bg-destructive/10 rounded-lg">
                Error loading data: {error}
            </div>
        );
    }

    const totalDays = entitlements.reduce((acc, curr) => acc + curr.amount_days, 0);
    const recentActivity = entitlements.length > 0 ? entitlements[0].updated_at : null;

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
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                        <Calculator className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDays} Days</div>
                        <p className="text-xs text-muted-foreground mt-1">Total accumulated leave</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Active Types</CardTitle>
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(entitlements.map(e => e.leave_type)).size}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Different leave categories</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {recentActivity ? format(new Date(recentActivity), "MMM d") : "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Recent record modification</p>
                    </CardContent>
                </Card>
            </div>
            {entitlements.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-16 text-center bg-muted/5 flex flex-col items-center">
                    <div className="p-4 rounded-full bg-muted mb-4">
                        <Inbox className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">No records found</h3>
                    <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
                        You haven&apos;t added any leave entitlements yet. Records will appear here once created.
                    </p>
                    <Button variant="outline" asChild>
                        <Link href="/leave-entitlements/create">Get Started</Link>
                    </Button>
                </div>
            ) : (
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/30 text-muted-foreground font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Leave Type</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Effective Date</th>
                                    <th className="px-6 py-4">Expiry Date</th>
                                    <th className="px-6 py-4">Notes</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {entitlements.map((item) => (
                                    <tr key={item.id} className="group hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="capitalize bg-white shadow-sm">
                                                    {item.leave_type}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-base font-bold text-foreground">
                                                {item.amount_days}
                                            </span>
                                            <span className="ml-1 text-xs text-muted-foreground">Days</span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium">
                                            {format(new Date(item.effective_date), "PP")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.expiry_date ? (
                                                <span className="text-muted-foreground italic">
                                                    {format(new Date(item.expiry_date), "PP")}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-muted-foreground truncate max-w-[150px]" title={item.notes || ""}>
                                                {item.notes || <span className="text-slate-300">No notes</span>}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DeleteLeaveEntitlementsButton id={item.id} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}   