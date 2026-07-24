"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type RateResult = {
  ok: boolean;
  error?: string;
  nextAllowed?: string;
};

const COOLDOWN_DAYS = 90;   // aynı şirketi 3 ayda bir
const YEARLY_LIMIT = 5;     // son 365 günde en fazla 5 farklı şirket

export async function rateCompany(
  companyId: string,
  rating: number
): Promise<RateResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please log in to rate." };

  if (!companyId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Invalid rating." };
  }

  // Sadece crew oylayabilir
  const { data: me } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!me || !["seafarer", "yacht"].includes(me.user_type as string)) {
    return { ok: false, error: "Only crew members can rate companies." };
  }
  if (user.id === companyId) {
    return { ok: false, error: "Invalid rating." };
  }

  const now = Date.now();
  const dayMs = 24 * 3600 * 1000;

  // Bu şirkete daha önce oy vermiş mi? (3 ay kuralı)
  const { data: existing } = await supabase
    .from("company_ratings")
    .select("id, updated_at")
    .eq("company_id", companyId)
    .eq("crew_id", user.id)
    .maybeSingle();

  if (existing) {
    const last = new Date(existing.updated_at as string).getTime();
    const daysSince = (now - last) / dayMs;
    if (daysSince < COOLDOWN_DAYS) {
      const nextDate = new Date(last + COOLDOWN_DAYS * dayMs);
      return {
        ok: false,
        error: "You can update this rating after " +
          nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ".",
        nextAllowed: nextDate.toISOString(),
      };
    }

    const { error } = await supabase
      .from("company_ratings")
      .update({ rating, updated_at: new Date().toISOString() })
      .eq("id", existing.id as string)
      .eq("crew_id", user.id);

    if (error) return { ok: false, error: "Something went wrong. Try again." };
    revalidatePath("/jobs");
    return { ok: true };
  }

  // Yeni şirket oyu → yıllık 5 şirket limiti (son 365 gün)
  const yearAgo = new Date(now - 365 * dayMs).toISOString();
  const { count } = await supabase
    .from("company_ratings")
    .select("id", { count: "exact", head: true })
    .eq("crew_id", user.id)
    .gte("created_at", yearAgo);

  if ((count || 0) >= YEARLY_LIMIT) {
    return {
      ok: false,
      error: "Yearly rating limit reached (" + YEARLY_LIMIT + " companies per year).",
    };
  }

  const { error } = await supabase.from("company_ratings").insert({
    company_id: companyId,
    crew_id: user.id,
    rating,
  });

  if (error) return { ok: false, error: "Something went wrong. Try again." };
  revalidatePath("/jobs");
  return { ok: true };
}
