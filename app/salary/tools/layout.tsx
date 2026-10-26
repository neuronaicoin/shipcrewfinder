import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Seafarer Salary Calculator & Comparison | ShipCrewFinder",
  description:
    "Estimate a seafarer's monthly wage by rank, vessel type and years in rank, then compare two ranks side by side. Free salary tools based on 2026 market ranges.",
  path: "/salary/tools",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
