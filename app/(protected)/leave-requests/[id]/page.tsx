import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/user-balances/status-badge';
import { format } from 'date-fns';
import { Calendar, Clock, FileText, ChevronLeft, User, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getLeaveRequestById } from '@/components/leave-requests/actions';
import { CancelRequestButton } from '@/components/leave-requests/cancel-request-button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeaveRequestDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  const { data: request, success, error } = await getLeaveRequestById(id);

  if (!success && error === 'Unauthorized') {
    redirect(`/login?callbackUrl=/leave-requests/${id}`);
  }

  if (!success || !request) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="rounded-xl text-slate-500 hover:text-slate-900">
          <Link href="/leave-requests" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Requests
          </Link>
        </Button>
        
        {request.status === 'pending' && (
          <CancelRequestButton id={request.id} />
        )}
      </div>

      <Card className="border-slate-100 shadow-none rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {request.leave_type} Leave Application
                </h1>
                <StatusBadge status={request.status} />
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-tight">
                ID: {request.id}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                <Calendar className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Leave Period
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {format(new Date(request.start_date), 'MMM d, yyyy')}
                </p>
                <p className="text-xs text-slate-400">to</p>
                <p className="text-base font-semibold text-slate-800">
                  {format(new Date(request.end_date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t sm:border-t-0 sm:border-l border-slate-200/60 pt-6 sm:pt-0 sm:pl-6">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                <Clock className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Duration
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {request.days} <span className="text-sm font-medium text-slate-500">Days</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
              <FileText className="h-3.5 w-3.5" />
              Reason for Absence
            </div>
            <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm text-slate-600 leading-relaxed min-h-[80px]">
              {request.reason ? (
                <span>&ldquo;{request.reason}&rdquo;</span>
              ) : (
                <span className="text-slate-300 italic">No reason provided for this request.</span>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-300" />
              <span>Submitted on {format(new Date(request.created_at), 'PPP p')}</span>
            </div>

            {request.status === 'approved' && (
              <div className="flex flex-col sm:items-end gap-1 bg-emerald-50/50 border border-emerald-100/50 px-3 py-2 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <User className="h-3.5 w-3.5" />
                  <span>
                    Approved by:{' '}
                    {request.approver_id === request.user_id ? 'Self' : 'Manager'}
                  </span>
                </div>
                {request.approved_at && (
                  <span className="text-[10px] text-emerald-600/80">
                    {format(new Date(request.approved_at), 'MMM d, yyyy p')}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}