"use server";

import { taskSchema } from "@repo/shared";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);



export async function addTask(formData: FormData, userId: string) {
  const title = formData.get("title") as string;

  const validated = taskSchema.safeParse({ title });
  if (!validated.success) return;

  await supabase.from("tasks").insert([
    {
      title,
      user_id: userId,
    },
  ]);

  revalidatePath("/dashboard");
}

export async function toggleTask(id: string, status: boolean) {
  await supabase
    .from("tasks")
    .update({ is_completed: !status })
    .eq("id", id);

  revalidatePath("/dashboard");
}

export async function deleteTask(id: string) {
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/dashboard");
}