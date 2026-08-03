import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeContent from "@/app/components/home-content";
import DeckRail from "@/app/components/deck-rail";
import MessRoomBox from "@/app/components/mess-room-box";
import PopularSearches from "@/app/components/popular-searches";
import LiveActivityStrip from "@/app/components/live-activity-strip";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <HomeContent
      deckSlot={
        <>
          <LiveActivityStrip />
          <DeckRail />
          <MessRoomBox />
          <PopularSearches />
        </>
      }
    />
  );
}
