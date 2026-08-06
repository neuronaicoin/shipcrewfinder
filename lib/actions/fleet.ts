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
    .select("user_type, plan, email")
    .eq("id", user.id)
    .single();

  if (!profile || profile.user_type !== "company") redirect("/dashboard");

  const access = getPlanAccess((profile.plan as string) as never);

  return { supabase, userId: user.id, access, userEmail: (profile.email as string) || "" };
}

async function logAudit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  companyId: string,
  actorEmail: string,
  action: string,
  targetType: string,
  targetId: string | null,
  detail: string
) {
  try {
    await supabase.from("fleet_audit_log").insert({
      company_id: companyId,
      actor_email: actorEmail,
      action,
      target_type: targetType,
      target_id: targetId,
      detail,
    });
  } catch {
    // Log hatası ana işlemi asla bozmasın
  }
}

export async function addVessel(formData: FormData): Promise<void> {
  const { supabase, userId, access, userEmail } = await requireFleetAccess();

  if (access.vesselLimit !== null) {
    const { count } = await supabase
      .from("vessels")
      .select("id", { count: "exact", head: true })
      .eq("company_id", userId);

    if ((count || 0) >= access.vesselLimit) {
      redirect("/fleet?error=limit");
    }
  }

  const name = ((formData.get("name") as string) || "").trim().slice(0, 100);
  const imoNumber = ((formData.get("imoNumber") as string) || "").trim().slice(0, 20);
  const vesselType = ((formData.get("vesselType") as string) || "").trim().slice(0, 60);
  const flag = ((formData.get("flag") as string) || "").trim().slice(0, 60);
  const dwtRaw = (formData.get("dwt") as string) || "";

  if (!name) redirect("/fleet?error=missing");

  const { data: newVessel, error } = await supabase
    .from("vessels")
    .insert({
      company_id: userId,
      name,
      imo_number: imoNumber || null,
      vessel_type: vesselType || null,
      flag: flag || null,
      dwt: dwtRaw ? Number(dwtRaw) : null,
    })
    .select("id")
    .single();

  if (error) redirect("/fleet?error=failed");

  await logAudit(supabase, userId, userEmail, "vessel_added", "vessel", newVessel?.id as string, `Added vessel "${name}"`);

  revalidatePath("/fleet");
  redirect("/fleet?added=1");
}

export async function deleteVessel(formData: FormData): Promise<void> {
  const { supabase, userId, userEmail } = await requireFleetAccess();

  const vesselId = (formData.get("vesselId") as string) || "";
  if (!vesselId) redirect("/fleet");

  await supabase
    .from("vessels")
    .delete()
    .eq("id", vesselId)
    .eq("company_id", userId);

  await logAudit(supabase, userId, userEmail, "vessel_deleted", "vessel", vesselId, "Removed vessel");

  revalidatePath("/fleet");
  redirect("/fleet?deleted=1");
}

export async function addFleetCrew(formData: FormData): Promise<void> {
  const { supabase, userId, userEmail } = await requireFleetAccess();

  const vesselId = (formData.get("vesselId") as string) || "";
  const fullName = ((formData.get("fullName") as string) || "").trim().slice(0, 100);
  const rank = ((formData.get("rank") as string) || "").trim().slice(0, 60);
  const nationality = ((formData.get("nationality") as string) || "").trim().slice(0, 60);
  const joinDate = (formData.get("joinDate") as string) || "";

  if (!vesselId || !fullName) redirect(`/fleet/${vesselId}?error=missing`);

  const { count: currentMax } = await supabase
    .from("fleet_crew")
    .select("id", { count: "exact", head: true })
    .eq("vessel_id", vesselId);

  const { data: newCrew, error } = await supabase
    .from("fleet_crew")
    .insert({
      vessel_id: vesselId,
      company_id: userId,
      full_name: fullName,
      rank: rank || null,
      nationality: nationality || null,
      join_date: joinDate || null,
      status: "active",
      sort_order: currentMax || 0,
    })
    .select("id")
    .single();

  if (error) redirect(`/fleet/${vesselId}?error=failed`);

  await logAudit(supabase, userId, userEmail, "crew_added", "crew", newCrew?.id as string, `Added ${fullName}`);

  revalidatePath(`/fleet/${vesselId}`);
  redirect(`/fleet/${vesselId}?added=1`);
}

export async function deleteFleetCrew(formData: FormData): Promise<void> {
  const { supabase, userId, userEmail } = await requireFleetAccess();

  const crewId = (formData.get("crewId") as string) || "";
  const vesselId = (formData.get("vesselId") as string) || "";
  if (!crewId) redirect("/fleet");

  await supabase
    .from("fleet_crew")
    .delete()
    .eq("id", crewId)
    .eq("company_id", userId);

  await logAudit(supabase, userId, userEmail, "crew_deleted", "crew", crewId, "Removed crew member");

  revalidatePath(`/fleet/${vesselId}`);
  redirect(`/fleet/${vesselId}?deleted=1`);
}

export async function updateFleetCrew(formData: FormData): Promise<void> {
  const { supabase, userId, userEmail } = await requireFleetAccess();

  const crewId = (formData.get("crewId") as string) || "";
  const vesselId = (formData.get("vesselId") as string) || "";
  if (!crewId) redirect("/fleet");

  const fullName = ((formData.get("fullName") as string) || "").trim().slice(0, 100);
  const rank = ((formData.get("rank") as string) || "").trim().slice(0, 60);
  const nationality = ((formData.get("nationality") as string) || "").trim().slice(0, 60);
  const sex = ((formData.get("sex") as string) || "").trim().slice(0, 10);
  const dateOfBirth = (formData.get("dateOfBirth") as string) || "";
  const placeOfBirth = ((formData.get("placeOfBirth") as string) || "").trim().slice(0, 100);
  const placeOfSignOn = ((formData.get("placeOfSignOn") as string) || "").trim().slice(0, 100);
  const passportNumber = ((formData.get("passportNumber") as string) || "").trim().slice(0, 40);
  const passportExpiry = (formData.get("passportExpiry") as string) || "";
  const seamanBookNumber = ((formData.get("seamanBookNumber") as string) || "").trim().slice(0, 40);
  const seamanBookExpiry = (formData.get("seamanBookExpiry") as string) || "";
  const healthReportExpiry = (formData.get("healthReportExpiry") as string) || "";
  const stcwEndorsementExpiry = (formData.get("stcwEndorsementExpiry") as string) || "";
  const visaType = ((formData.get("visaType") as string) || "").trim().slice(0, 60);
  const visaExpiry = (formData.get("visaExpiry") as string) || "";
  const bloodType = ((formData.get("bloodType") as string) || "").trim().slice(0, 10);
  const emergencyContactName = ((formData.get("emergencyContactName") as string) || "").trim().slice(0, 100);
  const emergencyContactPhone = ((formData.get("emergencyContactPhone") as string) || "").trim().slice(0, 40);
  const emergencyContactRelationship = ((formData.get("emergencyContactRelationship") as string) || "").trim().slice(0, 60);
  const joinDate = (formData.get("joinDate") as string) || "";
  const departureDate = (formData.get("departureDate") as string) || "";
  const salaryAmount = (formData.get("salaryAmount") as string) || "";
  const salaryCurrency = ((formData.get("salaryCurrency") as string) || "USD").trim().slice(0, 10);
  const notes = ((formData.get("notes") as string) || "").trim().slice(0, 2000);

  if (!fullName) redirect(`/fleet/${vesselId}/${crewId}?error=missing`);

  const { error } = await supabase
    .from("fleet_crew")
    .update({
      full_name: fullName,
      rank: rank || null,
      nationality: nationality || null,
      sex: sex || null,
      date_of_birth: dateOfBirth || null,
      place_of_birth: placeOfBirth || null,
      place_of_sign_on: placeOfSignOn || null,
      passport_number: passportNumber || null,
      passport_expiry: passportExpiry || null,
      seaman_book_number: seamanBookNumber || null,
      seaman_book_expiry: seamanBookExpiry || null,
      health_report_expiry: healthReportExpiry || null,
      stcw_endorsement_expiry: stcwEndorsementExpiry || null,
      visa_type: visaType || null,
      visa_expiry: visaExpiry || null,
      blood_type: bloodType || null,
      emergency_contact_name: emergencyContactName || null,
      emergency_contact_phone: emergencyContactPhone || null,
      emergency_contact_relationship: emergencyContactRelationship || null,
      join_date: joinDate || null,
      departure_date: departureDate || null,
      salary_amount: salaryAmount ? Number(salaryAmount) : null,
      salary_currency: salaryCurrency || "USD",
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", crewId)
    .eq("company_id", userId);

  if (error) redirect(`/fleet/${vesselId}/${crewId}?error=failed`);

  await logAudit(supabase, userId, userEmail, "crew_updated", "crew", crewId, `Updated ${fullName}`);

  revalidatePath(`/fleet/${vesselId}/${crewId}`);
  redirect(`/fleet/${vesselId}/${crewId}?saved=1`);
}

export async function signOffCrew(formData: FormData): Promise<void> {
  const { supabase, userId, userEmail } = await requireFleetAccess();

  const crewId = (formData.get("crewId") as string) || "";
  const vesselId = (formData.get("vesselId") as string) || "";
  if (!crewId) redirect("/fleet");

  const { error } = await supabase
    .from("fleet_crew")
    .update({
      status: "signed_off",
      departure_date: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    })
    .eq("id", crewId)
    .eq("company_id", userId);

  if (error) redirect(`/fleet/${vesselId}?error=failed`);

  await logAudit(supabase, userId, userEmail, "crew_signed_off", "crew", crewId, "Signed off crew member");

  revalidatePath(`/fleet/${vesselId}`);
  revalidatePath("/fleet");
  redirect(`/fleet/${vesselId}?signedoff=1`);
}
