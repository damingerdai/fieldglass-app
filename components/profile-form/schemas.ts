import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Name is required')
    .max(60, 'Name must be at most 60 characters long')
});

export type ProfileInput = z.infer<typeof profileSchema>;
