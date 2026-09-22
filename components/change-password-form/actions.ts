'use server';
import { type ChangePasswordInput, changePasswordSchema } from './schemas';
import { createClient } from '@/utils/supabase/server';

export type ChangePasswordResult =
  | {
      errors: Record<keyof ChangePasswordInput, string[]> | string;
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
    confirmPassword: formData.get('confirmPassword')
  });

  if (!parse.success) {
    const fieldErrors: Record<keyof ChangePasswordInput, string[]> = {
      currentPassword: [],
      password: [],
      confirmPassword: []
    };

    parse.error.issues.forEach(issue => {
      const field = issue.path[0];
      if (
        field === 'currentPassword' ||
        field === 'password' ||
        field === 'confirmPassword'
      ) {
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

  const { error: verifyError } = await supabase.auth.signInWithPassword({
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

  const { error: updateError } = await supabase.auth.updateUser({
    password: parse.data.password
  });

  if (updateError) {
    return { errors: updateError.message };
  }

  return { message: 'Password updated successfully!' };
}
