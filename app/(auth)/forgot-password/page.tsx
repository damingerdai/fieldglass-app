'use client';

import { useState } from 'react';

import { createClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import NextLink from 'next/link';
import { getURL } from '@/lib/utils';

const formSchema = z.object({
  email: z.email('Please enter a valid email address')
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      // Use window.location.origin to dynamically handle the URL
      redirectTo: `${getURL()}/auth/callback?next=/update-password`
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset email sent! Please check your inbox.');
      form.reset();
    }

    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
            <NextLink
              href="/login"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </NextLink>
          </div>
        </div>
      </form>
    </Form>
  );
}
