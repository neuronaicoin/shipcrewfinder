"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ============================================
// Kontrat ekle
// ============================================
export async function addSeaContract(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const vesselName = ((formData.get("vesselName") as string) || "").trim();
  const vesselType = (formData.get("vesselType") as string) || "";
  const dwtRaw = (formData.get("dwt") as string) || "";
  const mainEngine = ((formData.get("mainEngine") as string) || "").trim();
  const rank = (formData.get("rank") as string) || "";
  const signOn = (formData.get("signOn") as string) || "";
  const signOff = (formData.get("signOff") as string) || "";

  if (!vesselName || !vesselType || !rank || !signOn || !signOff) {
    redirect("/seatime?error=missing");
  }

  if (new Date(signOff) <= new Date(signOn)) {
    redirect("/seatime?error=dates");
  }

  const dwt = dwtRaw ? parseInt(dwtRaw.replace(/[^\d]/g, ""), 10) || null : null;

  const { error } = await supabase.from("sea_contracts").insert({
    user_id: user.id,
    vessel_name: vesselName,
    vessel_type: vesselType,
    dwt: dwt,
    main_engine: mainEngine || null,
    rank: rank,
    sign_on: signOn,
    sign_off: signOff,
  });

  if (error) {
    redirect("/seatime?error=failed");
  }

  revalidatePath("/seatime");
  revalidatePath("/cv");
  redirect("/seatime?added=1");
}

// ============================================
// Kontrat sil
// ============================================
export async function deleteSeaContract(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const contractId = (formData.get("contractId") as string) || "";
  if (!contractId) redirect("/seatime");

  await supabase
    .from("sea_contracts")
    .delete()
    .eq("id", contractId)
    .eq("user_id", user.id);

  revalidatePath("/seatime");
  revalidatePath("/cv");
  redirect("/seatime?deleted=1");
}
