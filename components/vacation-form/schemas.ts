import { LEAVE_TYPE_KEYS } from "@/types/leave-type";
import { z } from "zod";

export const schemas = z.object({
  leave_type: z.enum(LEAVE_TYPE_KEYS, {
    error: "Please select a valid leave type from the list."
  }),
  start_date: z.date({
    error: "Start date must be a valid date.",
  }),
  end_date: z.date({
    error: "End date must be a valid date.",
  }),
  days: z.coerce.number<number>().min(1, { message: "The minimum number of days is 1." }),
  // days: z.preprocess<string | number | undefined, number>(
  //   (value) => {
  //     if (value === "") {
  //       return undefined;
  //     }
  //     if (typeof value === "string") {
  //       const parsed = parseFloat(value);
  //       // Return the number if valid, otherwise return the original value (to fail validation)
  //       return isNaN(parsed) ? value : parsed;
  //     }
  //     return value as number;
  //   },
  //   z.number().min(1, { message: "The minimum number of days is 1." }),
  // ),
  notes: z.string().optional(),
});

export type CreateVacationData = z.infer<typeof schemas>;

export type CreateVacationDataKey = keyof CreateVacationData;

export type CreateVacationDataKeysArray = CreateVacationDataKey[];

export const formFields = Object.keys(schemas.shape);