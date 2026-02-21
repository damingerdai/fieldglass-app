'use client';
import { cn } from '@/lib/utils';
import { useActionState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemas } from './schemas';
import { onSubmitAction, SubmitResult } from './action';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(schemas),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const initialState: SubmitResult = {
    message: '',
    errors: undefined
  };
  const [state, formAction, pending] = useActionState(
    onSubmitAction,
    initialState
  );
  const isValidField = (field: string): field is 'email' | 'password' => {
    return ['email', 'password'].includes(field);
  };

  useEffect(() => {
    if (!state.errors) {
      if (state.message) {
        toast.success(state.message);
        router.push('/dashboard');
      } else {
        form.clearErrors();
      }
      return;
    }
    if (typeof state.errors === 'object') {
      Object.entries(state.errors).forEach(([field, message]) => {
        if (isValidField(field) && message) {
          form.setError(field, {
            message: message.join(',')
          });
        }
      });
    }
    if (typeof state.errors === 'string') {
      toast.error(state.errors);
    }
  }, [state, router, form]);

  return (
    <Form {...form}>
      <form action={formAction} className={cn(className)} {...props}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <NextLink
              href="/forgot-password"
              className="text-sm underline underline-offset-4"
            >
              Forgot password?
            </NextLink>
          </div>
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </>
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <NextLink href="/register" className="underline underline-offset-4">
            Sign up
          </NextLink>
        </div>
      </form>
    </Form>
  );
}
