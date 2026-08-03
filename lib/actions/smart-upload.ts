"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const MAX_FILES = 30;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const DAILY_LIMIT = 1;
const MODEL = "claude-haiku-4-5-20251001";
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

type ExtractedDoc = {
  is_document: boolean;
  doc_type: string | null;
  name: string | null;
  expiry_date: string | null;
  holder_rank: string | null;
  holder_nationality: string | null;
};

async function extractFromFile(file: File): Promise<ExtractedDoc | null> {
  try {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const isPdf = file.type === "application/pdf";

    const contentBlock = isPdf
      ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
      : { type: "image", source: { type: "base64", media_type: file.type, data: base64 } };

    const prompt = `You are reading a maritime seafarer's document — a certificate, seaman's book, passport, or medical certificate. The document may be in any language. Respond with ONLY valid JSON, no other text, no markdown, in this exact shape:
{"is_document": true, "doc_type": "specific certificate name such as STCW Basic Safety Training, Medical Certificate, Seaman's Book, Passport, Certificate of Competency, Tanker Endorsement, GMDSS, ENG1", "name": "short display name", "expiry_date": "YYYY-MM-DD or null", "holder_rank": "rank if visible on a seaman's book or COC, else null", "holder_nationality": "nationality or issuing country if visible, else null"}
If the file is not a recognizable maritime or identity document, respond with exactly:
{"is_document": false, "doc_type": null, "name": null, "expiry_date": null, "holder_rank": null, "holder_nationality": null}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        messages: [{ role: "user", content: [contentBlock, { type: "text", text: prompt }] }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = (Array.isArray(data?.content) ? data.content : [])
      .map((b: { text?: string }) => b.text || "")
      .join("")
      .trim();
    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned) as ExtractedDoc;
    if (!parsed || !parsed.is_document) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function smartUploadDocuments(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usageCount } = await supabase.rpc("get_ai_usage_today", {
    uid: user.id,
    act: "smart_upload",
  });
  if (((usageCount as number) || 0) >= DAILY_LIMIT) {
    redirect("/vault?error=ai_limit");
  }

  const rawFiles = formData.getAll("files") as File[];
  const validFiles = rawFiles
    .filter((f) => f && f.size > 0 && f.size <= MAX_FILE_SIZE && ALLOWED_TYPES.includes(f.type))
    .slice(0, MAX_FILES);

  if (validFiles.length === 0) {
    redirect("/vault?error=ai_nofiles");
  }

  let addedCount = 0;
  let rankFound: string | null = null;
  let nationalityFound: string | null = null;

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    const extracted = await extractFromFile(file);
    if (!extracted) continue;

    const ext = file.type === "application/pdf" ? "pdf" : file.type.split("/")[1] || "jpg";
    const fileName = `ai-${user.id}-${Date.now()}-${i}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(fileName, file, { upsert: true, contentType: file.type });

    let fileUrl: string | null = null;
    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("cvs").getPublicUrl(fileName);
      fileUrl = publicUrl;
    }

    const { error: insertError } = await supabase.from("crew_documents").insert({
      user_id: user.id,
      doc_type: extracted.doc_type || "Document",
      name: extracted.name || extracted.doc_type || "Uploaded document",
      expiry_date: extracted.expiry_date || null,
      file_url: fileUrl,
      source: "ai",
    });

    if (!insertError) {
      addedCount++;
      if (extracted.holder_rank && !rankFound) rankFound = extracted.holder_rank;
      if (extracted.holder_nationality && !nationalityFound) nationalityFound = extracted.holder_nationality;
    }
  }

  if (rankFound || nationalityFound) {
    const { data: existing } = await supabase
      .from("seafarer_details")
      .select("rank, nationality")
      .eq("id", user.id)
      .maybeSingle();

    const updates: Record<string, string> = {};
    if (rankFound && !existing?.rank) updates.rank = rankFound;
    if (nationalityFound && !existing?.nationality) updates.nationality = nationalityFound;

    if (Object.keys(updates).length > 0 && existing) {
      await supabase.from("seafarer_details").update(updates).eq("id", user.id);
    }
  }

  await supabase.from("ai_usage_log").insert({ user_id: user.id, action: "smart_upload" });

  revalidatePath("/vault");
  redirect(`/vault?ai_added=${addedCount}`);
}
