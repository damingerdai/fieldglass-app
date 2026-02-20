"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CreateLeaveRequestSchema } from "./schema";

export async function getLeaveRequests() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized", data: [] };

    const { data, error } = await supabase
        .from("leave_requests")
        .select(`
            id,
            user_id,
            leave_type,
            start_date,
            end_date,
            days,
            status,
            reason,
            approver_id,
            approved_at, 
            created_at, 
            updated_at`)
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

    if (error) return { success: false, error: error.message, data: [] };
    return { success: true, data };
}

export async function createLeaveRequest(data: CreateLeaveRequestSchema) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };
    const { data: balanceData, error: balanceError } = await supabase
        .from("user_leave_balances")
        .select("remaining_balance")
        .eq("user_id", user.id)
        .eq("leave_type", data.leave_type)
        .maybeSingle();

    if (balanceError || !balanceData) {
        console.error("Error fetching leave balance:", balanceError);
        return { success: false, error: "Could not verify leave balance." };
    }

    if (balanceData.remaining_balance < data.days) {
        return { success: false, error: `Insufficient balance. Available: ${balanceData.remaining_balance} days.` };
    }

    const startWithTime = new Date(data.start_date);
    startWithTime.setHours(9, 0, 0, 0);
    const endWithTime = new Date(data.end_date);
    const hasHalfDay = data.days % 1 !== 0;

    if (hasHalfDay) {
        endWithTime.setHours(13, 0, 0, 0);
    } else {
        endWithTime.setHours(18, 0, 0, 0);
    }

    const { error } = await supabase.from("leave_requests").insert({
        user_id: user.id,
        leave_type: data.leave_type,
        days: data.days,
        start_date: startWithTime.toISOString(),
        end_date: endWithTime.toISOString(),
        reason: data.reason,
    });

    if (error) return { success: false, error: error.message };
    revalidatePath("/leave-requests");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function cancelLeaveRequest(requestId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
        .from("leave_requests")
        .update({ status: 'cancelled' })
        .eq("id", requestId)
        .eq("user_id", user.id)
        .eq("status", "pending");

    if (error) return { success: false, error: error.message };

    revalidatePath("/leave-requests");
    revalidatePath("/dashboard");
    return { success: true };
}