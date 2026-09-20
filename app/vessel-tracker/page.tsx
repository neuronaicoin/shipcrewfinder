import { createClient } from "@/lib/supabase/server";
import SiteHeader from "@/app/components/site-header";
import VesselTrackerClient from "./vessel-tracker-client";

export const metadata = {
  title: "Plan a Voyage — Sea Route Planner & Live AIS Ship Map | ShipCrewFinder",
  description:
    "Plan a sea-only voyage between any two ports with distance, ETA and fuel consumption, or track any vessel live on the AIS map. Free, no login needed.",
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
