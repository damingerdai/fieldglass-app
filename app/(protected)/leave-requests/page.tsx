import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/user-balances/status-badge";
import { format } from "date-fns";
import { Calendar, Clock, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { getLeaveRequests } from "@/components/leave-requests/actions";

export default async function Page() {
    const { data: requests } = await getLeaveRequests();
    return (
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Leave Requests</h1>
                    <p className="text-muted-foreground mt-1">Track and manage your leave applications.</p>
                </div>
                <Button asChild>
                    <Link href="/leave-requests/create">
                        <Plus className="mr-2 h-4 w-4" /> New Request
                    </Link>
                </Button>
            </div>
            <div className="grid gap-4">
                {requests?.map((request) => (
                    <Card key={request.id} className="overflow-hidden hover:border-[#7C3AED]/30 transition-colors">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                                {/* 状态与假种 */}
                                <div className="flex flex-col gap-2 min-w-[140px]">
                                    <StatusBadge status={request.status} />
                                    <span className="font-bold text-lg capitalize">{request.leave_type} Leave</span>
                                </div>

                                {/* 日期信息 */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                            <Calendar className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                                            <p className="text-sm font-medium">
                                                {format(new Date(request.start_date), "MMM d")} - {format(new Date(request.end_date), "MMM d, yyyy")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                            <Clock className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Total Days</p>
                                            <p className="text-sm font-bold text-[#7C3AED]">{request.days} Days</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 备注（如果有） */}
                                {request.reason && (
                                    <div className="flex-1 hidden lg:flex items-start gap-2 max-w-xs">
                                        <FileText className="h-4 w-4 text-slate-300 shrink-0 mt-1" />
                                        <p className="text-sm text-slate-500 italic line-clamp-2">
                                            &ldquo;{request.reason}&rdquo;
                                        </p>
                                    </div>
                                )}

                                {/* 操作按钮 */}
                                <div className="flex items-center justify-end">
                                    {request.status === "pending" ? (
                                        <Button variant="outline" size="sm" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-100">
                                            Cancel Request
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/leave-requests/${request.id}`}>Details</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {requests?.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 italic">You haven&apos;t submitted any leave requests yet.</p>
                        <Button variant="link" asChild className="mt-2">
                            <Link href="/leave-requests/create">Apply for your first leave now</Link>
                        </Button>
                    </div >
                )
                }
            </div >
        </div>
    );
}