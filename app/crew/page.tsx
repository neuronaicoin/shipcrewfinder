import Link from "next/link";
import { SHIP_RANKS } from "@/lib/constants/ranks";

export const metadata = {
  title: "Ship Crew Jobs by Rank — Master to Wiper | ShipCrewFinder",
  description: "Browse maritime jobs and verified crew by rank: Master, Chief Officer, Chief Engineer, ETO, Bosun, AB, Cook and more. Direct contracts, 0% commission.",
  alternates: { canonical: "https://shipcrewfinder.com/crew" },
};

const slugify = (r: string) => r.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const prettify = (r: string) =>
  r.includes("/") || r.length <= 3
    ? r.toUpperCase()
    : r.split(" ").map((w) => (w.length <= 3 && w === w.toUpperCase() && !/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join(" ");

export default function CrewHubPage() {
  return (
    <main className="min-h-screen bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
      <header className="relative border-b border-white/10 backdrop-blur-md bg-primary/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-primary font-display font-extrabold">⚓</span>
            <span className="text-white font-display font-bold text-lg tracking-tight">Ship<span className="text-accent">Crew</span>Finder</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition">Login</Link>
            <Link href="/signup" className="px-4 py-2 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Ship crew jobs, by rank</h1>
        <p className="text-white/70 text-lg mb-10 max-w-2xl">Pick your rank to see open positions, verified profiles and how ShipCrewFinder works for you — direct contact, 0% commission.</p>

        {Object.entries(SHIP_RANKS).map(([dept, ranks]) => (
          <div key={dept} className="mb-8">
            <h2 className="font-display text-lg font-bold text-accent mb-3 uppercase tracking-wider text-sm">{dept}</h2>
            <div className="flex flex-wrap gap-2">
              {(ranks as string[]).map((r) => (
                <Link key={r} href={`/crew/${slugify(r)}`}
                  className="px-4 py-2.5 bg-primary-dark border border-white/10 hover:border-accent/60 rounded-xl text-white/80 hover:text-white text-sm font-semibold transition">
                  {prettify(r)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
