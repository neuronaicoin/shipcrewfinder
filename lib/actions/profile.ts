"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ============================================
// CREW: Step 1 - Rank
// ============================================
export async function updateCrewRank(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const rank = formData.get("rank") as string;
  if (!rank) {
    redirect("/onboarding/crew/step-1?error=rank_required");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/dashboard");
  }

  if (profile.user_type === "seafarer") {
    await supabase.from("seafarer_details").upsert({
      id: user.id,
      rank: rank,
    });
  } else if (profile.user_type === "yacht") {
    await supabase.from("yacht_details").upsert({
      id: user.id,
      position: rank,
    });
  }

  revalidatePath("/onboarding/crew");
  redirect("/onboarding/crew/step-2");
}

// ============================================
// CREW: Step 2 - Experience
// ============================================
export async function updateCrewExperience(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const experience = formData.get("experience") as string;
  if (!experience) {
    redirect("/onboarding/crew/step-2?error=required");
  }

  const expMap: Record<string, number> = {
    "0-1": 1,
    "1-3": 3,
    "3+": 5,
  };
  const years = expMap[experience] || 0;

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  if (profile.user_type === "seafarer") {
    await supabase
      .from("seafarer_details")
      .update({ years_experience: years })
      .eq("id", user.id);
  } else if (profile.user_type === "yacht") {
    await supabase
      .from("yacht_details")
      .update({ years_experience: years })
      .eq("id", user.id);
  }

  revalidatePath("/onboarding/crew");
  redirect("/onboarding/crew/step-3");
}

// ============================================
// CREW: Step 3 - Nationality + Languages
// ============================================
export async function updateCrewNationality(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nationality = formData.get("nationality") as string;
  const englishLevel = formData.get("englishLevel") as string;
  const languages = formData.getAll("languages") as string[];

  if (!nationality) {
    redirect("/onboarding/crew/step-3?error=required");
  }

  await supabase
    .from("profiles")
    .update({ country: nationality })
    .eq("id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  if (profile.user_type === "seafarer") {
    await supabase
      .from("seafarer_details")
      .update({
        nationality: nationality,
        languages: languages,
        english_level: englishLevel || null,
      })
      .eq("id", user.id);
  } else if (profile.user_type === "yacht") {
    await supabase
      .from("yacht_details")
      .update({
        languages: languages,
        english_level: englishLevel || null,
      })
      .eq("id", user.id);
  }

  revalidatePath("/onboarding/crew");
  redirect("/onboarding/crew/step-4");
}

// ============================================
// CREW: Step 4 - CV Upload
// ============================================
export async function uploadCrewCV(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const file = formData.get("cv") as File;

  // CV upload is optional - skip if no file
  if (!file || file.size === 0) {
    redirect("/onboarding/crew/step-5");
  }

  // Validate
  if (file.size > 5 * 1024 * 1024) {
    redirect("/onboarding/crew/step-4?error=file_too_large");
  }
  if (file.type !== "application/pdf") {
    redirect("/onboarding/crew/step-4?error=invalid_type");
  }

  // Upload to Storage
  const fileName = `${user.id}-${Date.now()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("cvs")
    .upload(fileName, file, {
      upsert: true,
      contentType: "application/pdf",
    });

  if (uploadError) {
    redirect("/onboarding/crew/step-4?error=upload_failed");
  }

  // Get URL
  const { data: { publicUrl } } = supabase.storage
    .from("cvs")
    .getPublicUrl(fileName);

  // Save to details
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  if (profile.user_type === "seafarer") {
    await supabase
      .from("seafarer_details")
      .update({ cv_url: publicUrl })
      .eq("id", user.id);
  } else if (profile.user_type === "yacht") {
    await supabase
      .from("yacht_details")
      .update({ cv_url: publicUrl })
      .eq("id", user.id);
  }

  revalidatePath("/onboarding/crew");
  redirect("/onboarding/crew/step-5");
}

// ============================================
// CREW: Step 5 - Availability + Contact (FINAL)
// ============================================
export async function completeCrewOnboarding(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const availability = formData.get("availability") as string;
  const phone = formData.get("phone") as string;

  if (!availability) {
    redirect("/onboarding/crew/step-5?error=required");
  }

  const availMap: Record<string, string> = {
    "0-1": "immediate",
    "1-3": "1-3_months",
    "3+": "3+_months",
  };
  const availabilityValue = availMap[availability] || "immediate";

  await supabase
    .from("profiles")
    .update({
      phone: phone || null,
      visibility: "public",
    })
    .eq("id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  if (profile.user_type === "seafarer") {
    await supabase
      .from("seafarer_details")
      .update({ availability: availabilityValue })
      .eq("id", user.id);
  } else if (profile.user_type === "yacht") {
    await supabase
      .from("yacht_details")
      .update({ availability: availabilityValue })
      .eq("id", user.id);
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/complete");
}

// ============================================
// COMPANY: Step 1 - Company Info
// ============================================
export async function updateCompanyInfo(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const country = formData.get("country") as string;
  const companyType = formData.get("companyType") as string;
  const companySize = formData.get("companySize") as string;
  const website = formData.get("website") as string;

  if (!country || !companyType) {
    redirect("/onboarding/company/step-1?error=required");
  }

  await supabase
    .from("profiles")
    .update({ country: country })
    .eq("id", user.id);

  await supabase
    .from("company_details")
    .update({
      headquarters_country: country,
      company_type: companyType,
      company_size: companySize || null,
      website: website || null,
    })
    .eq("id", user.id);

  revalidatePath("/onboarding/company");
  redirect("/onboarding/company/step-2");
}

// ============================================
// COMPANY: Step 2 - Hiring Info
// ============================================
export async function updateCompanyHiring(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const hiringRanks = formData.getAll("hiringRanks") as string[];
  const fleetTypes = formData.getAll("fleetTypes") as string[];

  await supabase
    .from("company_details")
    .update({
      hiring_for_ranks: hiringRanks,
      fleet_types: fleetTypes,
    })
    .eq("id", user.id);

  revalidatePath("/onboarding/company");
  redirect("/onboarding/company/step-3");
}

// ============================================
// COMPANY: Step 3 - Logo + Complete
// ============================================
export async function completeCompanyOnboarding(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const description = formData.get("description") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const logo = formData.get("logo") as File;

  let logoUrl: string | null = null;

  // Upload logo if provided
  if (logo && logo.size > 0) {
    if (logo.size > 2 * 1024 * 1024) {
      redirect("/onboarding/company/step-3?error=file_too_large");
    }

    const ext = logo.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("company-logos")
      .upload(fileName, logo, { upsert: true });

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from("company-logos")
        .getPublicUrl(fileName);
      logoUrl = publicUrl;
    }
  }

  await supabase
    .from("profiles")
    .update({
      visibility: "public",
      phone: contactPhone || null,
    })
    .eq("id", user.id);

  const updateData: Record<string, unknown> = {
    description: description || null,
    contact_phone: contactPhone || null,
  };
  if (logoUrl) {
    updateData.company_logo_url = logoUrl;
  }

  await supabase
    .from("company_details")
    .update(updateData)
    .eq("id", user.id);

  revalidatePath("/", "layout");
  redirect("/onboarding/complete");
}
