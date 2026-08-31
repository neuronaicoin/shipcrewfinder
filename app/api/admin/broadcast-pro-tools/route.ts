import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BROADCAST_SECRET = "scf-pro-tools-2026-m7q2";

const ENGINE_RANKS = ["CHIEF ENGINEER", "2ND ENGINEER"];
const DECK_RANKS = ["MASTER", "CHIEF OFFICER"];

// Tek seferlik duyuru: Oil Record Book Pro (C/E + 2/E) ve Draft Survey Pro + Document Generator Pro (Master + C/O).
// Çalıştırmak için: https://shipcrewfinder.com/api/admin/broadcast-pro-tools?secret=scf-pro-tools-2026-m7q2
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

  const { data: seafarers } = await supabase
    .from("seafarer_details")
    .select("id, rank")
    .in("rank", [...ENGINE_RANKS, ...DECK_RANKS]);

  if (!seafarers || seafarers.length === 0) {
    return NextResponse.json({ sent: 0, total: 0 });
  }

  const ids = seafarers.map((s) => s.id as string);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", ids);

  const emailById = new Map(
    (profiles || []).map((p) => [p.id as string, p as { email: string | null; full_name: string | null }])
  );

  const engineHtml =
    '<div style="font-family:Arial,sans-serif;max-width:560px">' +
    '<h2 style="color:#0d1030">⚓ New — Oil Record Book Pro</h2>' +
    "<p>Hi,</p>" +
    "<p>We just added something built specifically for your rank: <b>Oil Record Book Pro</b>, right in your ShipCrewFinder dashboard.</p>" +
    "<ul>" +
    "<li>Auto-generates the correct MARPOL Annex I code and item number for every entry — no more guessing</li>" +
    "<li>Covers all 24 official operations (sludge, bilge, bunkering, equipment failure, accidental discharge)</li>" +
    "<li>Exports a clean, signable PDF in one tap</li>" +
    "</ul>" +
    "<p>Stop losing sleep over PSC remarks. Every code, every item number — generated for you, every time.</p>" +
    '<p><a href="https://shipcrewfinder.com/dashboard" style="background:#fbbf24;color:#0b0e13;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">Try it free — no card needed →</a></p>' +
    '<p style="color:#888;font-size:12px;margin-top:18px">You\'re receiving this because you\'re a ShipCrewFinder crew member. This is a one-time announcement about a new feature.</p>' +
    "</div>";

  const deckHtml =
    '<div style="font-family:Arial,sans-serif;max-width:560px">' +
    '<h2 style="color:#0d1030">📐 New — Draft Survey Calculator Pro</h2>' +
    "<p>Hi,</p>" +
    "<p>We just added two tools built specifically for your rank, right in your ShipCrewFinder dashboard:</p>" +
    "<p><b>1) Draft Survey Calculator Pro</b><br/>Never miscalculate cargo again. Enter your vessel's own hydrostatic table once, then get the same verified quadratic-mean formulas real surveyors use — full transparent breakdown, signable report, PDF export.</p>" +
    "<p><b>2) Document Generator Pro</b><br/>NOR, SOF, LOI and 14 Letter of Protest scenarios — filled in and ready to export in minutes.</p>" +
    '<p><a href="https://shipcrewfinder.com/dashboard" style="background:#fbbf24;color:#0b0e13;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">Try both free — no card needed →</a></p>' +
    '<p style="color:#888;font-size:12px;margin-top:18px">You\'re receiving this because you\'re a ShipCrewFinder crew member. This is a one-time announcement about a new feature.</p>' +
    "</div>";

  let sentEngine = 0;
  let sentDeck = 0;
  let skippedNoEmail = 0;

  for (const s of seafarers) {
    const rank = s.rank as string;
    const profile = emailById.get(s.id as string);
    const email = profile?.email;

    if (!email || !resendKey) {
      skippedNoEmail++;
      continue;
    }

    const isEngine = ENGINE_RANKS.includes(rank);
    const isDeck = DECK_RANKS.includes(rank);
    if (!isEngine && !isDeck) continue;

    const subject = isEngine
      ? "New: Oil Record Book Pro is live on your dashboard"
      : "New: Draft Survey Calculator is live on your dashboard";
    const html = isEngine ? engineHtml : deckHtml;
    const text = isEngine
      ? "Oil Record Book Pro is now live on your ShipCrewFinder dashboard. Try it free: https://shipcrewfinder.com/dashboard"
      : "Draft Survey Calculator Pro and Document Generator Pro are now live on your ShipCrewFinder dashboard. Try them free: https://shipcrewfinder.com/dashboard";

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
          subject,
          html,
          text,
        }),
      });
    } catch {
      // Bir üyeye mail gönderilemese bile diğerlerini etkilemesin
      continue;
    }

    if (isEngine) sentEngine++;
    else sentDeck++;
  }

  return NextResponse.json({
    sentEngine,
    sentDeck,
    totalSent: sentEngine + sentDeck,
    skippedNoEmail,
    totalMatched: seafarers.length,
    resendKeyFound: !!resendKey,
  });
}
