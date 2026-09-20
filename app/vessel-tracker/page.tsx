import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/app/components/site-header";
import VesselTrackerClient from "./vessel-tracker-client";

export const metadata = {
  title: "Vessel Tracker — Live AIS Ship Map | ShipCrewFinder",
  description:
    "Search any vessel by name and see its live position on a real-time AIS map. Free vessel tracking on ShipCrewFinder.",
};

export default async function VesselTrackerPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  return (
    <>
      <SiteHeader isLoggedIn={!!user} active={null} />
      <VesselTrackerClient />
    </>
  );
}
