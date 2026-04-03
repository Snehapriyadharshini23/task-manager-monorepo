import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Task cannot be empty"),
});

export type Task = z.infer<typeof taskSchema>;