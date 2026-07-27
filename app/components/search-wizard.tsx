"use client";

import { useState } from "react";
import Link from "next/link";
import { SHIP_RANKS } from "@/lib/constants/ranks";
import { getSortedCountries } from "@/lib/constants/countries";

type Intent = "hire" | "work";

const POPULAR_RANKS = [
  { label: "CHIEF ENGINEER", slug: "chief-engineer" },
  { label: "MASTER", slug: "master" },
  { label: "2ND ENGINEER", slug: "2nd-engineer" },
  { label: "CHIEF OFFICER", slug: "chief-officer" },
  { label: "ETO", slug: "eto" },
  { label: "AB", slug: "ab" },
];

export default function SearchWizard() {
  const [intent, setIntent] = useState<Intent>("hire");
  const crewType = "seafarer";
  const [country, setCountry] = useState("");
  const [rank, setRank] = useState("");
  const [showResult, setShowResult] = useState(false);

  const countries = getSortedCountries();

  const rankGroups = SHIP_RANKS;

  const reset = () => {
    setIntent("hire");
    setCountry("");
    setRank("");
    setShowResult(false);
  };

  const targetUrl = (() => {
    const params = new URLSearchParams();
    if (crewType) params.set("type", crewType);
    if (country) params.set("country", country);
    if (intent === "hire" && rank) params.set("rank", rank);
    const qs = params.toString();
    if (intent === "hire") return `/browse${qs ? `?${qs}` : ""}`;
    return `/jobs${qs ? `?${qs}` : ""}`;
  })();

  const inputStyle = {
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'%3E%3C/path%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 1rem center",
    paddingRight: "2.5rem",
  };

  return (
    <div className="relative">
      {!showResult ? (
        <>
          {/* Canlı arama rozeti */}
          <div className="flex justify-end -mt-1 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE SEARCH
            </span>
          </div>

          {/* Sekmeler: altın = crew · mavi = jobs */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setIntent("hire"); setRank(""); }}
                className={`px-4 py-3.5 rounded-xl text-base font-extrabold transition border-2 ${
                  intent === "hire"
                    ? "bg-accent text-primary border-accent shadow-lg shadow-accent/30"
                    : "bg-transparent border-accent/40 text-accent hover:border-accent hover:bg-accent/10"
                }`}
              >
                ⚓ Search Crew
              </button>
              <button
                type="button"
                onClick={() => { setIntent("work"); setRank(""); }}
                className={`px-4 py-3.5 rounded-xl text-base font-extrabold transition border-2 ${
                  intent === "work"
                    ? "bg-blue-400 text-primary border-blue-400 shadow-lg shadow-blue-400/30"
                    : "bg-transparent border-blue-400/40 text-blue-400 hover:border-blue-400 hover:bg-blue-400/10"
                }`}
              >
                💼 Search Jobs
              </button>
            </div>
          </div>

          {/* Ülke + Rank yan yana */}
          <div className={`mb-4 grid gap-3 ${intent === "hire" ? "sm:grid-cols-2" : "grid-cols-1"}`}>
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={inputStyle}
                className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white text-sm focus:border-accent focus:outline-none appearance-none"
              >
                <option value="">🌍 Any country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            {intent === "hire" && (
              <div>
                <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                  Rank (optional)
                </label>
                <select
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  style={inputStyle}
                  className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white text-sm focus:border-accent focus:outline-none appearance-none"
                >
                  <option value="">Any rank</option>
                  {Object.entries(rankGroups).map(([dept, ranks]) => (
                    <optgroup key={dept} label={dept}>
                      {(ranks as string[]).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowResult(true)}
            className={`w-full px-6 py-4 rounded-xl font-extrabold text-base transition shadow-lg ${
              intent === "hire"
                ? "bg-accent hover:bg-accent-dark text-primary shadow-accent/30 hover:shadow-accent/50"
                : "bg-blue-400 hover:bg-blue-500 text-primary shadow-blue-400/30 hover:shadow-blue-400/50"
            }`}
          >
            {intent === "hire" ? "🔍 Search Crew →" : "🔍 Search Jobs →"}
          </button>

          {/* Popüler rank çipleri — SEO rank sayfalarına gider */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider mr-1">Popular:</span>
            {POPULAR_RANKS.map((r) => (
              <Link key={r.slug} href={`/crew/${r.slug}`} className="text-[10.5px] font-bold text-white/60 border border-white/15 rounded-full px-3 py-1 hover:text-accent hover:border-accent/60 transition">{r.label}</Link>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-2">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
            Sign up to see results
          </h2>
          <p className="text-white/60 text-sm mb-2 max-w-sm mx-auto">
            {intent === "hire"
              ? "Browsing verified crew requires a free account."
              : "Viewing job openings requires a free account."}
          </p>
          <p className="text-white/40 text-xs mb-6">
            Your search: Ship crew
            {country ? ` · ${countries.find((c) => c.code === country)?.name || country}` : ""}
            {rank ? ` · ${rank}` : ""}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={intent === "hire" ? "/signup/company" : "/signup/crew"} className="px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20">Sign Up Free</Link>
            <Link href={`/login?next=${encodeURIComponent(targetUrl)}`} className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10">Login</Link>
          </div>
          <button
            type="button"
            onClick={reset}
            className="mt-5 text-white/40 hover:text-white/60 text-sm transition"
          >
            ← Start over
          </button>
        </div>
      )}
    </div>
  );
}
