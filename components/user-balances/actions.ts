"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUserBalances() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error('authError', authError)
        return { success: false, error: "Unauthorized", data: [] };
    }
    const { data, error } = await supabase
        .from("user_leave_balances")
        .select("*")
        .eq("user_id", user.id);
    if (error) return { success: false, error: error.message };
    return { success: true, data };
}