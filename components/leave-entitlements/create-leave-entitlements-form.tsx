"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeaveEntitlementsSchema, CreateLeaveEntitlementsSchema } from "./schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { createLeaveEntitlements } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateLeaveEntitlementsForm({ className, ...props }: React.ComponentProps<"form">) {
    const [isPending, startTransition] = React.useTransition();
    const router = useRouter();
    const form = useForm<CreateLeaveEntitlementsSchema>({
        resolver: zodResolver(createLeaveEntitlementsSchema),
        defaultValues: {
            leave_type: "",
            amount_days: 0,
            notes: "",
        },
    });
    const leaveTypes = [
        { id: "annual", label: "Annual Leave", desc: "Paid time off for holidays and personal use" },
        { id: "sick", label: "Sick Leave", desc: "For medical appointments and recovery" },
        { id: "unpaid", label: "Unpaid Leave", desc: "Leave without salary compensation" },
        // { id: "annual", label: "Annual Leave", desc: "Paid time off for holidays and personal use" },
        // { id: "sick", label: "Sick Leave", desc: "For medical appointments and recovery" },
        // { id: "maternity", label: "Maternity Leave", desc: "For new mothers" },
        // { id: "paternity", label: "Paternity Leave", desc: "For new fathers" },
        // { id: "unpaid", label: "Unpaid Leave", desc: "Leave without pay" },
        // { id: "bereavement", label: "Bereavement Leave", desc: "For family loss" },
        // { id: "marriage", label: "Marriage Leave", desc: "For wedding" },
        // { id: "exam", label: "Exam Leave", desc: "For exams" },
    ];

    const onSubmit = (data: CreateLeaveEntitlementsSchema) => {
        startTransition(async () => {
            const result = await createLeaveEntitlements(data);
            if (result.success) {
                form.reset();
                toast.success("Success!", {
                    description: "Leave entitlement has been created successfully.",
                });
                router.push("/leave-entitlements");
            } else {
                toast.error("Error", {
                    description: result.error || "Something went wrong.",
                });
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)} {...props}>
                <FormField
                    control={form.control}
                    name="leave_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Leave Type</FormLabel>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                            >
                                {leaveTypes.map((item) => (
                                    <FormItem
                                        key={item.id}
                                        className={cn(
                                            "flex items-start space-x-3 space-y-0 rounded-md border p-4 transition-colors hover:bg-accent",
                                            field.value === item.id ? "border-primary bg-primary/5" : "border-muted"
                                        )}
                                    >
                                        <FormControl>
                                            <RadioGroupItem value={item.id} className="mt-1" />
                                        </FormControl>
                                        <div className="space-y-1 leading-none cursor-pointer w-full"
                                            onClick={() => field.onChange(item.id)}>
                                            <FormLabel className="font-medium">
                                                {item.label}
                                            </FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount_days"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount (Days)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.5" {...field} />
                            </FormControl>
                            <FormDescription>Increment by 0.5 days.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="effective_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Effective Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                        name="expiry_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Expiry Date (Optional)</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? format(field.value, "PPP") : <span>No expiry date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => {
                                                const effective = form.getValues("effective_date");
                                                return !!effective && date < effective;
                                            }}

                                        />

                                        {field.value && (
                                            <div className="p-2 border-t text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full text-xs"
                                                    onClick={() => field.onChange(undefined)}
                                                >
                                                    Clear Expiry Date
                                                </Button>
                                            </div>
                                        )}
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>Leave empty for no expiration.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Optional reason or reference..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline" asChild>
                        <Link href="/leave-entitlements">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Confirm Create"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}