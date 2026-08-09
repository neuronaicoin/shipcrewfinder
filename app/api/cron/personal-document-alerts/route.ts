import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: crewProfiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, passport_expiry, seaman_book_expiry, stcw_expiry, medical_expiry")
    .in("user_type", ["seafarer", "yacht"]);

  if (!crewProfiles || crewProfiles.length === 0) {
    return NextResponse.json({ sent: 0, profilesChecked: 0 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 3600 * 1000;

  const isSoonOrExpired = (d: string | null): boolean => {
    if (!d) return false;
    const days = Math.round((new Date(d + "T00:00:00").getTime() - today.getTime()) / dayMs);
    return days <= 90 && days >= -3650;
  };

  const daysLeft = (d: string | null): number | null => {
    if (!d) return null;
    return Math.round((new Date(d + "T00:00:00").getTime() - today.getTime()) / dayMs);
  };

  let sentCount = 0;

  for (const p of crewProfiles) {
    const email = p.email as string | null;
    if (!email) continue;

    const items: { label: string; days: number | null }[] = [];
    if (isSoonOrExpired(p.passport_expiry as string | null)) {
      items.push({ label: "Passport", days: daysLeft(p.passport_expiry as string | null) });
    }
    if (isSoonOrExpired(p.seaman_book_expiry as string | null)) {
      items.push({ label: "Seaman's Book", days: daysLeft(p.seaman_book_expiry as string | null) });
    }
    if (isSoonOrExpired(p.stcw_expiry as string | null)) {
      items.push({ label: "STCW", days: daysLeft(p.stcw_expiry as string | null) });
    }
    if (isSoonOrExpired(p.medical_expiry as string | null)) {
      items.push({ label: "Medical Certificate", days: daysLeft(p.medical_expiry as string | null) });
    }

    if (items.length === 0) continue;

    const htmlList = items
      .map((i) => {
        const status = i.days !== null && i.days < 0 ? "already expired" : `expires in ${i.days} days`;
        return `<li style="margin-bottom:6px;"><strong>${i.label}</strong> — ${status}</li>`;
      })
      .join("");

    const firstName = ((p.full_name as string) || "there").split(" ")[0];

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#0d1030;">⚠️ Your Documents Need Attention</h2>
        <p style="color:#333;">Hi ${firstName},</p>
        <p style="color:#333;">The following documents on your ShipCrewFinder profile are expiring soon or have already expired:</p>
        <ul style="color:#333;">${htmlList}</ul>
        <p style="margin-top:20px;">
          <a href="https://shipcrewfinder.com/profile/me" style="background:#fbbf24;color:#0b0e13;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">Update My Documents</a>
        </p>
        <p style="color:#888;font-size:12px;margin-top:24px;">ShipCrewFinder — automated document reminder. Update or remove dates anytime from your profile.</p>
      </div>
    `;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ShipCrewFinder Alerts <onboarding@resend.dev>",
          to: email,
          subject: `⚠️ ${items.length} document${items.length === 1 ? "" : "s"} need${items.length === 1 ? "s" : ""} your attention`,
          html,
        }),
      });
      if (res.ok) sentCount++;
    } catch {
      // Bir kullanıcıda hata olsa bile diğerlerini etkilemesin
    }
  }

  return NextResponse.json({ sent: sentCount, profilesChecked: crewProfiles.length });
}
