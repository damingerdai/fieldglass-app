'use client';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateLeaveRequestSchema, createLeaveRequestSchema } from './schema';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import Link from 'next/link';
import { createLeaveRequest } from './actions';
import { toast } from 'sonner';

export function CreateLeaveRequestForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const [today, tomorrow] = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return [today, tomorrow];
  }, []);
  const defaultValues: CreateLeaveRequestSchema = {
    leave_type: 'annual',
    days: 1,
    start_date: today,
    end_date: tomorrow,
    reason: ''
  };
  const form = useForm({
    resolver: zodResolver(createLeaveRequestSchema),
    defaultValues
  });

  const onSubmit = (data: CreateLeaveRequestSchema) => {
    startTransition(async () => {
      const { success, error } = await createLeaveRequest(data);
      if (success) {
        toast.success('Successfully created leave request');
        router.push('/leave-requests');
      } else {
        toast.error(error);
      }
    });
  };

  const days = form.watch('days');
  const startDate = form.watch('start_date');

  useEffect(() => {
    const numDays = Number(days);
    if (startDate && !isNaN(numDays) && numDays > 0) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.ceil(numDays) - 1);
      const currentEndDate = form.getValues('end_date');
      if (!currentEndDate || currentEndDate.getTime() !== endDate.getTime()) {
        form.setValue('end_date', endDate);
      }
    }
  }, [days, startDate, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="leave_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.5"
                  {...field}
                  value={Number(field.value) || ''}
                  onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormDescription>
                Enter the number of days you are requesting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Button
                  disabled
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>No end date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
              <FormDescription>
                Calculated automatically based on start date and days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <Textarea
                placeholder="Enter the reason for your leave"
                className="resize-none"
                {...field}
              />
              <FormDescription>
                Enter the reason for your leave.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" asChild>
            <Link href="/leave-requests">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
