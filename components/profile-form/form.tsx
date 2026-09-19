'use client';
import { useEffect, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { profileSchema } from './schemas';
import { type ProfileSubmitResult, updateUserProfile } from './actions';

interface ProfileFormProps {
  defaultFullName: string;
}

export function ProfileForm({ defaultFullName }: ProfileFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: defaultFullName
    }
  });

  const initialState: ProfileSubmitResult = {
    message: '',
    errors: undefined
  };
  const [state, formAction, pending] = useActionState(
    updateUserProfile,
    initialState
  );

  useEffect(() => {
    if (!state.errors) {
      if (state.message) {
        toast.success(state.message);
        router.refresh();
      }
      return;
    }
    if (typeof state.errors === 'object' && state.errors.fullName?.length) {
      form.setError('fullName', { message: state.errors.fullName.join(',') });
    }
    if (typeof state.errors === 'string') {
      toast.error(state.errors);
    }
  }, [state, router, form]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
