import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import NotificationBell from "@/app/components/notification-bell";
import { SHIP_RANKS } from "@/lib/constants/ranks";
import { getSortedCountries } from "@/lib/constants/countries";
import { getSortedLanguages } from "@/lib/constants/languages";
import Link from "next/link";

export const metadata = {
  title: "Search for Crew — ShipCrewFinder",
};

type ProfileRow = {
  id: string;
  user_type: string;
  full_name: string | null;
  country: string | null;
  avatar_url: string | null;
  visibility: string | null;
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const fType = sp.type || "";
  const fRank = sp.rank || "";
  const fCountry = sp.country || "";
  const fExp = sp.exp || "";
  const fAvail = sp.avail || "";
  const fLang = sp.lang || "";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();
  if (!me || me.user_type !== "company") redirect("/dashboard");

  // Unread notifications
  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  // Candidates who blocked this company
  const { data: blockedRows } = await supabase
    .from("blocked_companies")
    .select("user_id")
    .eq("company_id", user.id);
  const blockedByIds = (blockedRows || []).map((r) => r.user_id as string);

  // Base profile query
  let query = supabase
    .from("profiles")
    .select("id, user_type, full_name, country, avatar_url, visibility")
    .eq("visibility", "public");

  query = query.eq("user_type", "seafarer");

  if (fCountry) {
    query = query.eq("country", fCountry);
  }

  if (blockedByIds.length > 0) {
    query = query.not("id", "in", `(${blockedByIds.join(",")})`);
  }

  const { data: profiles } = await query;
  let profileList = (profiles || []) as ProfileRow[];

  // Fetch details
  const seafarerIds = profileList.map((p) => p.id);

  const detailsMap: Record<string, Record<string, unknown>> = {};

  if (seafarerIds.length > 0) {
    const { data } = await supabase
      .from("seafarer_details")
      .select("id, rank, years_experience, nationality, availability, languages")
      .in("id", seafarerIds);
    (data || []).forEach((d) => {
      detailsMap[d.id as string] = d as Record<string, unknown>;
    });
  }


  // Apply detail-based filters in code
  profileList = profileList.filter((p) => {
    const d = detailsMap[p.id] || {};

    // Rank / position (case-insensitive contains)
    if (fRank) {
      const role = ((d.rank as string) || (d.position as string) || "").toUpperCase();
      if (!role.includes(fRank.toUpperCase())) return false;
    }

    // Experience buckets
    if (fExp) {
      const y = (d.years_experience as number) ?? -1;
      if (fExp === "0-1" && !(y >= 0 && y <= 1)) return false;
      if (fExp === "1-3" && !(y >= 2 && y <= 3)) return false;
      if (fExp === "3+" && !(y >= 4)) return false;
    }

    // Availability
    if (fAvail) {
      if ((d.availability as string) !== fAvail) return false;
    }

    // Language (seafarer has languages array)
    if (fLang) {
      const langs = Array.isArray(d.languages) ? (d.languages as string[]) : [];
      if (!langs.includes(fLang)) return false;
    }

    return true;
  });

  const expLabel = (y: unknown) => {
    const n = y as number | null | undefined;
    if (n === undefined || n === null) return "—";
    if (n <= 1) return "0–1 yrs";
    if (n <= 3) return "1–3 yrs";
    return "3+ yrs";
  };

  const availLabel = (a: unknown) => {
    const v = a as string | null | undefined;
    if (!v) return null;
    if (v === "immediate") return "Available now";
    if (v === "1-3_months") return "1–3 months";
    if (v === "3+_months") return "3+ months";
    return v;
  };

  const countries = getSortedCountries();
  const languages = getSortedLanguages();
  const countryName = (code: string | null) => {
    if (!code) return "—";
    const c = countries.find((x) => x.code === code);
    return c ? `${c.flag} ${c.name}` : code;
  };

  const inputStyle = {
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 0.75rem center",
    paddingRight: "2rem",
  };

  return (
    <main className="min-h-screen bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <header className="relative border-b border-white/10 backdrop-blur-md bg-primary/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 14 Q10 6, 20 14 T38 14" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
              <path d="M2 20 Q10 12, 20 20 T38 20" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <path d="M2 26 Q10 18, 20 26 T38 26" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-white font-display font-bold text-lg tracking-tight">
              Ship<span className="text-accent">Crew</span>Finder
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <NotificationBell count={unreadCount || 0} />
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10"
            >
              Dashboard
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Search for Crew
          </h1>
          <p className="text-white/60 text-lg">
            {profileList.length} maritime professional{profileList.length === 1 ? "" : "s"} found
          </p>
        </div>

        {/* Filters */}
        <form method="get" className="bg-primary-dark border border-white/10 rounded-2xl p-5 md:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Rank dropdown */}
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Rank / Position</label>
              <select name="rank" defaultValue={fRank} style={inputStyle}
                className="w-full px-3 py-2.5 bg-primary border border-white/15 rounded-lg text-white text-sm focus:border-accent focus:outline-none appearance-none">
                <option value="">All</option>
                <optgroup label="Ship — Deck">
                  {SHIP_RANKS["Deck Department"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Ship — Engine">
                  {SHIP_RANKS["Engine Department"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
                <optgroup label="Ship — Catering">
                  {SHIP_RANKS["Catering Department"].map((r) => <option key={r} value={r}>{r}</option>)}
                </optgroup>
              </select>
            </div>

            {/* Rank free text */}
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Or search rank</label>
              <input name="rank" defaultValue={fRank} placeholder="e.g. Master"
                className="w-full px-3 py-2.5 bg-primary border border-white/15 rounded-lg text-white text-sm placeholder-white/30 focus:border-accent focus:outline-none" />
            </div>

            {/* Country */}
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Country</label>
              <select name="country" defaultValue={fCountry} style={inputStyle}
                className="w-full px-3 py-2.5 bg-primary border border-white/15 rounded-lg text-white text-sm focus:border-accent focus:outline-none appearance-none">
                <option value="">All</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Experience</label>
              <select name="exp" defaultValue={fExp} style={inputStyle}
                className="w-full px-3 py-2.5 bg-primary border border-white/15 rounded-lg text-white text-sm focus:border-accent focus:outline-none appearance-none">
                <option value="">All</option>
                <option value="0-1">0–1 years</option>
                <option value="1-3">1–3 years</option>
                <option value="3+">3+ years</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Availability</label>
              <select name="avail" defaultValue={fAvail} style={inputStyle}
                className="w-full px-3 py-2.5 bg-primary border border-white/15 rounded-lg text-white text-sm focus:border-accent focus:outline-none appearance-none">
                <option value="">All</option>
                <option value="immediate">Within 1 month</option>
                <option value="1-3_months">1–3 months</option>
                <option value="3+_months">3+ months</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Language</label>
              <select name="lang" defaultValue={fLang} style={inputStyle}
                className="w-full px-3 py-2.5 bg-primary border border-white/15 rounded-lg text-white text-sm focus:border-accent focus:outline-none appearance-none">
                <option value="">All</option>
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button type="submit"
              className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition">
              Apply Filters
            </button>
            <Link href="/browse"
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 font-bold text-sm rounded-lg transition border border-white/10">
              Clear
            </Link>
          </div>
        </form>

        {/* Results */}
        {profileList.length === 0 ? (
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-white/60">No candidates match your filters. Try adjusting them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {profileList.map((p) => {
              const d = detailsMap[p.id] || {};
              const roleTitle = (d.rank as string) || (d.position as string) || "Maritime Professional";
              const langs = Array.isArray(d.languages) ? (d.languages as string[]) : [];
              const avail = availLabel(d.availability);

              return (
                <div key={p.id}
                  className="bg-primary-dark border border-white/10 hover:border-accent/40 rounded-2xl p-6 transition flex flex-col">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <span className="font-display text-lg font-bold text-accent">
                        {(p.full_name || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-bold text-white truncate">
                        {p.full_name || "Unnamed"}
                      </h3>
                      <p className="text-accent text-sm font-bold truncate">{roleTitle}</p>
                    </div>

                  </div>

                  <div className="space-y-1.5 mb-5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Experience</span>
                      <span className="text-white/90">{expLabel(d.years_experience)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Country</span>
                      <span className="text-white/90 text-right ml-2 truncate">
                        {countryName((d.nationality as string) || p.country)}
                      </span>
                    </div>
                    {langs.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/50">Languages</span>
                        <span className="text-white/90 text-right truncate ml-2">{langs.join(", ")}</span>
                      </div>
                    )}
                    {avail && (
                      <div className="flex justify-between">
                        <span className="text-white/50">Availability</span>
                        <span className="text-emerald-400">{avail}</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/candidate/${p.id}`}
                    className="mt-auto inline-flex items-center justify-center px-4 py-2.5 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition">
                    View Profile
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
