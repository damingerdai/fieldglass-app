"use server";

import { createClient } from "@/utils/supabase/server";
import { CreateVacationData, CreateVacationDataKey, formFields, schemas } from "./schemas";
import { formatLeaveType } from "@/lib/leave-type";

const VACATION_TABLE_NAME = 'vacations';

export type ActionResult<T = any> = {
    errors: Record<keyof T, string[]> | string;
    message?: never;
}
    | { errors?: never; message: string };

export async function onSubmitAction(preState: ActionResult<CreateVacationData>, formData: FormData): Promise<ActionResult<CreateVacationData>> {
    const notes = formData.get("nodtes") as string;
    const data = {
        leave_type: formData.get("leave_type") as string,
        start_date: new Date(formData.get("start_date") as string),
        end_date: new Date(formData.get("end_date") as string),
        days: parseInt(formData.get("days") as string, 10),
    } as CreateVacationData;
    if (notes) {
        data.notes = notes;
    }

    const parse = schemas.safeParse(data);

    if (!parse.success) {
        const fieldErrors: Record<keyof CreateVacationData, string[]> = {
            leave_type: [],
            start_date: [],
            end_date: [],
            days: [],
            notes: [],
        };

        parse.error.issues.forEach((issue) => {
            const field = issue.path[0];
            if (formFields.includes(field as string)) {
                fieldErrors[field as CreateVacationDataKey].push(issue.message);
            }
        });
        return {
            errors: fieldErrors,
            message: undefined,
        };
    }
    const validatedData = parse.data;
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
        return {
            errors: "Authentication failed. Please log in again.",
        };
    }
    const currentUserId = userData.user.id;

    const { data: existingVacations, error: fetchError } = await supabase
        .from(VACATION_TABLE_NAME)
        .select("id")
        .eq("user_id", currentUserId)
        .eq("leave_type", validatedData.leave_type)
        .lte("start_date", validatedData.end_date.toISOString())
        .gte("end_date", validatedData.start_date.toISOString())
        .limit(1);

    if (fetchError) {
        return { errors: `Checking for conflicts failed: ${fetchError.message}` };
    }

    if (existingVacations && existingVacations.length > 0) {
        const friendlyType = formatLeaveType(validatedData.leave_type);

        return {
            errors: `Conflict: You already have a ${friendlyType} request during this period.`
        };
    }

    const { error } = await supabase
        .from(VACATION_TABLE_NAME)
        .insert([{
            ...validatedData,
            user_id: currentUserId,
        }]);

    if (error) {
        console.error("Supabase insert error:", error);
        return {
            errors: `Failed to create vacation record: ${error.message}`,
        };
    }

    return {
        message: 'Vacation request created successfully!',
    };
}