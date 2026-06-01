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

  const { data: me } = await supabase
    .from("profiles")
    .select("user_type, full_name")
    .eq("id", user.id)
    .single();

  if (!me || me.user_type !== "company") return;

  const { data: blocked } = await supabase
    .from("blocked_companies")
    .select("id")
    .eq("user_id", seafarerId)
    .eq("company_id", user.id)
    .maybeSingle();

  if (blocked) return;

  const { data: existing } = await supabase
    .from("contact_requests")
    .select("id, status")
    .eq("from_company_id", user.id)
    .eq("to_user_id", seafarerId)
    .maybeSingle();

  if (existing) {
    revalidatePath(`/candidate/${seafarerId}`);
    return;
  }

  const message = (formData.get("message") as string) || null;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

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

// ============================================
// CREW: Accept a contact request
// ============================================
export async function acceptRequest(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const requestId = formData.get("requestId") as string;
  if (!requestId) return;

  // Fetch the request and verify ownership
  const { data: req } = await supabase
    .from("contact_requests")
    .select("id, from_company_id, to_user_id")
    .eq("id", requestId)
    .single();

  if (!req || req.to_user_id !== user.id) return;

  await supabase
    .from("contact_requests")
    .update({
      status: "accepted",
      responded_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  // Notify the company
  const { data: me } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const name = me?.full_name || "A candidate";
  await supabase.from("notifications").insert({
    user_id: req.from_company_id,
    type: "request_accepted",
    title: "Connection request accepted",
    message: `${name} accepted your connection request. You can now view their full profile.`,
    link: `/candidate/${user.id}`,
    read: false,
  });

  revalidatePath("/requests");
}

// ============================================
// CREW: Reject a contact request
// ============================================
export async function rejectRequest(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const requestId = formData.get("requestId") as string;
  if (!requestId) return;

  const { data: req } = await supabase
    .from("contact_requests")
    .select("id, to_user_id")
    .eq("id", requestId)
    .single();

  if (!req || req.to_user_id !== user.id) return;

  await supabase
    .from("contact_requests")
    .update({
      status: "rejected",
      responded_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  revalidatePath("/requests");
}

// ============================================
// CREW: Block a company (hide from this company)
// ============================================
export async function blockCompany(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const companyId = formData.get("companyId") as string;
  if (!companyId) return;

  // Add to blocked_companies (ignore if already blocked)
  await supabase.from("blocked_companies").upsert(
    {
      user_id: user.id,
      company_id: companyId,
    },
    { onConflict: "user_id,company_id" }
  );

  revalidatePath("/requests");
}
