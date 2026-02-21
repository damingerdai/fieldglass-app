import { z } from 'zod';

export const createLeaveRequestSchema = z
  .object({
    leave_type: z.enum(['annual', 'sick', 'unpaid']),
    days: z.coerce.number().min(1).max(31),
    start_date: z.date().min(new Date()),
    end_date: z.date().min(new Date()),
    reason: z.string().optional()
  })
  .refine(data => data.start_date <= data.end_date, {
    message: 'End date must be after start date',
    path: ['end_date']
  });

export type CreateLeaveRequestSchema = z.infer<typeof createLeaveRequestSchema>;
