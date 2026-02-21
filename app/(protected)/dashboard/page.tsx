import {
  CalendarCheck2,
  History,
  Plus,
  TrendingUp,
  ArrowRight,
  PieChart,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getLeaveEntitlements } from '@/components/leave-entitlements/actions';
import { getUserBalances } from '@/components/user-balances/actions';

export default async function Page() {
  const [balancesRes, entitlementsRes] = await Promise.all([
    getUserBalances(),
    getLeaveEntitlements()
  ]);

  const balances = balancesRes.data || [];
  const entitlements = entitlementsRes.data || [];

  const totalGranted = balances.reduce(
    (acc, curr) => acc + Number(curr.granted),
    0
  );
  const totalUsed = balances.reduce((acc, curr) => acc + Number(curr.used), 0);
  const totalRemaining = totalGranted - totalUsed;
  const usagePercentage =
    totalGranted > 0 ? Math.round((totalUsed / totalGranted) * 100) : 0;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your real-time leave status from the cloud.
        </p>
      </div>

      {/* 第一行：全局指标统计 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Granted
            </CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-[#7C3AED]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {totalGranted}{' '}
              <span className="text-sm font-normal text-slate-400">Days</span>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> All active entitlements
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Global Usage
            </CardTitle>
            <PieChart className="h-4 w-4 text-[#7C3AED]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {usagePercentage}%
            </div>
            <Progress
              value={usagePercentage}
              className="h-2 mt-3 bg-slate-100"
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-80">
              Net Balance
            </CardTitle>
            <div className="p-1.5 bg-white/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalRemaining}{' '}
              <span className="text-sm font-normal opacity-70">Days</span>
            </div>
            <p className="text-xs mt-2 opacity-80">
              Available for new requests
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="col-span-4 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Leave Breakdown</CardTitle>
              <CardDescription>
                Real-time balance per leave type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {balances.map(b => (
                  <div key={b.leave_type} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold capitalize text-slate-700">
                        {b.leave_type} Leave
                      </span>
                      <span className="text-slate-500">
                        {b.remaining_balance} / {b.granted} Left
                      </span>
                    </div>
                    <Progress
                      value={(Number(b.used) / Number(b.granted)) * 100}
                      className="h-1.5"
                    />
                  </div>
                ))}
                {balances.length === 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground py-4 text-sm italic">
                    <AlertCircle className="h-4 w-4" /> No balances found. Add
                    an entitlement to start.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 最近流水 */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent History</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-[#7C3AED]"
              >
                <Link href="/leave-entitlements">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entitlements.slice(0, 3).map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#F4EEFC] flex items-center justify-center text-[#7C3AED]">
                        <History size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {item.leave_type}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {format(new Date(item.updated_at), 'MMM d')}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">
                      +{item.amount_days}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：快捷操作 */}
        <div className="col-span-3 space-y-6">
          <Card className="border-none shadow-sm bg-gradient-to-br from-white to-slate-50/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Ready for a break?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start py-6 shadow-sm">
                <Link href="/leave-requests/create">
                  <Plus className="mr-2 h-5 w-5" />
                  <div className="flex flex-col items-start">
                    <span>Apply for Leave</span>
                    <span className="text-[10px] font-normal opacity-80">
                      Submit a new request
                    </span>
                  </div>
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full justify-start py-7 border-slate-200 hover:bg-white hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
              >
                <Link href="/leave-entitlements/create">
                  <History className="mr-3 h-5 w-5 opacity-60" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Add Entitlement</span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                      Adjust user balances
                    </span>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* 提示卡片 */}
          <div className="p-5 rounded-2xl bg-[#F4EEFC] border border-[#7C3AED]/10">
            <h4 className="text-sm font-bold text-[#7C3AED] mb-1">
              Did you know?
            </h4>
            <p className="text-[12px] text-[#7C3AED]/70 leading-relaxed">
              Pending leave requests are not deducted from your balance until
              approved by an administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
