"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ============================================
// CREW: Step 1 - Rank
// ============================================
export async function updateCrewRank(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const rank = formData.get("rank") as string;
  if (!rank) return { error: "Rank is required" };

  // Get user type from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profile not found" };

  // Upsert into the right details table
  if (profile.user_type === "seafarer") {
    const { error } = await supabase.from("seafarer_details").upsert({
      id: user.id,
      rank: rank,
    });
    if (error) return { error: error.message };
  } else if (profile.user_type === "yacht") {
    const { error } = await supabase.from("yacht_details").upsert({
      id: user.id,
      position: rank,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/onboarding/crew");
  redirect("/onboarding/crew/step-2");
}

// ============================================
// CREW: Step 2 - Experience
// ============================================
export async function updateCrewExperience(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const experience = formData.get("experience") as string;
  if (!experience) return { error: "Experience is required" };

  // Map text to years
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

  if (!profile) return { error: "Profile not found" };

  if (profile.user_type === "seafarer") {
    const { error } = await supabase
      .from("seafarer_details")
      .update({ years_experience: years })
      .eq("id", user.id);
    if (error) return { error: error.message };
  } else if (profile.user_type === "yacht") {
    const { error } = await supabase
      .from("yacht_details")
      .update({ years_experience: years })
      .eq("id", user.id);
    if (error) return { error: error.message };
  }

  revalidatePath("/onboarding/crew");
  redirect("/onboarding/crew/step-3");
}

// ============================================
// CREW: Step 3 - Nationality + Languages
// ============================================
export async function updateCrewNationality(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const nationality = formData.get("nationality") as string;
  const englishLevel = formData.get("englishLevel") as string;
  const languages = formData.getAll("languages") as string[];

  if (!nationality) return { error: "Nationality is required" };

  // Update profile country
  await supabase
    .from("profiles")
    .update({ country: nationality })
    .eq("id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profile not found" };

  if (profile.user_type === "seafarer") {
    const { error } = await supabase
      .from("seafarer_details")
      .update({
        nationality: nationality,
        languages: languages,
        english_level: englishLevel || null,
      })
      .eq("id", user.id);
    if (error) return { error: error.message };
  } else if (profile.user_type === "yacht") {
    const { error } = await supabase
      .from("yacht_details")
      .update({
        languages: languages,
        english_level: englishLevel || null,
      })
      .eq("id", user.id);
    if (error) return { error: error.message };
  }

  revalidatePath("/onboarding/crew");
  redirect("/onboarding/crew/step-4");
}

// ============================================
// CREW: Step 4 - CV Upload
// ============================================
export async function uploadCrewCV(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const file = formData.get("cv") as File;
  if (!file || file.size === 0) {
    // CV upload is optional - skip
    redirect("/onboarding/crew/step-5");
  }

  // Validate
  if (file.size > 5 * 1024 * 1024) {
    return { error: "CV file is too large (max 5MB)" };
  }
  if (file.type !== "application/pdf") {
    return { error: "Only PDF files are accepted" };
  }

  // Upload to Storage
  const fileName = `${user.id}-${Date.now()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("cvs")
    .upload(fileName, file, {
      upsert: true,
      contentType: "application/pdf",
    });

  if (uploadError) return { error: uploadError.message };

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

  if (!profile) return { error: "Profile not found" };

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
export async function completeCrewOnboarding(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const availability = formData.get("availability") as string;
  const phone = formData.get("phone") as string;
  const whatsapp = formData.get("whatsapp") as string;

  if (!availability) return { error: "Availability is required" };

  // Map availability
  const availMap: Record<string, string> = {
    "0-1": "immediate",
    "1-3": "1-3_months",
    "3+": "3+_months",
  };
  const availabilityValue = availMap[availability] || "immediate";

  // Update profile (phone + make profile public)
  await supabase
    .from("profiles")
    .update({
      phone: phone || null,
      visibility: "public", // Now ready to be seen
    })
    .eq("id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profile not found" };

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
  redirect("/dashboard?onboarding=complete");
}

// ============================================
// COMPANY ONBOARDING
// ============================================

// Step 1: Company info
export async function updateCompanyInfo(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const country = formData.get("country") as string;
  const companyType = formData.get("companyType") as string;
  const companySize = formData.get("companySize") as string;
  const website = formData.get("website") as string;

  if (!country || !companyType) {
    return { error: "Country and company type are required" };
  }

  // Update profile country
  await supabase
    .from("profiles")
    .update({ country: country })
    .eq("id", user.id);

  const { error } = await supabase
    .from("company_details")
    .update({
      headquarters_country: country,
      company_type: companyType,
      company_size: companySize || null,
      website: website || null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/onboarding/company");
  redirect("/onboarding/company/step-2");
}

// Step 2: Hiring info
export async function updateCompanyHiring(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const hiringRanks = formData.getAll("hiringRanks") as string[];
  const fleetTypes = formData.getAll("fleetTypes") as string[];

  const { error } = await supabase
    .from("company_details")
    .update({
      hiring_for_ranks: hiringRanks,
      fleet_types: fleetTypes,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/onboarding/company");
  redirect("/onboarding/company/step-3");
}

// Step 3: Logo + complete
export async function completeCompanyOnboarding(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const description = formData.get("description") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const logo = formData.get("logo") as File;

  let logoUrl: string | null = null;

  // Upload logo if provided
  if (logo && logo.size > 0) {
    if (logo.size > 2 * 1024 * 1024) {
      return { error: "Logo file is too large (max 2MB)" };
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

  // Make profile public + add phone
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

  const { error } = await supabase
    .from("company_details")
    .update(updateData)
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard?onboarding=complete");
}
