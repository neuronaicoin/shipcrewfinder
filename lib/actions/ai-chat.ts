"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

const MODEL = "claude-haiku-4-5-20251001";
const AUTH_DAILY_LIMIT = 25;
const ANON_DAILY_LIMIT = 12;

export type ChatTurn = { role: "user" | "assistant"; text: string };
export type ChatResult = {
  reply: string;
  suggestAction: "signup" | "login" | "none";
  limited: boolean;
};

const SYSTEM_PROMPT = `You are the ShipCrewFinder AI assistant, embedded on the ShipCrewFinder homepage. ShipCrewFinder is a verified global maritime career platform connecting seafarers and shipping companies directly.

Key facts about the platform:
- 0% commission, ever, on either side — crew and companies pay a flat subscription, never a cut of wages or a placement fee
- Crew: free to join, first month free, then $4.99 per 3 months. Build a maritime CV, track sea time and certificates with expiry alerts, get found by verified companies, message them directly
- Companies: free first month, then Pro $299.90/month (100 CV views/month, post jobs, message crew) or Fleet $499.90/month (unlimited)
- Every crew profile is document-verified before it becomes visible to companies
- Features: CV builder, Document Vault with expiry alerts, Salary Index (2026 wages by rank and vessel type), The Mess Room (live 24/7 crew chat), Job board, Smart AI document upload (upload certificates as photos or PDF, AI reads them and fills your profile automatically)
- Not a crewing agency — no intermediary in the employment relationship, direct contact only
- Compliant with MLC 2006: no fee is ever charged to a seafarer for being hired

Your job:
- Answer questions helpfully, accurately, and briefly — 2 to 4 sentences unless more detail is genuinely needed
- ALWAYS reply in the same language the user just wrote in, no matter what language — if they write in Turkish, reply in Turkish; Russian, reply in Russian; Hindi, reply in Hindi; and so on for any language
- If the user seems ready to sign up or is asking how to join, how to get hired, or similar — set suggestAction to "signup"
- If the user mentions they already have an account or asks how to log in — set suggestAction to "login"
- Otherwise set suggestAction to "none"
- Never invent facts not listed above. If you don't know something specific (like exact current job listings), say so honestly and point to the relevant page instead of guessing
- Never discuss unrelated topics — politely redirect to maritime careers and the platform if asked something off-topic

Respond with ONLY valid JSON, no markdown, no extra text, in this exact shape:
{"reply": "your response text here", "suggestAction": "signup" | "login" | "none"}`;

export async function sendChatMessage(
  history: ChatTurn[],
  message: string
): Promise<ChatResult> {
  const trimmed = (message || "").trim().slice(0, 800);
  if (!trimmed) {
    return { reply: "", suggestAction: "none", limited: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Hız sınırı: giriş yapmış kullanıcı hesap bazlı, ziyaretçi IP bazlı
  if (user) {
    const { data: usageCount } = await supabase.rpc("get_ai_usage_today", {
      uid: user.id,
      act: "chat",
    });
    if (((usageCount as number) || 0) >= AUTH_DAILY_LIMIT) {
      return {
        reply: "You've reached today's chat limit — try again tomorrow.",
        suggestAction: "none",
        limited: true,
      };
    }
  } else {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "unknown";
    const { data: allowed } = await supabase.rpc("check_anon_chat_limit", {
      client_ip: ip,
      daily_limit: ANON_DAILY_LIMIT,
    });
    if (allowed === false) {
      return {
        reply: "You've reached today's chat limit — sign up free for unlimited access.",
        suggestAction: "signup",
        limited: true,
      };
    }
  }

  const recentHistory = history.slice(-6);
  const messages = [
    ...recentHistory.map((h) => ({
      role: h.role,
      content: h.text,
    })),
    { role: "user", content: trimmed },
  ];

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!res.ok) {
      return {
        reply: "Something went wrong on our side — please try again in a moment.",
        suggestAction: "none",
        limited: false,
      };
    }

    const data = await res.json();
    const text = (Array.isArray(data?.content) ? data.content : [])
      .map((b: { text?: string }) => b.text || "")
      .join("")
      .trim();
    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned) as { reply: string; suggestAction: string };
    const action =
      parsed.suggestAction === "signup" || parsed.suggestAction === "login"
        ? parsed.suggestAction
        : "none";

    if (user) {
      await supabase.from("ai_usage_log").insert({ user_id: user.id, action: "chat" });
    }

    return {
      reply: parsed.reply || "Sorry, I didn't quite catch that — could you rephrase?",
      suggestAction: user && action === "signup" ? "none" : (action as "signup" | "login" | "none"),
      limited: false,
    };
  } catch {
    return {
      reply: "Something went wrong on our side — please try again in a moment.",
      suggestAction: "none",
      limited: false,
    };
  }
}
