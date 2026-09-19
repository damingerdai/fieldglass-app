import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(16, 'Password must be at most 16 characters long')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        'Password must contain both letters and numbers'
      ),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })
  .refine(data => data.currentPassword !== data.password, {
    message: 'New password must be different from the current one',
    path: ['password']
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
