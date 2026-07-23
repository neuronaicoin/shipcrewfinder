"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitState = { ok: boolean; error?: string };

export async function submitSalary(
  _prev: SubmitState | null,
  formData: FormData
): Promise<SubmitState> {
  const trap = (formData.get("website") as string) || "";
  if (trap) return { ok: true };

  const rank = ((formData.get("rank") as string) || "").trim();
  const vessel = ((formData.get("vessel") as string) || "").trim();
  const wageRaw = ((formData.get("wage") as string) || "").trim();
  const years = ((formData.get("years") as string) || "").trim() || null;

  const wage = parseInt(wageRaw, 10);

  if (!rank || !vessel) {
    return { ok: false, error: "Please select your rank and vessel type." };
  }
  if (!Number.isFinite(wage) || wage < 100 || wage > 50000) {
    return { ok: false, error: "Please enter a realistic monthly wage in USD." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("salary_submissions").insert({
    rank,
    vessel_type: vessel,
    monthly_wage: wage,
    years_in_rank: years,
  });

  if (error) {
    return { ok: false, error: "Could not save right now. Please try again." };
  }

  return { ok: true };
}
