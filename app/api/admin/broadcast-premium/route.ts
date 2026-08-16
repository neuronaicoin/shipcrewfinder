import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BROADCAST_SECRET = "scf-premium-broadcast-2026-x9k4";

// Tek seferlik duyuru: mevcut tüm crew üyelerine yeni Premium davet sistemini duyurur.
// Çalıştırmak için: https://shipcrewfinder.com/api/admin/broadcast-premium?secret=scf-premium-broadcast-2026-x9k4
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== BROADCAST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: secretRow } = await supabase
    .from("app_secrets")
    .select("value")
    .eq("key", "resend_api_key")
    .single();
  const resendKey = secretRow?.value as string | undefined;

  const { data: crewProfiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, referral_code, is_premium")
    .in("user_type", ["seafarer", "yacht"]);

  if (!crewProfiles || crewProfiles.length === 0) {
    return NextResponse.json({ sent: 0, total: 0 });
  }

  let sentCount = 0;
  let skippedPremium = 0;

  for (const p of crewProfiles) {
    if (p.is_premium === true) {
      skippedPremium++;
      continue;
    }

    const refCode = (p.referral_code as string) || "";
    const link = `https://shipcrewfinder.com/signup/crew?ref=${refCode}`;
    const firstName = ((p.full_name as string) || "there").split(" ")[0];

    await supabase.from("notifications").insert({
      user_id: p.id,
      type: "referral",
      title: "🌟 New: Invite 2 friends, get Premium",
      message: "2 friends join with your link and finish their profile — you get Premium, free forever. Check your dashboard for your link.",
      link: "/dashboard",
      read: false,
    });

    const email = p.email as string | null;
    if (email && resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "ShipCrewFinder <jobs@shipcrewfinder.com>",
            to: [email],
            subject: "🌟 New: Invite 2 friends, get Premium — free, forever",
            html:
              '<div style="font-family:Arial,sans-serif;max-width:560px">' +
              "<h2 style=\"color:#0d1030\">⚓ New — get Premium for free</h2>" +
              "<p>Hi " + firstName + ",</p>" +
              "<p>We just launched something new: invite <b>2 friends</b> to ShipCrewFinder with your personal link. Once they join and finish their profile, you get <b>Premium — free, forever</b>:</p>" +
              "<ul><li>Show up first in company searches</li><li>Get new jobs before anyone else</li></ul>" +
              "<p>Your link:</p>" +
              "<p style=\"background:#f4f4f4;padding:12px;border-radius:8px;word-break:break-all;font-family:monospace;font-size:13px;\">" + link + "</p>" +
              "<p><a href=\"" + link + "\" style=\"background:#fbbf24;color:#0b0e13;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;\">Copy your link →</a></p>" +
              "<p style=\"color:#888;font-size:12px;margin-top:18px\">You're receiving this because you're a ShipCrewFinder crew member. This is a one-time announcement about a new feature.</p>" +
              "</div>",
            text: "Invite 2 friends with your link, get Premium free forever. Your link: " + link,
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
    skippedAlreadyPremium: skippedPremium,
    total: crewProfiles.length,
    resendKeyFound: !!resendKey,
  });
}
