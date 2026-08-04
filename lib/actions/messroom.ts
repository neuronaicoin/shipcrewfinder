"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const LINK_RE = /(https?:\/\/|www\.|t\.me|wa\.me|bit\.ly|tinyurl|goo\.gl|discord\.gg|telegram|linktr\.ee)/i;
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(\+?\d[\d\s\-().]{7,}\d)/;
const MENTION_RE = /@([a-z0-9-]{3,60})/gi;
const GUEST_DAILY_LIMIT = 3;

// ============================================
// Chat Room'a mesaj gönder (üye veya misafir)
// ============================================
export async function sendMessRoomMessage(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const backTo = ((formData.get("backTo") as string) || "/messroom").trim();
  const safeBack = backTo.startsWith("/") ? backTo : "/messroom";

  const body = ((formData.get("body") as string) || "").trim().slice(0, 300);
  if (!body) redirect(safeBack);

  // Link + mail + telefon engeli (herkes için)
  if (LINK_RE.test(body) || EMAIL_RE.test(body) || PHONE_RE.test(body)) {
    redirect(safeBack + "?mess=link");
  }

  // ── Misafir (giriş yapmamış) akışı ──
  if (!user) {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown";

    const { data: countResult } = await supabase.rpc("check_guest_chat_limit", {
      client_ip: ip,
      daily_limit: GUEST_DAILY_LIMIT,
    });
    const currentCount = (countResult as number) || 0;

    if (currentCount > GUEST_DAILY_LIMIT) {
      redirect(safeBack + "?mess=guestlimit");
    }

    const { error } = await supabase.from("mess_messages").insert({
      user_id: null,
      body: body,
      is_system: false,
      guest_tag: "Guest ⚓",
    });

    if (error) {
      redirect(safeBack + "?mess=failed");
    }

    await supabase.rpc("purge_mess_messages");
    revalidatePath("/");
    revalidatePath("/messroom");
    redirect(safeBack + "?mess=sent");
  }

  // ── Üye akışı (mevcut, değişmedi) ──
  // 10 saniye hız freni (kişi başına)
  const { data: lastMsg } = await supabase
    .from("mess_messages")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastMsg && Date.now() - new Date(lastMsg.created_at as string).getTime() < 10000) {
    redirect(safeBack + "?mess=slow");
  }

  const { error } = await supabase.from("mess_messages").insert({
    user_id: user.id,
    body: body,
  });

  if (error) {
    redirect(safeBack + "?mess=failed");
  }

  // @mention → uygulama içi bildirim (en fazla 3 kişi)
  const mentions = [...body.matchAll(MENTION_RE)].map((m) => m[1].toLowerCase()).slice(0, 3);
  if (mentions.length > 0) {
    const { data: mentioned } = await supabase
      .from("profiles")
      .select("id, handle")
      .in("handle", mentions);

    const senderName = await (async () => {
      const { data: p } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      return ((p?.full_name as string) || "A member").split(" ")[0];
    })();

    for (const m of mentioned || []) {
      if ((m.id as string) === user.id) continue;
      await supabase.from("notifications").insert({
        user_id: m.id as string,
        type: "mention",
        title: "⚓ " + senderName + " mentioned you in the Chat Room",
        message: body.slice(0, 90),
        link: "/messroom",
        read: false,
      });
    }
  }

  // 24 saati geçenleri temizle (sessiz)
  await supabase.rpc("purge_mess_messages");

  revalidatePath("/");
  revalidatePath("/messroom");
  redirect(safeBack + "?mess=sent");
}
