"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = ["new", "contacted", "shortlisted", "hired", "rejected"];

type ActionResult = { ok: boolean; error?: string };

// ============================================
// Başvuru durumunu güncelle (sadece ilan sahibi)
// ============================================
export async function updateApplicationStatus(
  applicationId: string,
  status: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not logged in." };

  if (!VALID_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  // Başvuru + ilan sahibi kontrolü
  const { data: app } = await supabase
    .from("job_applications")
    .select("id, job_id, applicant_id, status")
    .eq("id", applicationId)
    .maybeSingle();
  if (!app) return { ok: false, error: "Application not found." };

  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, company_id")
    .eq("id", app.job_id as string)
    .single();
  if (!job || job.company_id !== user.id) {
    return { ok: false, error: "Not authorized." };
  }

  const { error } = await supabase
    .from("job_applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) return { ok: false, error: "Update failed. Try again." };

  // Hired → crew'a tebrik bildirimi (bir kez)
  if (status === "hired" && app.status !== "hired") {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();
      await admin.from("notifications").insert({
        user_id: app.applicant_id as string,
        type: "hired",
        title: "🎉 Congratulations — you were hired!",
        message: "Your application for \"" + (job.title as string) + "\" was marked as Hired.",
        link: "/jobs/" + (job.id as string),
        read: false,
      });
    } catch {
      // bildirim hatası durumu bozmasın
    }
  }

  revalidatePath("/jobs/" + (job.id as string) + "/applications");
  return { ok: true };
}

// ============================================
// Aday notu kaydet (sadece ilan sahibi, crew asla görmez)
// ============================================
export async function saveApplicationNote(
  applicationId: string,
  note: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not logged in." };

  const clean = (note || "").trim().slice(0, 500);

  const { data: app } = await supabase
    .from("job_applications")
    .select("id, job_id")
    .eq("id", applicationId)
    .maybeSingle();
  if (!app) return { ok: false, error: "Application not found." };

  const { data: job } = await supabase
    .from("jobs")
    .select("id, company_id")
    .eq("id", app.job_id as string)
    .single();
  if (!job || job.company_id !== user.id) {
    return { ok: false, error: "Not authorized." };
  }

  const { error } = await supabase
    .from("job_applications")
    .update({ company_note: clean || null })
    .eq("id", applicationId);

  if (error) return { ok: false, error: "Save failed. Try again." };

  revalidatePath("/jobs/" + (job.id as string) + "/applications");
  return { ok: true };
}
