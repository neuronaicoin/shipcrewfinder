import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeContent from "@/app/components/home-content";
import DeckRail from "@/app/components/deck-rail";
import MessRoomBox from "@/app/components/mess-room-box";
import PopularSearches from "@/app/components/popular-searches";
import LiveActivityStrip from "@/app/components/live-activity-strip";
import AiProfilePromo from "@/app/components/ai-profile-promo";
import VesselTrackerPromo from "@/app/components/vessel-tracker-promo";
import { pageMeta, jsonLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: "ShipCrewFinder — Global Maritime Career Platform",
  description:
    "Verified seafarers and shipping companies, connected directly. Jobs, CV builder, sea time tracker, live crew chat — 0% commission, ever.",
  path: "/",
});

// Mirrors the visible FAQ section in home-content.tsx (#faq). Keep both in sync.
const HOME_FAQS: [string, string][] = [
  ["Is the first month really free for companies?", "Yes — companies get a full month with all Pro/Fleet features unlocked, no charge. Cancel any time during the free month and you pay nothing at all. Crew membership works differently — it's free forever, not just for a trial month (see below)."],
  ["Is crew membership really free — no hidden cost later?", "Yes. Right now, while we build the crew pool, every feature is free for seafarers — no trial period, no card required, no surprise charge. We may introduce paid tiers in the future once the platform has scaled, but any account created now keeps its free access."],
  ["How does profile verification work?", "After you upload your CV and certificates (STCW, COC, medical), our team manually reviews the documents before your profile goes live. Verified profiles carry a visible badge that companies can trust."],
  ["Can my current employer see that I'm looking?", "Not if you don't want them to. Stealth Mode hides your profile from specific companies you choose — including your current employer. You stay invisible to them while staying visible to everyone else."],
  ["Do you take any commission from my salary or the placement?", "Never. Zero commission, from either side, ever. Companies pay a flat subscription; crew pay nothing at all. Your salary is between you and your employer — as it should be."],
  ["How do companies contact crew?", "Directly, through the platform's messaging. No agency relaying messages, no delays, no filtering. You negotiate your own contract, face to face."],
  ["Can I cancel anytime?", "Yes — one click, no questions, no retention calls. If you cancel during a free month you pay nothing; if you cancel later, your access simply runs to the end of the paid period."],
];

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeFaqSchema) }} />
    <HomeContent
      topSlot={<VesselTrackerPromo />}
      deckSlot={
        <>
          <DeckRail />
          <AiProfilePromo />
          <LiveActivityStrip />
          <MessRoomBox messStatus={sp.mess} />
          <PopularSearches />
        </>
      }
    />
    </>
  );
}
