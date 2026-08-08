import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: companies } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("user_type", "company");

  if (!companies || companies.length === 0) {
    return NextResponse.json({ sent: 0, companiesChecked: 0 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMs = 24 * 3600 * 1000;

  const isSoonOrExpired = (d: string | null): boolean => {
    if (!d) return false;
    const days = Math.round((new Date(d + "T00:00:00").getTime() - today.getTime()) / dayMs);
    return days <= 30;
  };

  let sentCount = 0;

  for (const company of companies) {
    const companyId = company.id as string;
    const companyEmail = company.email as string | null;
    if (!companyEmail) continue;

    const { data: vessels } = await supabase
      .from("vessels")
      .select("id, name")
      .eq("company_id", companyId);

    const vesselNameMap: Record<string, string> = {};
    (vessels || []).forEach((v) => {
      vesselNameMap[v.id as string] = v.name as string;
    });

    const { data: crewRows } = await supabase
      .from("fleet_crew")
      .select("full_name, rank, vessel_id, passport_expiry, seaman_book_expiry, health_report_expiry, visa_expiry, stcw_endorsement_expiry")
      .eq("company_id", companyId)
      .eq("status", "active");

    const alerts: string[] = [];
    (crewRows || []).forEach((c) => {
      const items: string[] = [];
      if (isSoonOrExpired(c.passport_expiry as string | null)) items.push("Passport");
      if (isSoonOrExpired(c.seaman_book_expiry as string | null)) items.push("Seaman's Book");
      if (isSoonOrExpired(c.health_report_expiry as string | null)) items.push("Health Report");
      if (isSoonOrExpired(c.visa_expiry as string | null)) items.push("Visa");
      if (isSoonOrExpired(c.stcw_endorsement_expiry as string | null)) items.push("STCW Endorsement");
      if (items.length > 0) {
        const vesselName = vesselNameMap[c.vessel_id as string] || "Unknown vessel";
        alerts.push(`${c.full_name as string} (${(c.rank as string) || "Crew"}, ${vesselName}) — ${items.join(", ")}`);
      }
    });

    if (alerts.length === 0) continue;

    const htmlList = alerts.map((a) => `<li style="margin-bottom:6px;">${a}</li>`).join("");
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#0d1030;">⚠️ Document Expiry Alert</h2>
        <p style="color:#333;">The following crew members have documents expiring within 30 days or already expired:</p>
        <ul style="color:#333;">${htmlList}</ul>
        <p style="margin-top:20px;">
          <a href="https://shipcrewfinder.com/fleet" style="background:#fbbf24;color:#0b0e13;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">View My Fleet</a>
        </p>
        <p style="color:#888;font-size:12px;margin-top:24px;">ShipCrewFinder — automated daily alert</p>
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
          to: companyEmail,
          subject: `⚠️ ${alerts.length} crew document${alerts.length === 1 ? "" : "s"} expiring soon`,
          html,
        }),
      });
      if (res.ok) sentCount++;
    } catch {
      // Bir şirkette hata olsa bile diğerlerini etkilemesin
    }
  }

  return NextResponse.json({ sent: sentCount, companiesChecked: companies.length });
}
