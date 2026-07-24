import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "ShipCrewFinder <alerts@shipcrewfinder.com>";
const WINDOWS = [90, 30, 7];

function dateKey(daysFromNow: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  const admin = createAdminClient();

  // Cron anahtarı kontrolü (app_secrets tablosundan)
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

  const report: string[] = [];

  for (const days of WINDOWS) {
    const target = dateKey(days);

    const { data: docs, error } = await admin
      .from("crew_documents")
      .select("id, user_id, doc_type, name, expiry_date")
      .eq("expiry_date", target);

    if (error) {
      report.push(`w${days}:ERR=${error.message}`);
      continue;
    }
    if (!docs || docs.length === 0) {
      report.push(`w${days}:0`);
      continue;
    }

    let sent = 0;
    for (const doc of docs) {
      // Kullanıcının e-postası
      const { data: prof } = await admin
        .from("profiles")
        .select("email, full_name")
        .eq("id", doc.user_id as string)
        .single();
      const email = (prof?.email as string) || "";
      const firstName = ((prof?.full_name as string) || "there").split(" ")[0];

      const subject =
        days === 7
          ? "⚠️ " + doc.name + " expires in 7 days"
          : doc.name + " expires in " + days + " days";

      const text =
        "Hi " + firstName + ",\n\n" +
        "Your document \"" + doc.name + "\" (" + doc.doc_type + ") expires on " +
        doc.expiry_date + " — that's " + days + " days from now.\n\n" +
        "Renewals can take weeks. Start early so it never costs you a contract.\n\n" +
        "Manage your documents: https://shipcrewfinder.com/vault\n\n" +
        "— ShipCrewFinder Document Vault";

      const html =
        "<div style=\"font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#0d1030;color:#eef4fa;border-radius:14px\">" +
        "<h2 style=\"color:#fbbf24;margin:0 0 14px\">" + (days === 7 ? "⚠️ " : "⏳ ") + "Document expiry reminder</h2>" +
        "<p style=\"line-height:1.6;margin:0 0 12px\">Hi " + firstName + ",</p>" +
        "<p style=\"line-height:1.6;margin:0 0 12px\"><b style=\"color:#fbbf24\">" + doc.name + "</b> (" + doc.doc_type + ") expires on <b>" + doc.expiry_date + "</b> — <b>" + days + " days</b> from now.</p>" +
        "<p style=\"line-height:1.6;margin:0 0 18px;color:#a8bdd2\">Renewals can take weeks. Start early so it never costs you a contract.</p>" +
        "<a href=\"https://shipcrewfinder.com/vault\" style=\"display:inline-block;background:#fbbf24;color:#0b0e13;font-weight:bold;padding:12px 22px;border-radius:10px;text-decoration:none\">Open Document Vault →</a>" +
        "<p style=\"font-size:12px;color:#6b83a0;margin:20px 0 0\">— ShipCrewFinder Document Vault</p>" +
        "</div>";

      // E-posta (Resend)
      if (resendKey && email) {
        try {
          await fetch(RESEND_ENDPOINT, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + resendKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ from: FROM, to: [email], subject, text, html }),
          });
          sent++;
        } catch {
          // sessiz geç — bildirim yine de yazılır
        }
      }

      // Uygulama içi zil bildirimi
      await admin.from("notifications").insert({
        user_id: doc.user_id as string,
        type: "doc_expiry",
        title: subject,
        message: doc.doc_type + " · expires " + doc.expiry_date,
        link: "/vault",
        read: false,
      });
    }

    report.push(`w${days}:${docs.length} docs, ${sent} mails`);
  }

  return NextResponse.json({ ok: true, report });
}
