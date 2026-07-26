import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeContent from "@/app/components/home-content";
import DeckRail from "@/app/components/deck-rail";
import MessRoomBox from "@/app/components/mess-room-box";

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
          <DeckRail />
          <MessRoomBox />
        </>
      }
    />
  );
}
