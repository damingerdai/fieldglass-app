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
import { changePasswordSchema } from './schemas';
import { type ChangePasswordResult, changePassword } from './actions';

export function ChangePasswordForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: ''
    }
  });

  const initialState: ChangePasswordResult = {
    message: '',
    errors: undefined
  };
  const [state, formAction, pending] = useActionState(
    changePassword,
    initialState
  );

  const isValidField = (
    field: string
  ): field is 'currentPassword' | 'password' | 'confirmPassword' => {
    return ['currentPassword', 'password', 'confirmPassword'].includes(field);
  };

  useEffect(() => {
    if (!state.errors) {
      if (state.message) {
        toast.success(state.message);
        form.reset();
        router.push('/settings');
      }
      return;
    }
    if (typeof state.errors === 'object') {
      Object.entries(state.errors).forEach(([field, message]) => {
        if (isValidField(field) && message?.length) {
          form.setError(field, { message: message.join(',') });
        }
      });
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
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Update Password
        </Button>
      </form>
    </Form>
  );
}
