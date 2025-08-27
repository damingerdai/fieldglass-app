"use server";
import { type InputData, schemas } from "./schemas";
import { createClient } from "@/utils/supabase/server";

export type SubmitResult =
  | {
      errors: Record<keyof InputData, string[]> | string;
      message?: never;
    }
  | { errors?: never; message: string };

export async function onSubmitStudent(
  prevState: SubmitResult,
  formData: FormData,
): Promise<SubmitResult> {
  const parse = schemas.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parse.success) {
    const fieldErrors: Record<
      "email" | "password" | "confirmPassword",
      string[]
    > = {
      email: [],
      password: [],
      confirmPassword: [],
    };

    parse.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (
        field === "email" ||
        field === "password" ||
        field === "confirmPassword"
      ) {
        fieldErrors[field].push(issue.message);
      }
    });

    return {
      errors: fieldErrors,
      message: undefined,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parse.data.email,
    password: parse.data.password,
  });
  if (error) {
    return {
      message: undefined,
      errors: error.message,
    };
  }
  console.log("Validated Data:", data);
  return {
    message: "Register successfully!",
    errors: undefined,
  };
}
