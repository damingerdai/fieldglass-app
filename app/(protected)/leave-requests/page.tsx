import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/user-balances/status-badge";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Clock, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { getLeaveRequests } from "@/components/leave-requests/actions";
import { CancelRequestButton } from "@/components/leave-requests/cancel-request-button";

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
                   <Card key={request.id} className="group border-slate-100 shadow-none hover:border-slate-300 transition-all rounded-2xl">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row md:items-center p-8 gap-8">
                                
                                {/* 状态与假种 */}
                                <div className="flex flex-col gap-3 min-w-[150px]">
                                    <StatusBadge status={request.status} />
                                    <div className="space-y-1">
                                        <p className="font-bold text-base uppercase tracking-tight text-slate-800">
                                            {request.leave_type} Leave
                                        </p>
                                        {/* 审批来源标注：仅在已审批时显示 */}
                                        {request.status === "approved" && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                {request.approver_id === request.user_id ? "Self Approved" : "Manager Approved"}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 日期信息 */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-slate-50 rounded-xl">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Period</p>
                                            <p className="text-sm font-medium text-slate-600">
                                                {format(new Date(request.start_date), "MMM d")} — {format(new Date(request.end_date), "MMM d, yyyy")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-slate-50 rounded-xl">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Total</p>
                                            <p className="text-sm font-bold text-slate-900">{request.days} Days</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 备注 */}
                                {request.reason && (
                                    <div className="flex-1 hidden lg:flex items-start gap-2 max-w-xs border-l border-slate-50 pl-6">
                                        <FileText className="h-4 w-4 text-slate-200 shrink-0 mt-1" />
                                        <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">
                                            &ldquo;{request.reason}&rdquo;
                                        </p>
                                    </div>
                                )}

                                {/* 操作按钮 */}
                                <div className="flex items-center justify-end">
                                    {request.status === "pending" ? (
                                        <CancelRequestButton id={request.id} />
                                    ) : (
                                        <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-slate-900 rounded-xl">
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