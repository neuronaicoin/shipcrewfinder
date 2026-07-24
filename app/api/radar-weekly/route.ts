import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "ShipCrewFinder <alerts@shipcrewfinder.com>";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  const admin = createAdminClient();

  // Cron anahtarı kontrolü
  const { data: secret } = await admin
    .from("app_secrets")
    .select("value")
    .eq("key", "cron_key")
    .single();
  if (!secret?.value || key !== secret.value) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: resendRow } = await admin
    .from("app_secrets")
    .select("value")
    .eq("key", "resend_api_key")
    .single();
  const resendKey = (resendRow?.value as string) || "";

  // 90 gün penceresi
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const dayMs = 24 * 3600 * 1000;
  const todayKey = today.toISOString().slice(0, 10);
  const endKey = new Date(today.getTime() + 90 * dayMs).toISOString().slice(0, 10);

  // Yaklaşan sign-off'lu crew detayları
  const { data: rawDetails } = await admin
    .from("seafarer_details")
    .select("id, rank, contract_end_date")
    .gte("contract_end_date", todayKey)
    .lte("contract_end_date", endKey);

  const details = (rawDetails || []) as { id: string; rank: string | null; contract_end_date: string }[];

  if (details.length === 0) {
    return NextResponse.json({ ok: true, report: "no upcoming sign-offs" });
  }

  // Sadece public seafarer profilleri
  const ids = details.map((d) => d.id);
  const { data: pubProfs } = await admin
    .from("profiles")
    .select("id")
    .in("id", ids)
    .eq("visibility", "public")
    .eq("user_type", "seafarer");
  const pubSet = new Set((pubProfs || []).map((p) => p.id as string));
  const crew = details.filter((d) => pubSet.has(d.id));

  if (crew.length === 0) {
    return NextResponse.json({ ok: true, report: "no public upcoming sign-offs" });
  }

  // Engelleme listesi (crew_id -> engellediği company_id'ler)
  const { data: blockedRows } = await admin
    .from("blocked_companies")
    .select("user_id, company_id");
  const blockedMap: Record<string, Set<string>> = {};
  (blockedRows || []).forEach((b) => {
    const cid = b.user_id as string;
    if (!blockedMap[cid]) blockedMap[cid] = new Set();
    blockedMap[cid].add(b.company_id as string);
  });

  // Tüm şirketler (hiring ranks + email)
  const { data: companies } = await admin
    .from("profiles")
    .select("id, email, full_name")
    .eq("user_type", "company");

  const { data: companyDetails } = await admin
    .from("company_details")
    .select("id, hiring_for_ranks");
  const ranksMap: Record<string, string[]> = {};
  (companyDetails || []).forEach((c) => {
    ranksMap[c.id as string] = Array.isArray(c.hiring_for_ranks)
      ? (c.hiring_for_ranks as string[]).map((r) => r.toUpperCase())
      : [];
  });

  let mailed = 0;
  const report: string[] = [];

  for (const comp of companies || []) {
    const compId = comp.id as string;
    const compEmail = (comp.email as string) || "";
    const compName = ((comp.full_name as string) || "there").split(" ")[0];
    const ranks = ranksMap[compId] || [];

    // Şirkete uyan crew (rank filtresi + engel kontrolü)
    const matches = crew.filter((c) => {
      if (blockedMap[c.id]?.has(compId)) return false;
      if (ranks.length === 0) return true;
      return ranks.includes(((c.rank as string) || "").toUpperCase());
    });

    if (matches.length === 0) continue;

    const c30 = matches.filter(
      (m) => (new Date(m.contract_end_date + "T00:00:00").getTime() - today.getTime()) / dayMs <= 30
    ).length;

    // Rank bazlı özet satırları
    const byRank: Record<string, number> = {};
    matches.forEach((m) => {
      const r = (m.rank as string) || "Crew";
      byRank[r] = (byRank[r] || 0) + 1;
    });
    const rankLines = Object.entries(byRank)
      .map(([r, n]) => "• " + r + ": " + n)
      .join("\n");
    const rankHtml = Object.entries(byRank)
      .map(([r, n]) => "<li><b>" + r + "</b>: " + n + "</li>")
      .join("");

    const subject =
      "📡 Rotation Radar: " + matches.length + " crew free within 90 days" +
      (c30 > 0 ? " (" + c30 + " within 30)" : "");

    const text =
      "Hi " + compName + ",\n\n" +
      matches.length + " crew member(s) in your hiring ranks have contracts ending within the next 90 days" +
      (c30 > 0 ? " — " + c30 + " of them within 30 days" : "") + ".\n\n" +
      rankLines + "\n\n" +
      "See who's coming available (sorted by sign-off date):\n" +
      "https://shipcrewfinder.com/radar\n\n" +
      "Contact them before they even start looking.\n\n" +
      "— ShipCrewFinder Rotation Radar";

    const html =
      "<div style=\"font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0d1030;color:#eef4fa;border-radius:14px\">" +
      "<h2 style=\"color:#fbbf24;margin:0 0 14px\">📡 Rotation Radar — weekly</h2>" +
      "<p style=\"line-height:1.6;margin:0 0 12px\">Hi " + compName + ",</p>" +
      "<p style=\"line-height:1.6;margin:0 0 12px\"><b style=\"color:#fbbf24\">" + matches.length + " crew member(s)</b> in your hiring ranks have contracts ending within the next <b>90 days</b>" +
      (c30 > 0 ? " — <b style=\"color:#34d399\">" + c30 + " within 30 days</b>" : "") + ".</p>" +
      "<ul style=\"line-height:1.8;margin:0 0 16px;padding-left:18px;color:#a8bdd2\">" + rankHtml + "</ul>" +
      "<a href=\"https://shipcrewfinder.com/radar\" style=\"display:inline-block;background:#fbbf24;color:#0b0e13;font-weight:bold;padding:12px 22px;border-radius:10px;text-decoration:none\">Open Rotation Radar →</a>" +
      "<p style=\"font-size:12px;color:#6b83a0;margin:20px 0 0\">Contact them before they even start looking.<br>— ShipCrewFinder</p>" +
      "</div>";

    if (resendKey && compEmail) {
      try {
        await fetch(RESEND_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + resendKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from: FROM, to: [compEmail], subject, text, html }),
        });
        mailed++;
      } catch {
        // sessiz geç
      }
    }

    // Zil bildirimi
    await admin.from("notifications").insert({
      user_id: compId,
      type: "rotation_radar",
      title: subject,
      message: "Sorted by sign-off date — earliest first",
      link: "/radar",
      read: false,
    });

    report.push(compId.slice(0, 8) + ":" + matches.length);
  }

  return NextResponse.json({ ok: true, crew: crew.length, companies_mailed: mailed, report });
}
