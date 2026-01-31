import {
  CalendarCheck2,
  History,
  Plus,
  TrendingUp,
  ArrowRight,
  PieChart
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLeaveEntitlements } from "@/components/leave-entitlements/actions";

export default async function Page() {
  const { data: entitlements, success } = await getLeaveEntitlements();

  const totalAllocated = entitlements.reduce((acc, curr) => acc + curr.amount_days, 0);
  const usedDays = 0;
  const remainingDays = totalAllocated - usedDays;
  const usagePercentage = totalAllocated > 0 ? (usedDays / totalAllocated) * 100 : 0;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your leave status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entitlement</CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocated} Days</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-600 font-medium">Active balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usage Rate</CardTitle>
            <PieChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usagePercentage}%</div>
            <Progress value={usagePercentage} className="h-1.5 mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remainingDays} Days</div>
            <p className="text-xs text-muted-foreground mt-1">Available to use</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Entitlements</CardTitle>
              <CardDescription>Your last 5 records.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/leave-entitlements" className="flex items-center gap-1 text-primary">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {entitlements.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <History className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{item.leave_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.updated_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="font-bold text-sm">+{item.amount_days}</div>
                </div>
              ))}
              {entitlements.length === 0 && (
                <div className="text-center py-10 text-muted-foreground italic">No entitlements added yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start py-6 shadow-sm">
              <Link href="/leave-requests/create">
                <Plus className="mr-2 h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>Apply for Leave</span>
                  <span className="text-[10px] font-normal opacity-80">Submit a new request</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start py-6">
              <Link href="/leave-entitlements/create">
                <History className="mr-2 h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>Add Entitlement</span>
                  <span className="text-[10px] font-normal opacity-80">Increase balance</span>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}