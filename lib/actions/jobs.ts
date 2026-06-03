"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();
  if (!profile || profile.user_type !== "company") {
    redirect("/dashboard");
  }

  const jobType = (formData.get("jobType") as string) || "seafarer";
  const rank = (formData.get("rank") as string) || "";
  const title = (formData.get("title") as string)?.trim() || "";
  const country = (formData.get("country") as string) || "";
  const city = (formData.get("city") as string)?.trim() || "";
  const description = (formData.get("description") as string)?.trim() || "";
  const contractDuration = (formData.get("contractDuration") as string)?.trim() || null;
  const salaryMinRaw = (formData.get("salaryMin") as string)?.trim();
  const salaryMaxRaw = (formData.get("salaryMax") as string)?.trim();
  const salaryCurrency = (formData.get("salaryCurrency") as string) || "USD";

  if (!title || !rank || !description) {
    redirect("/jobs/new?error=missing");
  }

  const salaryMin = salaryMinRaw ? parseInt(salaryMinRaw, 10) : null;
  const salaryMax = salaryMaxRaw ? parseInt(salaryMaxRaw, 10) : null;

  const { error } = await supabase.from("jobs").insert({
    company_id: user.id,
    title,
    position: rank,
    rank_required: rank,
    job_type: jobType,
    location_country: country || null,
    location_city: city || null,
    description,
    contract_duration: contractDuration,
    salary_min: Number.isFinite(salaryMin as number) ? salaryMin : null,
    salary_max: Number.isFinite(salaryMax as number) ? salaryMax : null,
    salary_currency: salaryCurrency,
    status: "active",
  });

  if (error) {
    redirect("/jobs/new?error=failed");
  }
  redirect("/jobs/mine?created=1");
}

export async function updateJob(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const jobId = (formData.get("jobId") as string) || "";
  if (!jobId) redirect("/jobs/mine");

  const jobType = (formData.get("jobType") as string) || "seafarer";
  const rank = (formData.get("rank") as string) || "";
  const title = (formData.get("title") as string)?.trim() || "";
  const country = (formData.get("country") as string) || "";
  const city = (formData.get("city") as string)?.trim() || "";
  const description = (formData.get("description") as string)?.trim() || "";
  const contractDuration = (formData.get("contractDuration") as string)?.trim() || null;
  const salaryMinRaw = (formData.get("salaryMin") as string)?.trim();
  const salaryMaxRaw = (formData.get("salaryMax") as string)?.trim();
  const salaryCurrency = (formData.get("salaryCurrency") as string) || "USD";

  if (!title || !rank || !description) {
    redirect(`/jobs/${jobId}/edit?error=missing`);
  }

  const salaryMin = salaryMinRaw ? parseInt(salaryMinRaw, 10) : null;
  const salaryMax = salaryMaxRaw ? parseInt(salaryMaxRaw, 10) : null;

  const { error } = await supabase
    .from("jobs")
    .update({
      title,
      position: rank,
      rank_required: rank,
      job_type: jobType,
      location_country: country || null,
      location_city: city || null,
      description,
      contract_duration: contractDuration,
      salary_min: Number.isFinite(salaryMin as number) ? salaryMin : null,
      salary_max: Number.isFinite(salaryMax as number) ? salaryMax : null,
      salary_currency: salaryCurrency,
    })
    .eq("id", jobId)
    .eq("company_id", user.id);

  if (error) {
    redirect(`/jobs/${jobId}/edit?error=failed`);
  }
  redirect("/jobs/mine?updated=1");
}

export async function deleteJob(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const jobId = formData.get("jobId") as string;
  if (!jobId) redirect("/jobs/mine");

  await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("company_id", user.id);

  redirect("/jobs/mine?deleted=1");
}

export async function closeJob(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const jobId = formData.get("jobId") as string;
  if (!jobId) redirect("/jobs/mine");

  await supabase
    .from("jobs")
    .update({ status: "closed" })
    .eq("id", jobId)
    .eq("company_id", user.id);

  redirect("/jobs/mine");
}

export async function reopenJob(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const jobId = formData.get("jobId") as string;
  if (!jobId) redirect("/jobs/mine");

  await supabase
    .from("jobs")
    .update({ status: "active" })
    .eq("id", jobId)
    .eq("company_id", user.id);

  redirect("/jobs/mine");
}

export async function applyToJob(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const jobId = (formData.get("jobId") as string) || "";
  if (!jobId) redirect("/jobs");

  // Başvuran crew olmalı (company kendi ilanına başvuramaz)
  const { data: me } = await supabase
    .from("profiles")
    .select("user_type, full_name")
    .eq("id", user.id)
    .single();
  if (!me || me.user_type === "company") {
    redirect(`/jobs/${jobId}?error=notcrew`);
  }

  // İlanı çek (company_id + title lazım)
  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, company_id, status")
    .eq("id", jobId)
    .single();
  if (!job || job.status !== "active") {
    redirect(`/jobs/${jobId}?error=closed`);
  }

  // Mesajı topla (hazır seçenek + opsiyonel serbest metin)
  const preset = (formData.get("preset") as string)?.trim() || "";
  const custom = (formData.get("custom") as string)?.trim() || "";
  const message = [preset, custom].filter(Boolean).join(" — ").slice(0, 500) || null;

  // Başvuruyu kaydet (aynı ilana ikinci kez = unique hatası → zaten başvurmuş)
  const { error } = await supabase.from("job_applications").insert({
    job_id: job.id,
    applicant_id: user.id,
    company_id: job.company_id,
    message,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      redirect(`/jobs/${jobId}?applied=already`);
    }
    redirect(`/jobs/${jobId}?error=failed`);
  }

  // Şirkete bildirim gönder
  const applicantName = (me.full_name as string) || "A candidate";
  await supabase.from("notifications").insert({
    user_id: job.company_id,
    type: "job_application",
    title: "New job application",
    message: `${applicantName} applied to "${job.title}".`,
    link: `/jobs/${job.id}/applications`,
    read: false,
  });

  redirect(`/jobs/${jobId}?applied=1`);
}
