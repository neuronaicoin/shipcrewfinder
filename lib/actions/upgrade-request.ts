"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

const OWNER_INBOX = "shipcrewfinder@gmail.com";
const FROM = "ShipCrewFinder <jobs@shipcrewfinder.com>";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function requestUpgrade(formData: FormData): Promise<void> {
  const plan = ((formData.get("plan") as string) || "").trim();
  if (plan !== "pro" && plan !== "fleet") {
    redirect("/upgrade?error=1");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: companyDetails }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
    supabase.from("company_details").select("company_name").eq("id", user.id).maybeSingle(),
  ]);

  const companyName = (companyDetails?.company_name as string) || (profile?.full_name as string) || "Unknown company";
  const contactEmail = (profile?.email as string) || user.email || "unknown";
  const priceLabel = plan === "fleet" ? "Fleet — $499.90/month" : "Pro — $299.90/month";

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
          subject: `💳 Upgrade request: ${companyName} — ${priceLabel}`,
          html: `
<div style="font-family:Arial,sans-serif;max-width:560px">
  <h2 style="color:#0d1030">⚓ New upgrade request</h2>
  <p><b>Company:</b> ${companyName}</p>
  <p><b>Contact email:</b> ${contactEmail}</p>
  <p><b>Plan requested:</b> ${priceLabel}</p>
  <p style="color:#888;font-size:12px;margin-top:18px">Reply to this email to send payment (IBAN/SWIFT) details directly to the company.</p>
</div>`,
          text: `Company: ${companyName}\nContact: ${contactEmail}\nPlan: ${priceLabel}`,
        }),
      });
    }
  } catch {
    // Sessiz geç — kullanıcı yine de "talebiniz alındı" görsün
  }

  redirect("/upgrade?requested=" + plan);
}
