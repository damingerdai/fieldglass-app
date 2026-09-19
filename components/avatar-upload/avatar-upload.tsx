'use client';
import { useRef, useTransition } from 'react';
import { Camera, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { UserAvatar } from '@/components/user-avatar';
import { uploadAvatar } from './actions';
import { ALLOWED_AVATAR_TYPES, MAX_AVATAR_SIZE } from './constants';

interface AvatarUploadProps {
  email: string;
  avatarUrl?: string;
}

export function AvatarUpload({ email, avatarUrl }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('Image must be smaller than 1MB.');
      return;
    }
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP or GIF images are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    startTransition(async () => {
      const result = await uploadAvatar(formData);
      if (result.errors) {
        toast.error(result.errors);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        aria-label="Change avatar"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
        className="relative block h-full w-full rounded-xl overflow-hidden focus:outline-none ring-offset-background transition-all hover:ring-2 hover:ring-[#7C3AED]/40 hover:ring-offset-2 active:scale-95 cursor-pointer disabled:cursor-wait"
      >
        <UserAvatar email={email} avatarUrl={avatarUrl} />
        <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-[#7C3AED] text-white shadow-md">
          {pending ? (
            <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Camera className="h-3.5 w-3.5" />
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_AVATAR_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
