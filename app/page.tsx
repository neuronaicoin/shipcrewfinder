import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeContent from "@/app/components/home-content";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <HomeContent />;
}
