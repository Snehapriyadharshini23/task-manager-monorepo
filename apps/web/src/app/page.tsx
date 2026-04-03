import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function Home() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}