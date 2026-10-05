'use server';
import { createClient as createAuthClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { getSupabaseConfig } from '@/utils/supabase/config';
import { type ChangePasswordInput, changePasswordSchema } from './schemas';
import { createClient } from '@/utils/supabase/server';

export type ChangePasswordResult =
  | {
      errors: Partial<Record<keyof ChangePasswordInput, string[]>> | string;
      message?: never;
    }
  | { errors?: never; message: string };

export async function changePassword(
  _prevState: ChangePasswordResult,
  formData: FormData
): Promise<ChangePasswordResult> {
  const parse = changePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    code: formData.get('code') ?? ''
  });

  if (!parse.success) {
    const fieldErrors: Partial<Record<keyof ChangePasswordInput, string[]>> = {
      currentPassword: [],
      password: [],
      confirmPassword: []
    };

    parse.error.issues.forEach(issue => {
      const field = issue.path[0];
      if (
        field === 'currentPassword' ||
        field === 'password' ||
        field === 'confirmPassword' ||
        field === 'code'
      ) {
        fieldErrors[field] ??= [];
        fieldErrors[field].push(issue.message);
      }
    });

    return { errors: fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    return { errors: 'Unauthorized' };
  }

  const { data: factors, error: factorsError } =
    await supabase.auth.mfa.listFactors();
  if (factorsError) {
    return { errors: factorsError.message };
  }
  const factor = factors.totp.find(factor => factor.status === 'verified');
  if (factor && !/^\d{6}$/.test(parse.data.code)) {
    return { errors: { code: ['Enter the 6-digit authenticator code'] } };
  }

  // Checking the password must not replace the current MFA session.
  const { url, anonKey } = getSupabaseConfig();
  const passwordClient = createAuthClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  const { error: verifyError } = await passwordClient.auth.signInWithPassword({
    email: user.email,
    password: parse.data.currentPassword
  });

  if (verifyError) {
    return {
      errors: {
        currentPassword: ['Current password is incorrect'],
        password: [],
        confirmPassword: []
      }
    };
  }

  if (factor) {
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: factor.id,
      code: parse.data.code
    });
    if (error) {
      return { errors: { code: [error.message] } };
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parse.data.password
  });

  if (updateError) {
    return { errors: updateError.message };
  }

  revalidatePath('/settings');
  return { message: 'Password updated successfully!' };
}
