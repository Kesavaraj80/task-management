import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string({ required_error: "Description Required" }),
  status: z.string({ required_error: "Status Required" }),
  priority: z.string({ required_error: "Priority Required" }),
  dueDate: z.date({ required_error: "Due Date Required" }),
});
