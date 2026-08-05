"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPlanAccess } from "@/lib/plan-access";

async function requireFleetAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, plan")
    .eq("id", user.id)
    .single();

  if (!profile || profile.user_type !== "company") redirect("/dashboard");

  const access = getPlanAccess((profile.plan as string) as never);
  if (!access.canUseFleetManager) redirect("/fleet");

  return { supabase, userId: user.id };
}

export async function addVessel(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireFleetAccess();

  const name = ((formData.get("name") as string) || "").trim().slice(0, 100);
  const imoNumber = ((formData.get("imoNumber") as string) || "").trim().slice(0, 20);
  const vesselType = ((formData.get("vesselType") as string) || "").trim().slice(0, 60);

  if (!name) redirect("/fleet?error=missing");

  const { error } = await supabase.from("vessels").insert({
    company_id: userId,
    name,
    imo_number: imoNumber || null,
    vessel_type: vesselType || null,
  });

  if (error) redirect("/fleet?error=failed");

  revalidatePath("/fleet");
  redirect("/fleet?added=1");
}

export async function deleteVessel(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireFleetAccess();

  const vesselId = (formData.get("vesselId") as string) || "";
  if (!vesselId) redirect("/fleet");

  await supabase
    .from("vessels")
    .delete()
    .eq("id", vesselId)
    .eq("company_id", userId);

  revalidatePath("/fleet");
  redirect("/fleet?deleted=1");
}

export async function addFleetCrew(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireFleetAccess();

  const vesselId = (formData.get("vesselId") as string) || "";
  const fullName = ((formData.get("fullName") as string) || "").trim().slice(0, 100);
  const rank = ((formData.get("rank") as string) || "").trim().slice(0, 60);
  const nationality = ((formData.get("nationality") as string) || "").trim().slice(0, 60);
  const joinDate = (formData.get("joinDate") as string) || "";

  if (!vesselId || !fullName) redirect(`/fleet/${vesselId}?error=missing`);

  const { error } = await supabase.from("fleet_crew").insert({
    vessel_id: vesselId,
    company_id: userId,
    full_name: fullName,
    rank: rank || null,
    nationality: nationality || null,
    join_date: joinDate || null,
  });

  if (error) redirect(`/fleet/${vesselId}?error=failed`);

  revalidatePath(`/fleet/${vesselId}`);
  redirect(`/fleet/${vesselId}?added=1`);
}

export async function deleteFleetCrew(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireFleetAccess();

  const crewId = (formData.get("crewId") as string) || "";
  const vesselId = (formData.get("vesselId") as string) || "";
  if (!crewId) redirect("/fleet");

  await supabase
    .from("fleet_crew")
    .delete()
    .eq("id", crewId)
    .eq("company_id", userId);

  revalidatePath(`/fleet/${vesselId}`);
  redirect(`/fleet/${vesselId}?deleted=1`);
}
