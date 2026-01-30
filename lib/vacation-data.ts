import { Vacations } from "@/types/vacation";
import { LeaveBalances } from "@/types/leave-balance";
import { createClient } from "@/utils/supabase/server";

export async function fetchUserVacations(): Promise<Vacations | null> {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error("Authentication Error:", userError?.message);
    return null;
  }

  const currentUserId = userData.user.id;

  const { data: vacations, error: dbError } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('user_id', currentUserId)
    .order('created_at', { ascending: false });

  if (dbError) {
    console.error("Database Fetch Error:", dbError.message);
    return null;
  }

  return vacations as Vacations
}

export async function fetchUserLeaveBalances(): Promise<LeaveBalances | null> {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    console.error("Authentication Error:", userError?.message);
    return null;
  }

  const currentUserId = userData.user.id;

  const { data: balances, error: dbError } = await supabase
    .from('user_leave_balances')
    .select('*')
    .eq('user_id', currentUserId);

  if (dbError) {
    console.error("Database Fetch Error:", dbError.message);
    return null;
  }

  return balances as LeaveBalances;
}