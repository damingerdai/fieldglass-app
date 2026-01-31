"use server";

import { createClient } from "@/utils/supabase/server";
import { CreateLeaveEntitlementsSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function createLeaveEntitlements(data: CreateLeaveEntitlementsSchema) {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return {
            success: false,
            error: "Unauthorized: Please login to perform this action"
        };
    }

    const { data: result, error } = await supabase.from("leave_entitlements").insert({
        user_id: user.id,
        leave_type: data.leave_type,
        amount_days: data.amount_days,
        effective_date: data.effective_date,
        expiry_date: data.expiry_date,
        notes: data.notes,
    });

    if (error) {
        return {
            success: false,
            error: error.message
        };
    }

    revalidatePath("/leave-entitlements");

    return { success: true, data: result };
}