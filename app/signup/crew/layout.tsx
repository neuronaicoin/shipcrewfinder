import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Join as Crew: Free Seafarer Profile | ShipCrewFinder",
  description:
    "Create a free verified seafarer profile on ShipCrewFinder. Get found by shipping companies, apply to jobs directly and keep sea time and certificates in order.",
  path: "/signup/crew",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
