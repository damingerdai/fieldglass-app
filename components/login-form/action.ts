'use server';

import { redirect } from 'next/navigation';
import { type LoginData, schemas } from './schemas';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type SubmitResult =
  | {
      errors: Record<keyof LoginData, string[]> | string;
      message?: never;
    }
  | { errors?: never; message: string };

export async function onSubmitAction(
  _preState: SubmitResult,
  formData: FormData
): Promise<SubmitResult> {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };
  const parse = schemas.safeParse(data);

  if (!parse.success) {
    const fieldErrors: Record<keyof LoginData, string[]> = {
      email: [],
      password: []
    };

    parse.error.issues.forEach(issue => {
      const field = issue.path[0];
      if (field === 'email' || field === 'password') {
        fieldErrors[field].push(issue.message);
      }
    });

    return {
      errors: fieldErrors,
      message: undefined
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return {
      message: undefined,
      errors: error?.message
    };
  }

  const { data: aal, error: aalError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (
    !aalError &&
    aal.nextLevel === 'aal2' &&
    aal.nextLevel !== aal.currentLevel
  ) {
    redirect('/mfa');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
