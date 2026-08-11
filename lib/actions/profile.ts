"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "ShipCrewFinder <jobs@shipcrewfinder.com>";

// Onboarding'i tamamlayan bir denizcinin rütbesini "hiring_for_ranks" listesinde
// arayan tüm görünür şirketlere otomatik "yeni eşleşen aday" bildirimi + mail gönderir
async function notifyMatchingCompanies(
  supabase: Awaited<ReturnType<typeof createClient>>,
  crewRank: string,
  crewId: string
) {
  try {
    if (!crewRank) return;

    const { data: matchingCompanies } = await supabase
      .from("company_details")
      .select("id, company_name, hiring_for_ranks, profiles!inner(email, full_name, visibility)")
      .contains("hiring_for_ranks", [crewRank]);

    if (!matchingCompanies || matchingCompanies.length === 0) return;

    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    const { data: secret } = await admin
      .from("app_secrets")
      .select("value")
      .eq("key", "resend_api_key")
      .single();

    for (const c of matchingCompanies) {
      const companyProfile = (c as { profiles?: { email?: string; full_name?: string; visibility?: string } }).profiles;
      if (!companyProfile || companyProfile.visibility !== "public") continue;

      const companyName = (c.company_name as string) || companyProfile.full_name || "there";

      await admin.from("notifications").insert({
        user_id: c.id,
        type: "new_candidate",
        title: `⚓ New ${crewRank} joined ShipCrewFinder`,
        message: `A verified ${crewRank} profile matching your hiring needs just went live.`,
        link: `/candidate/${crewId}`,
        read: false,
      });

      if (!secret?.value || !companyProfile.email) continue;

      try {
        await fetch(RESEND_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secret.value as string}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM,
            to: [companyProfile.email],
            subject: `⚓ New ${crewRank} just joined ShipCrewFinder`,
            html: `
<div style="font-family:Arial,sans-serif;max-width:560px">
  <h2 style="color:#0d1030">⚓ A new candidate matches your search</h2>
  <p>Hi ${companyName},</p>
  <p>A verified <b>${crewRank}</b> just completed their profile on ShipCrewFinder — matching one of the ranks you're hiring for.</p>
  <p><a href="https://shipcrewfinder.com/candidate/${crewId}" style="background:#fbbf24;color:#0b0e13;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">View Profile</a></p>
  <p style="color:#888;font-size:12px;margin-top:18px">You're receiving this because you listed ${crewRank} as a rank you're hiring for on shipcrewfinder.com.</p>
</div>`,
            text: `A new ${crewRank} just joined ShipCrewFinder — matching your hiring needs. View: https://shipcrewfinder.com/candidate/${crewId}`,
          }),
        });
      } catch {
        // Bir şirkete mail gönderimi başarısız olsa bile diğerlerini etkilemesin
      }
    }
  } catch {
    // Bu bildirim asla onboarding akışını bozmasın
  }
}

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
    "5+": 7,
    "10+": 12,
    "20+": 22,
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
// + Davet ödül motoru (6 ayda 2 limiti)
// ============================================
export async function completeCrewOnboarding(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const availability = formData.get("availability") as string;
  const phone = formData.get("phone") as string;
  const contractEndDate = formData.get("contractEndDate") as string;
  const contractStartDate = formData.get("contractStartDate") as string;

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
    .select("user_type, referred_by, referral_rewarded, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  // ── Ana sayfa kartı: onboarding bitince otomatik oluştur (elle paylaşmaya gerek yok) ──
  if (profile.user_type === "seafarer" || profile.user_type === "yacht") {
    try {
      const THIRTY_DAYS_MS = 30 * 24 * 3600 * 1000;
      const nowIso = new Date().toISOString();
      const expiresAt = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();

      await supabase.from("deck_posts").delete().eq("user_id", user.id).eq("post_type", "crew");
      await supabase.from("deck_posts").insert({
        user_id: user.id,
        post_type: "crew",
        note: null,
        show_contact: false,
        expires_at: expiresAt,
        boosted_at: nowIso,
      });
    } catch {
      // Kart oluşturma hatası onboarding'i asla bozmasın
    }
  }

  if (profile.user_type === "seafarer") {
    await supabase
      .from("seafarer_details")
      .update({
        availability: availabilityValue,
        contract_end_date: contractEndDate || null,
        contract_start_date: contractStartDate || null,
      })
      .eq("id", user.id);
  } else if (profile.user_type === "yacht") {
    await supabase
      .from("yacht_details")
      .update({
        availability: availabilityValue,
        contract_end_date: contractEndDate || null,
        contract_start_date: contractStartDate || null,
      })
      .eq("id", user.id);
  }

  // ── Şirketlere otomatik "yeni eşleşen aday" bildirimi ──
  if (profile.user_type === "seafarer" || profile.user_type === "yacht") {
    const { data: freshDetails } = await supabase
      .from(profile.user_type === "seafarer" ? "seafarer_details" : "yacht_details")
      .select("rank, position")
      .eq("id", user.id)
      .maybeSingle();
    const candidateRank = (freshDetails?.rank as string) || (freshDetails?.position as string) || "";
    if (candidateRank) {
      notifyMatchingCompanies(supabase, candidateRank, user.id);
    }
  }

  // ── Davet ödülü: profil TAMAMLANINCA, bir kez ──
  if (profile.referred_by && !profile.referral_rewarded) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();

      const referrerId = profile.referred_by as string;

      // Ödül kaydı (unique referred_id — çift ödülü DB engeller)
      const { error: insErr } = await admin.from("referral_rewards").insert({
        referrer_id: referrerId,
        referred_id: user.id,
        referrer_rewarded: false,
      });

      if (!insErr) {
        // Davetliye +1 ay (her zaman)
        const { data: meRow } = await admin
          .from("profiles")
          .select("bonus_months")
          .eq("id", user.id)
          .single();
        await admin
          .from("profiles")
          .update({
            bonus_months: ((meRow?.bonus_months as number) || 0) + 1,
            referral_rewarded: true,
          })
          .eq("id", user.id);

        await admin.from("notifications").insert({
          user_id: user.id,
          type: "referral",
          title: "🎁 +1 free month earned",
          message: "Welcome aboard — your shipmate invite bonus is active.",
          link: "/dashboard",
          read: false,
        });

        // Davet edene +1 ay — son 180 günde en fazla 2 ödül
        const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 3600 * 1000).toISOString();
        const { count: recentRewards } = await admin
          .from("referral_rewards")
          .select("id", { count: "exact", head: true })
          .eq("referrer_id", referrerId)
          .eq("referrer_rewarded", true)
          .gte("created_at", sixMonthsAgo);

        if ((recentRewards || 0) < 2) {
          const { data: refRow } = await admin
            .from("profiles")
            .select("bonus_months")
            .eq("id", referrerId)
            .single();
          await admin
            .from("profiles")
            .update({
              bonus_months: ((refRow?.bonus_months as number) || 0) + 1,
            })
            .eq("id", referrerId);

          await admin
            .from("referral_rewards")
            .update({ referrer_rewarded: true })
            .eq("referred_id", user.id);

          await admin.from("notifications").insert({
            user_id: referrerId,
            type: "referral",
            title: "🎁 +1 free month earned",
            message: "A shipmate you invited just completed their profile.",
            link: "/dashboard",
            read: false,
          });
        } else {
          await admin.from("notifications").insert({
            user_id: referrerId,
            type: "referral",
            title: "A shipmate you invited joined",
            message: "Invite reward limit reached (2 per 6 months) — this one didn't earn a bonus month.",
            link: "/dashboard",
            read: false,
          });
        }
      }
    } catch {
      // Ödül hatası onboarding'i asla bozmasın
    }
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
    .upsert({
      id: user.id,
      headquarters_country: country,
      company_type: companyType,
      company_size: companySize || null,
      website: website || null,
    });

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
    .upsert({
      id: user.id,
      hiring_for_ranks: hiringRanks,
      fleet_types: fleetTypes,
    });

  revalidatePath("/onboarding/company");
  redirect("/onboarding/company/step-3");
}

// ============================================
// COMPANY: Step 3 - Complete (logo removed)
// ============================================
export async function completeCompanyOnboarding(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const description = formData.get("description") as string;
  const contactPhone = formData.get("contactPhone") as string;

  await supabase
    .from("profiles")
    .update({
      visibility: "public",
      phone: contactPhone || null,
    })
    .eq("id", user.id);

  await supabase
    .from("company_details")
    .upsert({
      id: user.id,
      description: description || null,
      contact_phone: contactPhone || null,
    });

  revalidatePath("/", "layout");
  redirect("/onboarding/complete");
}

// ============================================
// CREW: Personal document expiry dates (self-service reminders)
// ============================================
export async function updatePersonalDocuments(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const passportExpiry = (formData.get("passportExpiry") as string) || null;
  const seamanBookExpiry = (formData.get("seamanBookExpiry") as string) || null;
  const stcwExpiry = (formData.get("stcwExpiry") as string) || null;
  const medicalExpiry = (formData.get("medicalExpiry") as string) || null;

  await supabase
    .from("profiles")
    .update({
      passport_expiry: passportExpiry,
      seaman_book_expiry: seamanBookExpiry,
      stcw_expiry: stcwExpiry,
      medical_expiry: medicalExpiry,
    })
    .eq("id", user.id);

  revalidatePath("/profile/me");
  redirect("/profile/me?docsaved=1");
}
