import { z } from "zod";

export const createLeaveEntitlementsSchema = z.object({
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

export type CreateLeaveEntitlementsSchema = z.infer<typeof createLeaveEntitlementsSchema>;
