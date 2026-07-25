"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const THIRTY_DAYS_MS = 30 * 24 * 3600 * 1000;
const DAY_MS = 24 * 3600 * 1000;

// ============================================
// Crew: CV kartını ana sayfaya as (varsa yenile)
// ============================================
export async function postMyCv(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, visibility")
    .eq("id", user.id)
    .single();

  if (!profile || !["seafarer", "yacht"].includes(profile.user_type as string)) {
    redirect("/dashboard");
  }
  if (profile.visibility !== "public") {
    redirect("/dashboard?deck=hidden");
  }

  const note = ((formData.get("note") as string) || "").trim().slice(0, 120);
  const showContact = (formData.get("showContact") as string) !== "0";

  // Eski crew kartını sil (tek aktif kart kuralı)
  await supabase.from("deck_posts").delete().eq("user_id", user.id).eq("post_type", "crew");

  const nowIso = new Date().toISOString();
  const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();

  const { error } = await supabase.from("deck_posts").insert({
    user_id: user.id,
    post_type: "crew",
    note: note || null,
    show_contact: showContact,
    expires_at: expiresAt,
    boosted_at: nowIso,
  });

  revalidatePath("/");
  revalidatePath("/deck");
  redirect(error ? "/dashboard?deck=failed" : "/dashboard?deck=posted");
}

// ============================================
// Crew: kartı geri çek
// ============================================
export async function removeMyCvPost(): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("deck_posts").delete().eq("user_id", user.id).eq("post_type", "crew");

  revalidatePath("/");
  revalidatePath("/deck");
  redirect("/dashboard?deck=removed");
}

// ============================================
// Company: ilanı ana sayfaya as
// ============================================
export async function postJobToDeck(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const jobId = ((formData.get("jobId") as string) || "").trim();
  if (!jobId) redirect("/jobs/mine");

  const { data: job } = await supabase
    .from("jobs")
    .select("id, company_id, status")
    .eq("id", jobId)
    .eq("company_id", user.id)
    .maybeSingle();

  if (!job || job.status !== "active") {
    redirect("/jobs/mine?deck=invalid");
  }

  await supabase.from("deck_posts").delete().eq("user_id", user.id).eq("job_id", jobId);

  const nowIso = new Date().toISOString();
  const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();

  const { error } = await supabase.from("deck_posts").insert({
    user_id: user.id,
    post_type: "company",
    job_id: jobId,
    show_contact: true,
    expires_at: expiresAt,
    boosted_at: nowIso,
  });

  revalidatePath("/");
  revalidatePath("/deck");
  redirect(error ? "/jobs/mine?deck=failed" : "/jobs/mine?deck=posted");
}

// ============================================
// Company: ilan kartını geri çek
// ============================================
export async function removeJobFromDeck(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const jobId = ((formData.get("jobId") as string) || "").trim();
  if (!jobId) redirect("/jobs/mine");

  await supabase.from("deck_posts").delete().eq("user_id", user.id).eq("job_id", jobId);

  revalidatePath("/");
  revalidatePath("/deck");
  redirect("/jobs/mine?deck=removed");
}

// ============================================
// Boost: kartı ilk sıraya taşı + süreyi 30 güne yenile
// Kart başına günde 1 kez
// ============================================
export async function boostDeckPost(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const postId = ((formData.get("postId") as string) || "").trim();
  const backTo = ((formData.get("backTo") as string) || "/dashboard").trim();
  const safeBack = backTo.startsWith("/") ? backTo : "/dashboard";
  if (!postId) redirect(safeBack);

  const { data: post } = await supabase
    .from("deck_posts")
    .select("id, user_id, boosted_at")
    .eq("id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!post) redirect(safeBack + "?deck=invalid");

  const lastBoost = new Date(post.boosted_at as string).getTime();
  if (Date.now() - lastBoost < DAY_MS) {
    redirect(safeBack + "?deck=toosoon");
  }

  const nowIso = new Date().toISOString();
  const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();

  await supabase
    .from("deck_posts")
    .update({ boosted_at: nowIso, expires_at: expiresAt })
    .eq("id", postId)
    .eq("user_id", user.id);

  revalidatePath("/");
  revalidatePath("/deck");
  redirect(safeBack + "?deck=boosted");
}
