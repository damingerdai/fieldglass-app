'use server';

import { createClient } from '@/utils/supabase/server';
import { CreateLeaveEntitlementsSchema } from './schema';
import { revalidatePath } from 'next/cache';
import { LeaveEntitlements } from '@/types/leave-entitlement';

export async function createLeaveEntitlements(
  data: CreateLeaveEntitlementsSchema
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: 'Unauthorized: Please login to perform this action'
    };
  }

  const { data: result, error } = await supabase
    .from('leave_entitlements')
    .insert({
      user_id: user.id,
      leave_type: data.leave_type,
      amount_days: data.amount_days,
      effective_date: data.effective_date,
      expiry_date: data.expiry_date,
      notes: data.notes
    });

  if (error) {
    return {
      success: false,
      error: error.message
    };
  }

  revalidatePath('/leave-entitlements');

  return { success: true, data: result };
}

export async function getLeaveEntitlements() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized', data: [] };
  }

  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from('leave_entitlements')
    .select(
      `
            id,
            user_id,
            leave_type,
            amount_days,
            effective_date,
            expiry_date,
            notes,
            created_at,
            updated_at    
        `
    )
    .is('deleted_at', null)
    .eq('user_id', user.id)
    .or(`expiry_date.is.null,expiry_date.gte.${today}`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Fetch error:', error.message);
    return { success: false, error: 'Failed to fetch data', data: [] };
  }

  return { success: true, data: data as LeaveEntitlements };
}

export async function updateLeaveAmount(id: string, newAmount: number) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('leave_entitlements')
    .update({
      amount_days: newAmount,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/leave-entitlements');
  return { success: true };
}

export async function deleteLeaveEntitlement(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Unauthorized: Please log in first.' };
  }

  const { error } = await supabase
    .from('leave_entitlements')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/leave-entitlements');
  return { success: true };
}
