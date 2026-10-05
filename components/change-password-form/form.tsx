'use client';
import { useEffect, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { changePasswordSchema } from './schemas';
import { type ChangePasswordResult, changePassword } from './actions';

const isValidField = (
  field: string
): field is 'currentPassword' | 'password' | 'confirmPassword' | 'code' => {
  return ['currentPassword', 'password', 'confirmPassword', 'code'].includes(
    field
  );
};

export function ChangePasswordForm({ requiresOtp }: { requiresOtp: boolean }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
      code: ''
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
      <form
        action={formAction}
        onSubmit={() => form.clearErrors()}
        className="flex flex-col gap-4"
      >
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
                  readOnly={pending}
                  onChange={event => {
                    field.onChange(event);
                    form.clearErrors(['currentPassword', 'password']);
                  }}
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
                  readOnly={pending}
                  onChange={event => {
                    field.onChange(event);
                    form.clearErrors(['password', 'confirmPassword']);
                  }}
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
                  readOnly={pending}
                  onChange={event => {
                    field.onChange(event);
                    form.clearErrors('confirmPassword');
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {requiresOtp && (
          <FormField
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Authenticator code</FormLabel>
                <FormControl>
                  <InputOTP
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern={REGEXP_ONLY_DIGITS}
                    pasteTransformer={text => text.replace(/[\s-]/g, '')}
                    minLength={6}
                    maxLength={6}
                    required
                    {...field}
                    onChange={value => {
                      field.onChange(value);
                      form.clearErrors('code');
                    }}
                    readOnly={pending}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map(index => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          aria-invalid={fieldState.invalid}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Enter the 6-digit code from your authenticator app.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          type="submit"
          disabled={pending}
          onClick={() => form.clearErrors()}
          className="w-full"
        >
          {pending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Update Password
        </Button>
      </form>
    </Form>
  );
}
