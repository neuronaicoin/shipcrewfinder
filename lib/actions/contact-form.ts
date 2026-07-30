"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

// İletişim formu: mesajı Resend üzerinden kurucu postasına iletir.
// Hedef adres SADECE burada (sunucuda) yaşar — sitede asla görünmez.
const CONTACT_INBOX = "shipcrewfinder@gmail.com";
const FROM = "ShipCrewFinder Contact <jobs@shipcrewfinder.com>";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function sendContactMessage(formData: FormData): Promise<void> {
  const name = ((formData.get("name") as string) || "").trim().slice(0, 120);
  const email = ((formData.get("email") as string) || "").trim().slice(0, 200);
  const message = ((formData.get("message") as string) || "").trim().slice(0, 4000);
  // Bal küpü: botlar doldurur, insanlar görmez
  const trap = ((formData.get("company_website") as string) || "").trim();

  if (trap) redirect("/contact?sent=1"); // bot — sessizce "başarılı" göster
  if (!name || !email || !message || !email.includes("@")) {
    redirect("/contact?error=1");
  }

  try {
    const admin = createAdminClient();
    const { data: secret } = await admin
      .from("app_secrets")
      .select("value")
      .eq("key", "resend_api_key")
      .single();

    if (!secret?.value) redirect("/contact?error=1");

    const html = `
<div style="font-family:Arial,sans-serif;max-width:560px">
  <h2 style="color:#0d1030">⚓ New contact message</h2>
  <p><b>Name:</b> ${esc(name)}</p>
  <p><b>Email:</b> ${esc(email)}</p>
  <p><b>Message:</b></p>
  <div style="background:#f4f6fb;border-left:4px solid #fbbf24;padding:12px 16px;white-space:pre-wrap">${esc(message)}</div>
  <p style="color:#888;font-size:12px;margin-top:18px">Sent from shipcrewfinder.com/contact — reply to answer directly.</p>
</div>`;

    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret.value as string}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [CONTACT_INBOX],
        reply_to: email,
        subject: `📬 Contact: ${name}`,
        html,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!res.ok) redirect("/contact?error=1");
  } catch {
    redirect("/contact?error=1");
  }

  redirect("/contact?sent=1");
}
