'use server';
import { type ProfileInput, profileSchema } from './schemas';
import { createClient } from '@/utils/supabase/server';

export type ProfileSubmitResult =
  | {
      errors: Record<keyof ProfileInput, string[]> | string;
      message?: never;
    }
  | { errors?: never; message: string };

export async function updateUserProfile(
  _prevState: ProfileSubmitResult,
  formData: FormData
): Promise<ProfileSubmitResult> {
  const parse = profileSchema.safeParse({
    fullName: formData.get('fullName')
  });

  if (!parse.success) {
    const fieldErrors: Record<'fullName', string[]> = { fullName: [] };

    parse.error.issues.forEach(issue => {
      const field = issue.path[0];
      if (field === 'fullName') {
        fieldErrors[field].push(issue.message);
      }
    });

    return { errors: fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: parse.data.fullName }
  });

  if (error) {
    return { errors: error.message };
  }

  return { message: 'Profile updated successfully!' };
}
