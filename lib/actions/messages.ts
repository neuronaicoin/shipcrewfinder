"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// İki kullanıcı id'sini sabit sıraya koy (p1 < p2)
const orderPair = (a: string, b: string): [string, string] =>
  a < b ? [a, b] : [b, a];

// Link + mail engeli (DB constraint'in kod tarafı — kullanıcıya kibar hata için)
const LINK_RE = /(https?:\/\/|www\.|t\.me|wa\.me|bit\.ly|tinyurl|goo\.gl|discord\.gg|telegram|linktr\.ee)/i;
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

const isBlocked = (text: string) => LINK_RE.test(text) || EMAIL_RE.test(text);

// ============================================
// Konuşma başlat (varsa mevcut olana git)
// ============================================
export async function startConversation(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const toUserId = ((formData.get("toUserId") as string) || "").trim();
  const firstMessage = ((formData.get("body") as string) || "").trim().slice(0, 2000);

  if (!toUserId || toUserId === user.id) redirect("/messages");

  const { data: target } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", toUserId)
    .maybeSingle();
  if (!target) redirect("/messages?err=notfound");

  const [p1, p2] = orderPair(user.id, toUserId);

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("p1", p1)
    .eq("p2", p2)
    .maybeSingle();

  let convId = existing?.id as string | undefined;

  if (!convId) {
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({ p1, p2 })
      .select("id")
      .single();
    if (error || !created) redirect("/messages?err=failed");
    convId = created.id as string;
  }

  if (firstMessage) {
    if (isBlocked(firstMessage)) {
      redirect("/messages/" + convId + "?err=link");
    }
    const { error: msgErr } = await supabase.from("messages").insert({
      conversation_id: convId,
      sender_id: user.id,
      body: firstMessage,
    });
    if (!msgErr) {
      await supabase
        .from("conversations")
        .update({
          last_message_at: new Date().toISOString(),
          last_message_preview: firstMessage.slice(0, 80),
        })
        .eq("id", convId);

      await supabase.from("notifications").insert({
        user_id: toUserId,
        type: "message",
        title: "💬 New message",
        message: firstMessage.slice(0, 90),
        link: "/messages/" + convId,
        read: false,
      });
    }
  }

  // 24 saati geçenleri temizle (sessiz)
  await supabase.rpc("purge_old_messages");

  revalidatePath("/messages");
  redirect("/messages/" + convId);
}

// ============================================
// Mesaj gönder
// ============================================
export async function sendMessage(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const convId = ((formData.get("conversationId") as string) || "").trim();
  const body = ((formData.get("body") as string) || "").trim().slice(0, 2000);

  if (!convId) redirect("/messages");
  if (!body) redirect("/messages/" + convId);

  if (isBlocked(body)) {
    redirect("/messages/" + convId + "?err=link");
  }

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, p1, p2")
    .eq("id", convId)
    .maybeSingle();

  if (!conv || (conv.p1 !== user.id && conv.p2 !== user.id)) {
    redirect("/messages");
  }

  const otherId = conv.p1 === user.id ? (conv.p2 as string) : (conv.p1 as string);

  const { error } = await supabase.from("messages").insert({
    conversation_id: convId,
    sender_id: user.id,
    body: body,
  });

  if (!error) {
    await supabase
      .from("conversations")
      .update({
        last_message_at: new Date().toISOString(),
        last_message_preview: body.slice(0, 80),
      })
      .eq("id", convId);

    await supabase.from("notifications").insert({
      user_id: otherId,
      type: "message",
      title: "💬 New message",
      message: body.slice(0, 90),
      link: "/messages/" + convId,
      read: false,
    });
  }

  // 24 saati geçenleri temizle (sessiz)
  await supabase.rpc("purge_old_messages");

  revalidatePath("/messages/" + convId);
  redirect("/messages/" + convId);
}

// ============================================
// Konuşmayı okundu işaretle
// ============================================
export async function markConversationRead(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const convId = ((formData.get("conversationId") as string) || "").trim();
  if (!convId) return;

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", convId)
    .neq("sender_id", user.id)
    .is("read_at", null);

  revalidatePath("/messages");
}
