import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BROADCAST_SECRET = "scf-last90-referral-2026-t4r8";

// Tek seferlik: son 90 kayit olan crew uyeye (zaten premium olmayanlara) referral davetini gonderir.
// Calistirmak icin: https://shipcrewfinder.com/api/admin/broadcast-last90?secret=scf-last90-referral-2026-t4r8
export async function GET(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get("secret");
    if (secret !== BROADCAST_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: secretRow, error: secretError } = await supabase
      .from("app_secrets")
      .select("value")
      .eq("key", "resend_api_key")
      .single();
    const resendKey = secretRow?.value as string | undefined;

    const { data: crewProfiles, error: queryError } = await supabase
      .from("profiles")
      .select("id, email, full_name, referral_code, is_premium, created_at")
      .in("user_type", ["seafarer", "yacht"])
      .order("created_at", { ascending: false })
      .limit(90);

    if (queryError) {
      return NextResponse.json(
        { error: "Query failed", details: queryError.message, hint: queryError.hint || null },
        { status: 500 }
      );
    }

    if (!crewProfiles || crewProfiles.length === 0) {
      return NextResponse.json({ sent: 0, total: 0, secretRowError: secretError?.message || null });
    }

    let sentCount = 0;
    let skippedPremium = 0;
    let skippedNoEmail = 0;
    const errors: string[] = [];

    for (const p of crewProfiles) {
      if (p.is_premium === true) {
        skippedPremium++;
        continue;
      }

      const refCode = (p.referral_code as string) || "";
      const link = `https://shipcrewfinder.com/signup/crew?ref=${refCode}`;
      const firstName = ((p.full_name as string) || "there").split(" ")[0];
      const email = p.email as string | null;

      if (!email || !resendKey) {
        skippedNoEmail++;
        continue;
      }

      try {
        await supabase.from("notifications").insert({
          user_id: p.id,
          type: "referral",
          title: "🌟 Invite 2 friends, get Premium — free, forever",
          message: "2 friends join with your link and finish their profile — you get Premium, free forever. Check your dashboard for your link.",
          link: "/dashboard",
          read: false,
        });

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "ShipCrewFinder <jobs@shipcrewfinder.com>",
            to: [email],
            subject: "🌟 Invite 2 friends, get Premium — free, forever",
            html:
              '<div style="font-family:Arial,sans-serif;max-width:560px">' +
              '<h2 style="color:#0d1030">⚓ Get Premium for free</h2>' +
              "<p>Hi " + firstName + ",</p>" +
              "<p>Welcome aboard ShipCrewFinder. Here's a fast way to unlock more from your profile: invite <b>2 friends</b> with your personal link below. Once they join and finish their profile, you get <b>Premium — free, forever</b>:</p>" +
              "<ul><li>Show up first in company searches</li><li>Get new jobs before anyone else</li></ul>" +
              "<p>Your link:</p>" +
              '<p style="background:#f4f4f4;padding:12px;border-radius:8px;word-break:break-all;font-family:monospace;font-size:13px;">' + link + "</p>" +
              '<p><a href="' + link + '" style="background:#fbbf24;color:#0b0e13;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">Copy your link →</a></p>' +
              '<p style="color:#888;font-size:12px;margin-top:18px">You\'re receiving this because you recently joined ShipCrewFinder.</p>' +
              "</div>",
            text: "Invite 2 friends with your link, get Premium free forever. Your link: " + link,
          }),
        });

        if (!resendRes.ok) {
          const bodyText = await resendRes.text();
          errors.push(`${email}: resend ${resendRes.status} ${bodyText.slice(0, 120)}`);
          continue;
        }

        sentCount++;
      } catch (e) {
        errors.push(`${email}: ${e instanceof Error ? e.message : "unknown error"}`);
        continue;
      }
    }

    return NextResponse.json({
      sent: sentCount,
      skippedAlreadyPremium: skippedPremium,
      skippedNoEmail,
      totalChecked: crewProfiles.length,
      resendKeyFound: !!resendKey,
      errors: errors.slice(0, 5),
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Unhandled exception", message: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
