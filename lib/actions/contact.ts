"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendConnectRequest(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const seafarerId = formData.get("seafarerId") as string;
  if (!seafarerId) return;

  // Only companies can send requests
  const { data: me } = await supabase
    .from("profiles")
    .select("user_type, full_name")
    .eq("id", user.id)
    .single();

  if (!me || me.user_type !== "company") return;

  // Did the candidate block this company?
  const { data: blocked } = await supabase
    .from("blocked_companies")
    .select("id")
    .eq("user_id", seafarerId)
    .eq("company_id", user.id)
    .maybeSingle();

  if (blocked) return; // silently ignore

  // Already an existing request?
  const { data: existing } = await supabase
    .from("contact_requests")
    .select("id, status")
    .eq("from_company_id", user.id)
    .eq("to_user_id", seafarerId)
    .maybeSingle();

  if (existing) {
    // A request already exists; do nothing (button will show its status)
    revalidatePath(`/candidate/${seafarerId}`);
    return;
  }

  const message = (formData.get("message") as string) || null;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30-day expiry

  // Create the contact request
  const { error: insertError } = await supabase.from("contact_requests").insert({
    from_company_id: user.id,
    to_user_id: seafarerId,
    message: message,
    status: "pending",
    expires_at: expiresAt.toISOString(),
  });

  if (insertError) {
    return;
  }

  // Create an in-app notification for the candidate
  const companyName = me.full_name || "A company";
  await supabase.from("notifications").insert({
    user_id: seafarerId,
    type: "connect_request",
    title: "New connection request",
    message: `${companyName} wants to connect with you.`,
    link: "/requests",
    read: false,
  });

  revalidatePath(`/candidate/${seafarerId}`);
}
