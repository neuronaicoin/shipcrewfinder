import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Log In | ShipCrewFinder",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
