'use server';
import { createClient } from '@/utils/supabase/server';
import { ALLOWED_AVATAR_TYPES, MAX_AVATAR_SIZE } from './constants';

export type AvatarUploadResult =
  | {
      errors: string;
      message?: never;
    }
  | {
      errors?: never;
      message: string;
    };

export async function uploadAvatar(
  formData: FormData
): Promise<AvatarUploadResult> {
  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return { errors: 'Please select an image file.' };
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return { errors: 'Image must be smaller than 1MB.' };
  }
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return { errors: 'Only JPG, PNG, WEBP or GIF images are allowed.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { errors: 'Unauthorized' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const path = `${user.id}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, {
      contentType: file.type,
      cacheControl: '3600'
    });

  if (uploadError) {
    return { errors: uploadError.message };
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);

  const { error: updateError } = await supabase.auth.updateUser({
    data: { avatar_url: data.publicUrl }
  });

  if (updateError) {
    return { errors: updateError.message };
  }

  return { message: 'Avatar updated successfully!' };
}
