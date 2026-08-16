import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const WEEKLY_SECRET = "scf-weekly-digest-2026-p4m8";

// Haftada 1 çalışacak: sadece GERÇEK verisi olan üyelere mail atar
// (0 görüntüleme + 0 yeni ilan varsa o hafta hiç mail göndermez — değersiz mail göndermemek için)
// Zamanlamak için: cron-job.org gibi ücretsiz bir servise, haftada 1 kez şu adresi çağırt:
// https://shipcrewfinder.com/api/cron/weekly-digest?secret=scf-weekly-digest-2026-p4m8
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== WEEKLY_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: secretRow } = await supabase
    .from("app_secrets")
    .select("value")
    .eq("key", "resend_api_key")
    .single();
  const resendKey = secretRow?.value as string | undefined;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  const { data: crewProfiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, user_type, is_premium, referral_code")
    .in("user_type", ["seafarer", "yacht"])
    .eq("visibility", "public");

  if (!crewProfiles || crewProfiles.length === 0) {
    return NextResponse.json({ sent: 0, skippedNoData: 0, total: 0 });
  }

  let sentCount = 0;
  let skippedNoData = 0;

  for (const p of crewProfiles) {
    const table = p.user_type === "seafarer" ? "seafarer_details" : "yacht_details";
    const rankCol = p.user_type === "seafarer" ? "rank" : "position";

    const { data: details } = await supabase
      .from(table)
      .select(rankCol)
      .eq("id", p.id)
      .maybeSingle();
    const rank = (details?.[rankCol] as string) || "";

    const { count: viewCount } = await supabase
      .from("company_profile_views")
      .select("id", { count: "exact", head: true })
      .eq("crew_id", p.id)
      .gte("created_at", sevenDaysAgo);

    let jobCount = 0;
    if (rank) {
      const { count: jc } = await supabase
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("rank_required", rank)
        .eq("status", "active")
        .gte("created_at", sevenDaysAgo);
      jobCount = jc || 0;
    }

    const views = viewCount || 0;

    // Hiç veri yoksa — bu hafta hiç mail atma (degersiz mail = kayip uye)
    if (views === 0 && jobCount === 0) {
      skippedNoData++;
      continue;
    }

    const firstName = ((p.full_name as string) || "there").split(" ")[0];
    const isPremium = p.is_premium === true;
    const refCode = (p.referral_code as string) || "";
    const refLink = "https://shipcrewfinder.com/signup/crew?ref=" + refCode;

    const lines: string[] = [];
    if (views > 0) {
      lines.push(views + " compan" + (views === 1 ? "y" : "ies") + " viewed your profile this week");
    }
    if (jobCount > 0) {
      lines.push(jobCount + " new " + rank + " job" + (jobCount === 1 ? "" : "s") + " posted this week");
    }

    await supabase.from("notifications").insert({
      user_id: p.id,
      type: "weekly_digest",
      title: "Your week on ShipCrewFinder",
      message: lines.join(" · "),
      link: "/dashboard",
      read: false,
    });

    const email = p.email as string | null;
    if (email && resendKey) {
      const bulletsHtml = lines.map((l) => "<li>" + l + "</li>").join("");
      const referralBlock = isPremium
        ? ""
        : '<p style="margin-top:18px">You are not Premium yet. Invite 2 friends with your link, get Premium free forever:</p>' +
          '<p style="background:#f4f4f4;padding:12px;border-radius:8px;word-break:break-all;font-family:monospace;font-size:13px;">' +
          refLink +
          "</p>";

      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + resendKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "ShipCrewFinder <jobs@shipcrewfinder.com>",
            to: [email],
            subject: "⚓ Your week on ShipCrewFinder",
            html:
              '<div style="font-family:Arial,sans-serif;max-width:560px">' +
              '<h2 style="color:#0d1030">⚓ Your week on ShipCrewFinder</h2>' +
              "<p>Hi " + firstName + ",</p>" +
              "<ul>" + bulletsHtml + "</ul>" +
              '<p><a href="https://shipcrewfinder.com/dashboard" style="background:#fbbf24;color:#0b0e13;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">Open dashboard →</a></p>' +
              referralBlock +
              '<p style="color:#888;font-size:12px;margin-top:18px">You are receiving this weekly summary because you have an active ShipCrewFinder profile.</p>' +
              "</div>",
            text: lines.join(". ") + ". View: https://shipcrewfinder.com/dashboard",
          }),
        });
      } catch {
        // Bir üyeye mail gönderilemese bile diğerlerini etkilemesin
      }
    }

    sentCount++;
  }

  return NextResponse.json({
    sent: sentCount,
    skippedNoData,
    total: crewProfiles.length,
    resendKeyFound: !!resendKey,
  });
}
