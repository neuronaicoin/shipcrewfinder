"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ============================================
// Vesikalık foto yükle (JPG/PNG, max 2MB)
// ============================================
export async function uploadCvPhoto(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) {
    redirect("/cv?error=nofile");
  }
  if (file.size > 2 * 1024 * 1024) {
    redirect("/cv?error=photo_too_large");
  }
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    redirect("/cv?error=photo_type");
  }

  const ext = file.type === "image/png" ? "png" : "jpg";
  const fileName = "photo-" + user.id + "-" + Date.now() + "." + ext;

  const { error: uploadError } = await supabase.storage
    .from("cvs")
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    redirect("/cv?error=photo_failed");
  }

  const { data: { publicUrl } } = supabase.storage
    .from("cvs")
    .getPublicUrl(fileName);

  await supabase
    .from("profiles")
    .update({ photo_url: publicUrl })
    .eq("id", user.id);

  revalidatePath("/cv");
  redirect("/cv?photo=1");
}

// ============================================
// Fotoyu kaldır
// ============================================
export async function removeCvPhoto(): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({ photo_url: null })
    .eq("id", user.id);

  revalidatePath("/cv");
  redirect("/cv");
}

// ============================================
// "Show contact on shared CV" toggle
// ============================================
export async function toggleCvContact(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const show = (formData.get("show") as string) === "1";

  await supabase
    .from("profiles")
    .update({ cv_show_contact: show })
    .eq("id", user.id);

  revalidatePath("/cv");
  redirect("/cv");
}

// ============================================
// Paylaşım linkini yenile (eski link ölür)
// ============================================
export async function regenerateCvLink(): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Rastgele yeni kod: CV + 8 hex
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  const newCode = "CV" + rand;

  await supabase
    .from("profiles")
    .update({ cv_share_code: newCode })
    .eq("id", user.id);

  revalidatePath("/cv");
  redirect("/cv?newlink=1");
}
