import { z } from 'zod';

export const schemas = z.object({
  email: z.email('Invalid email format'),
  password: z.string('Password is required')
});

export type LoginData = z.infer<typeof schemas>;
