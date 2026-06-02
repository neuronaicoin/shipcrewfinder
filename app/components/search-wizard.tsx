"use client";

import { useState } from "react";
import Link from "next/link";
import { SHIP_RANKS, YACHT_POSITIONS } from "@/lib/constants/ranks";
import { getSortedCountries } from "@/lib/constants/countries";

type Intent = "hire" | "work" | null;
type CrewType = "seafarer" | "yacht" | null;

export default function SearchWizard() {
  const [intent, setIntent] = useState<Intent>(null);
  const [crewType, setCrewType] = useState<CrewType>(null);
  const [country, setCountry] = useState("");
  const [rank, setRank] = useState("");
  const [showResult, setShowResult] = useState(false);

  const countries = getSortedCountries();

  const rankGroups =
    crewType === "yacht" ? YACHT_POSITIONS : SHIP_RANKS;

  const reset = () => {
    setIntent(null);
    setCrewType(null);
    setCountry("");
    setRank("");
    setShowResult(false);
  };

  // Build the target URL (used after signup)
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
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 1rem center",
    paddingRight: "2.5rem",
  };

  // Step indicators
  const canPickCrewType = intent !== null;
  const canPickCountry = crewType !== null;
  const canSearch = intent !== null && crewType !== null;

  return (
    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-2 border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 backdrop-blur-sm">
      {!showResult ? (
        <>
          <div className="mb-5">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
              Find what you need
            </h2>
            <p className="text-white/50 text-sm">
              Search crew or job openings in a few clicks.
            </p>
          </div>

          {/* Step 1 — Intent */}
          <div className="mb-4">
            <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
              1 · I want to
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setIntent("hire"); setCrewType(null); setRank(""); }}
                className={`px-4 py-3 rounded-lg text-sm font-bold transition border ${
                  intent === "hire"
                    ? "bg-accent text-primary border-accent"
                    : "bg-primary border-white/15 text-white/80 hover:border-white/30"
                }`}
              >
                Hire Crew
              </button>
              <button
                type="button"
                onClick={() => { setIntent("work"); setCrewType(null); setRank(""); }}
                className={`px-4 py-3 rounded-lg text-sm font-bold transition border ${
                  intent === "work"
                    ? "bg-accent text-primary border-accent"
                    : "bg-primary border-white/15 text-white/80 hover:border-white/30"
                }`}
              >
                Find Work
              </button>
            </div>
          </div>

          {/* Step 2 — Crew type */}
          {canPickCrewType && (
            <div className="mb-4">
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                2 · Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setCrewType("seafarer"); setRank(""); }}
                  className={`px-4 py-3 rounded-lg text-sm font-bold transition border ${
                    crewType === "seafarer"
                      ? "bg-accent text-primary border-accent"
                      : "bg-primary border-white/15 text-white/80 hover:border-white/30"
                  }`}
                >
                  Ship Crew
                </button>
                <button
                  type="button"
                  onClick={() => { setCrewType("yacht"); setRank(""); }}
                  className={`px-4 py-3 rounded-lg text-sm font-bold transition border ${
                    crewType === "yacht"
                      ? "bg-accent text-primary border-accent"
                      : "bg-primary border-white/15 text-white/80 hover:border-white/30"
                  }`}
                >
                  Yacht Crew
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Country */}
          {canPickCountry && (
            <div className="mb-4">
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                3 · Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={inputStyle}
                className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white text-sm focus:border-accent focus:outline-none appearance-none"
              >
                <option value="">Any country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Step 4 — Rank (only when hiring) */}
          {canPickCountry && intent === "hire" && (
            <div className="mb-5">
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                4 · Rank (optional)
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

          <button
            type="button"
            disabled={!canSearch}
            onClick={() => setShowResult(true)}
            className={`w-full px-6 py-3.5 rounded-lg font-bold transition ${
              canSearch
                ? "bg-accent hover:bg-accent-dark text-primary shadow-lg shadow-accent/20"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            }`}
          >
            Search
          </button>
        </>
      ) : (
        /* Result — membership required */
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
            Your search: {intent === "hire" ? "Hiring" : "Looking for"}{" "}
            {crewType === "yacht" ? "yacht crew" : "ship crew"}
            {country ? ` · ${countries.find((c) => c.code === country)?.name || country}` : ""}
            {rank ? ` · ${rank}` : ""}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={intent === "hire" ? "/signup/company" : "/signup/crew"}
              className="px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20"
            >
              Sign Up Free
            </Link>
            <Link
              href={`/login?next=${encodeURIComponent(targetUrl)}`}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10"
            >
              Login
            </Link>
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
