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
// + Davet ödül motoru (2 başarılı davet = kalıcı Premium)
// + Tüm yeni crew üyelerine hoş geldin/Premium bilgisi maili
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

  // ── Davet ödülü: 2 başarılı davet = kalıcı PREMIUM rozeti ──
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
        // Davetliye sadece hoş geldin bildirimi (crew zaten $0 sonsuza kadar ücretsiz — bonus ay anlamsız)
        await admin
          .from("profiles")
          .update({ referral_rewarded: true })
          .eq("id", user.id);

        await admin.from("notifications").insert({
          user_id: user.id,
          type: "referral",
          title: "⚓ Welcome aboard!",
          message: "You joined via a shipmate's invite link — your profile is ready to go.",
          link: "/dashboard",
          read: false,
        });

        // Davet edenin toplam başarılı davet sayısını say
        await admin
          .from("referral_rewards")
          .update({ referrer_rewarded: true })
          .eq("referred_id", user.id);

        const { count: totalSuccessfulReferrals } = await admin
          .from("referral_rewards")
          .select("id", { count: "exact", head: true })
          .eq("referrer_id", referrerId)
          .eq("referrer_rewarded", true);

        const { data: referrerRow } = await admin
          .from("profiles")
          .select("is_premium")
          .eq("id", referrerId)
          .single();

        const alreadyPremium = referrerRow?.is_premium === true;

        if ((totalSuccessfulReferrals || 0) >= 2 && !alreadyPremium) {
          // Eşik aşıldı — Premium rozetini kalıcı olarak ver
          await admin
            .from("profiles")
            .update({ is_premium: true })
            .eq("id", referrerId);

          await admin.from("notifications").insert({
            user_id: referrerId,
            type: "referral",
            title: "🌟 You're now a Premium member!",
            message: "2 shipmates joined through your link — you've unlocked Premium: priority placement in search results and first alert on new job posts.",
            link: "/dashboard",
            read: false,
          });
        } else if (!alreadyPremium) {
          await admin.from("notifications").insert({
            user_id: referrerId,
            type: "referral",
            title: "A shipmate you invited joined",
            message: `${totalSuccessfulReferrals || 1}/2 successful invites — one more and you unlock Premium (priority search placement + first job alerts).`,
            link: "/dashboard",
            read: false,
          });
        }
      }
    } catch {
      // Ödül hatası onboarding'i asla bozmasın
    }
  }

  // ── Tüm yeni crew üyelerine: hoş geldin + Premium davet sistemi bilgisi maili ──
  if (profile.user_type === "seafarer" || profile.user_type === "yacht") {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();

      const { data: refProfile } = await supabase
        .from("profiles")
        .select("email, full_name, referral_code")
        .eq("id", user.id)
        .single();

      const { data: secretRow } = await admin
        .from("app_secrets")
        .select("value")
        .eq("key", "resend_api_key")
        .single();
      const resendKey = secretRow?.value as string | undefined;

      const email = refProfile?.email as string | null;
      if (email && resendKey) {
        const refCode = (refProfile?.referral_code as string) || "";
        const link = `https://shipcrewfinder.com/signup/crew?ref=${refCode}`;
        const firstName = ((refProfile?.full_name as string) || "there").split(" ")[0];

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "ShipCrewFinder <jobs@shipcrewfinder.com>",
            to: [email],
            subject: "⚓ Welcome aboard — plus a free way to get Premium",
            html: `
<div style="font-family:Arial,sans-serif;max-width:560px">
  <h2 style="color:#0d1030">⚓ Welcome to ShipCrewFinder</h2>
  <p>Hi ${firstName},</p>
  <p>Your profile is live — companies can find and message you directly, zero commission, always.</p>
  <p>One more thing: invite <b>2 friends</b> with your personal link below. Once they join and finish their profile, you get <b>Premium — free, forever</b>:</p>
  <ul>
    <li>Show up first in company searches</li>
    <li>Get new jobs before anyone else</li>
  </ul>
  <p>Your link:</p>
  <p style="background:#f4f4f4;padding:12px;border-radius:8px;word-break:break-all;font-family:monospace;font-size:13px;">${link}</p>
  <p><a href="${link}" style="background:#fbbf24;color:#0b0e13;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">Copy your link →</a></p>
  <p style="color:#888;font-size:12px;margin-top:18px">You're receiving this because you just created a ShipCrewFinder account.</p>
</div>`,
            text: `Welcome to ShipCrewFinder! Invite 2 friends with your link to get Premium free forever: ${link}`,
          }),
        });
      }
    } catch {
      // Mail hatası onboarding'i asla bozmasın
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
