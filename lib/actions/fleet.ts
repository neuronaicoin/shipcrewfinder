export async function moveCrewRow(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireFleetAccess();

  const vesselId = (formData.get("vesselId") as string) || "";
  const crewId = (formData.get("crewId") as string) || "";
  const direction = (formData.get("direction") as string) || "";
  if (!vesselId || !crewId) redirect("/fleet");

  const { data: crewRows } = await supabase
    .from("fleet_crew")
    .select("id, sort_order")
    .eq("vessel_id", vesselId)
    .eq("company_id", userId)
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  const list = crewRows || [];
  const idx = list.findIndex((c) => (c.id as string) === crewId);
  if (idx === -1) redirect(`/fleet/${vesselId}`);

  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= list.length) redirect(`/fleet/${vesselId}`);

  const a = list[idx];
  const b = list[swapWith];

  await supabase
    .from("fleet_crew")
    .update({ sort_order: b.sort_order })
    .eq("id", a.id as string)
    .eq("company_id", userId);

  await supabase
    .from("fleet_crew")
    .update({ sort_order: a.sort_order })
    .eq("id", b.id as string)
    .eq("company_id", userId);

  revalidatePath(`/fleet/${vesselId}`);
  redirect(`/fleet/${vesselId}`);
}
