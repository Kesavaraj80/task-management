import { z } from "zod";

export const userSignUpSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email("Please enter valid email"),
    password: z
      .string()
      .min(6, { message: "Must be 6 characters" })
      .max(16, { message: "Maximum 16 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
