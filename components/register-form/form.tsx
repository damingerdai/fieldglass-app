'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useActionState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemas } from './schemas';
import { onSubmitStudent, SubmitResult } from './actions';
import { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(schemas),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  const initialState: SubmitResult = {
    message: '',
    errors: undefined
  };
  const [state, formAction, pending] = useActionState(
    onSubmitStudent,
    initialState
  );
  const isValidField = (
    field: string
  ): field is 'email' | 'password' | 'confirmPassword' => {
    return ['email', 'password', 'confirmPassword'].includes(field);
  };

  useEffect(() => {
    if (!state.errors) {
      if (state.message) {
        toast.success(state.message);
        router.push('/login');
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
      <form
        action={formAction}
        className={cn('flex', 'flex-col', 'gap-6', className)}
        {...props}
      >
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
        <div className="grid ga-3">
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
        <div className="grid ga-3">
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        <div className="mt-4 text-center text-sm">
          Have an account?{' '}
          <a href="/login" className="underline underline-offset-4">
            Sign in
          </a>
        </div>
      </form>
    </Form>
  );
}
