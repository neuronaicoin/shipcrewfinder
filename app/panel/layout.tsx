import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Admin Panel | ShipCrewFinder",
  noindex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
