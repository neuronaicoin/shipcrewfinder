"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

const OWNER_INBOX = "shipcrewfinder@gmail.com";
const FROM = "ShipCrewFinder <jobs@shipcrewfinder.com>";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const TOOL_LABELS: Record<string, string> = {
  orb: "Oil Record Book Pro — $29.90/year",
  "draft-survey": "Draft Survey Calculator Pro — $29.90/year",
  documents: "Document Generator Pro — $9.90/year",
};

export async function requestToolUpgrade(formData: FormData): Promise<void> {
  const tool = ((formData.get("tool") as string) || "").trim();
  if (!TOOL_LABELS[tool]) {
    redirect("/upgrade?error=1");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: seafarerDetails }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
    supabase.from("seafarer_details").select("rank").eq("id", user.id).maybeSingle(),
  ]);

  const fullName = (profile?.full_name as string) || "Unknown";
  const contactEmail = (profile?.email as string) || user.email || "unknown";
  const rank = (seafarerDetails?.rank as string) || "Unknown rank";
  const priceLabel = TOOL_LABELS[tool];

  try {
    const admin = createAdminClient();
    const { data: secret } = await admin
      .from("app_secrets")
      .select("value")
      .eq("key", "resend_api_key")
      .single();

    if (secret?.value) {
      await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret.value as string}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: [OWNER_INBOX],
          reply_to: contactEmail,
          subject: `⚓ Tool upgrade request: ${fullName} (${rank}) — ${priceLabel}`,
          html: `
<div style="font-family:Arial,sans-serif;max-width:560px">
  <h2 style="color:#0d1030">⚓ New tool upgrade request</h2>
  <p><b>Name:</b> ${fullName}</p>
  <p><b>Rank:</b> ${rank}</p>
  <p><b>Contact email:</b> ${contactEmail}</p>
  <p><b>Tool requested:</b> ${priceLabel}</p>
  <p style="color:#888;font-size:12px;margin-top:18px">Reply to this email to send payment (IBAN/SWIFT) details directly to the member.</p>
</div>`,
          text: `Name: ${fullName}\nRank: ${rank}\nContact: ${contactEmail}\nTool: ${priceLabel}`,
        }),
      });
    }
  } catch {
    // Sessiz geç — kullanıcı yine de "talebiniz alındı" görsün
  }

  redirect("/upgrade?tool=" + tool + "&requested=1");
}
