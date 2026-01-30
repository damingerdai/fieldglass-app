"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
    leave_type: z.string().min(1, "Please select a leave type"),
    amount_days: z.coerce.number<number>().min(0.5, "Amount must be at least 0.5 days"),
    effective_date: z.date({
        error: "Effective date is required",
    }),
    expiry_date: z.date().optional(),
    notes: z.string().max(200).optional(),
}).refine(
    (data) => {
        if (!data.expiry_date) return true;
        return data.expiry_date > data.effective_date;
    },
    {
        message: "Expiry date must be after the effective date",
        path: ["expiry_date"]
    }
);

type FormValues = z.infer<typeof formSchema>;

export default function CreateLeaveEntitlement() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            leave_type: "",
            amount_days: 0,
            notes: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values);
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
                <Link href="/leave-entitlements" className="flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" />
                    Back to List
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create Entitlement</CardTitle>
                    <CardDescription>
                        Allocate leave days to a user. This will define their available balance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                            {[
                                                { id: "annual", label: "Annual Leave", desc: "Paid time off for holidays and personal use" },
                                                { id: "sick", label: "Sick Leave", desc: "For medical appointments and recovery" },
                                                { id: "unpaid", label: "Unpaid Leave", desc: "Leave without salary compensation" },
                                            ].map((item) => (
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

                                {/* Expiry Date (新增) */}
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
                                <Button type="submit">Confirm Create</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}