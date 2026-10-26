import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Hire Crew Directly: Company Sign Up | ShipCrewFinder",
  description:
    "Register your shipping company on ShipCrewFinder to search verified seafarers by rank and experience, post jobs and message crew directly. No agency fees.",
  path: "/signup/company",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
