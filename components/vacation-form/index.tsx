"use client";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Calendar as CalendarIcon, Loader2Icon } from "lucide-react";
import { LEAVE_OPTIONS } from "@/types/leave-type";
import { format } from "date-fns/format";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { CreateVacationData, CreateVacationDataKey, formFields, schemas } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionResult, onSubmitAction } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateVacationForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const defaultStartDate = useMemo(() => {
    const now = new Date();
    now.setDate(1);

    return now;
  }, []);
  const defaultValues: CreateVacationData = {
    leave_type: "annual_leave",
    start_date: defaultStartDate,
    end_date: new Date(),
    days: 1,
    notes: "",
  };
  const form = useForm({
    resolver: zodResolver(schemas),
    defaultValues,
  });
  const initialState: ActionResult<CreateVacationData> = {
    message: "",
    errors: undefined,
  };

  const [state, formAction, pending] = useActionState(
    onSubmitAction,
    initialState,
  );

  const handleClientSubmit = form.handleSubmit((data) => {
    form.clearErrors();
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value) {
        formData.append(key, value.toString())
      }
    }
    startTransition(() => formAction(formData));
  });

  useEffect(() => {
    if (!state.errors) {
      if (state.message) {
        toast.success(state.message);
        router.push("/vacation");
      } else {
        form.clearErrors();
      }
      return;
    }
    if (typeof state.errors === "object") {
      Object.entries(state.errors).forEach(([field, message]) => {
        if (formFields.includes(field) && message) {
          form.setError(field as CreateVacationDataKey, {
            message: message.join(","),
          });
        }
      });
    }
    if (typeof state.errors === "string") {
      toast.error(state.errors);
    }
  }, [state, form]);

  return (
    <Form {...form}>
      <form onSubmit={handleClientSubmit} className={cn(className)} {...props}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="leave_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    value={(field.value ?? "") as string}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Leave Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent ref={field.ref}>
                      {LEAVE_OPTIONS.map((leaveType, index) => (
                        <SelectItem
                          value={leaveType.value.toString()}
                          key={index}
                        >
                          {leaveType.label.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-1")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-1")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="please enter your note" {...field} />
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
                "Create Vacation Type"
              )}

            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
