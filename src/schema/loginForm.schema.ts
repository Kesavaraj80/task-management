import { z } from "zod";

export const userLoginSchema = z.object({
  email: z.string().email("Please enter valid email"),
  password: z
    .string()
    .min(6, { message: "Must be 6 characters" })
    .max(16, { message: "Maximum 16 characters" }),
});
