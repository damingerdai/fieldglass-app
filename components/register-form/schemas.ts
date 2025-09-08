import { z } from "zod";

export const schemas = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 charactors long")
      .max(16, "Password must be at most 16 charactores long")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "Password must contain both letters and numbers",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type InputData = z.infer<typeof schemas>;
