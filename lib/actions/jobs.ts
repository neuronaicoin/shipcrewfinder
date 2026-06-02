"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Yalnızca company ilan verebilir
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();
  if (!profile || profile.user_type !== "company") {
    redirect("/dashboard");
  }

  const jobType = (formData.get("jobType") as string) || "seafarer"; // seafarer | yacht
  const rank = (formData.get("rank") as string) || "";
  const title = (formData.get("title") as string)?.trim() || "";
  const country = (formData.get("country") as string) || "";
  const city = (formData.get("city") as string)?.trim() || "";
  const description = (formData.get("description") as string)?.trim() || "";
  const contractDuration = (formData.get("contractDuration") as string)?.trim() || null;
  const salaryMinRaw = (formData.get("salaryMin") as string)?.trim();
  const salaryMaxRaw = (formData.get("salaryMax") as string)?.trim();
  const salaryCurrency = (formData.get("salaryCurrency") as string) || "USD";

  // Zorunlu alan kontrolü
  if (!title || !rank || !description) {
    redirect("/jobs/new?error=missing");
  }

  const salaryMin = salaryMinRaw ? parseInt(salaryMinRaw, 10) : null;
  const salaryMax = salaryMaxRaw ? parseInt(salaryMaxRaw, 10) : null;

  const { error } = await supabase.from("jobs").insert({
    company_id: user.id,
    title,
    position: rank,          // NOT NULL — seçilen rank
    rank_required: rank,
    job_type: jobType,       // ship/yacht ayrımı
    location_country: country || null,
    location_city: city || null,
    description,             // NOT NULL — serbest metin
    contract_duration: contractDuration,
    salary_min: Number.isFinite(salaryMin as number) ? salaryMin : null,
    salary_max: Number.isFinite(salaryMax as number) ? salaryMax : null,
    salary_currency: salaryCurrency,
    salary_period: "month",
    status: "active",
  });

  if (error) {
    redirect("/jobs/new?error=failed");
  }

  redirect("/jobs/mine?created=1");
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
