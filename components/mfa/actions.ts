'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export type VerifyResult = { errors?: string; message?: string };

export async function mfaVerifyAction(
  _prevState: VerifyResult,
  formData: FormData
): Promise<VerifyResult> {
  const code = (formData.get('code') as string) ?? '';

  const supabase = await createClient();

  const { data: factors, error: factorsError } =
    await supabase.auth.mfa.listFactors();
  if (factorsError) {
    return { errors: factorsError.message };
  }

  const totpFactor = factors?.totp?.[0];
  if (!totpFactor) {
    return { errors: 'No TOTP factors found!' };
  }

  const { data: challenge, error: challengeError } =
    await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
  if (challengeError) {
    return { errors: challengeError.message };
  }

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId: totpFactor.id,
    challengeId: challenge.id,
    code
  });
  if (verifyError) {
    return { errors: verifyError.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
