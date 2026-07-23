"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Giriş yapmış crew üyesinin belirli bir rank için kurduğu alarmı
 * açar (yoksa oluşturur) veya kapatır. Toggle mantığı.
 */
export async function toggleJobAlert(formData: FormData) {
  const rank = ((formData.get("rank") as string) || "").trim();
  const redirectTo = ((formData.get("redirectTo") as string) || "/jobs").trim();

  if (!rank) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // Company hesapları alarm kuramaz
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, email")
    .eq("id", user.id)
    .single();

  if (!profile || profile.user_type === "company") return;

  const email = (profile.email as string) || user.email;
  if (!email) return;

  // Mevcut kayıt var mı?
  const { data: existing } = await supabase
    .from("job_alerts")
    .select("id, active")
    .eq("user_id", user.id)
    .eq("rank", rank)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("job_alerts")
      .update({ active: !existing.active })
      .eq("id", existing.id);
  } else {
    await supabase.from("job_alerts").insert({
      user_id: user.id,
      rank,
      email,
      active: true,
    });
  }

  revalidatePath(redirectTo);
  revalidatePath("/jobs");
}

/**
 * Kullanıcının aktif alarm kurduğu rank listesini döner.
 * Server Component'lerden çağrılır.
 */
export async function getMyActiveAlertRanks(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("job_alerts")
    .select("rank")
    .eq("user_id", user.id)
    .eq("active", true);

  return (data || []).map((row) => row.rank as string);
}
