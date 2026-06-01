import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import Link from "next/link";

export const metadata = {
  title: "Browse Candidates — ShipCrewFinder",
};

type ProfileRow = {
  id: string;
  user_type: string;
  full_name: string | null;
  country: string | null;
  avatar_url: string | null;
  visibility: string | null;
};

export default async function BrowsePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Only companies can browse candidates
  const { data: me } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (!me || me.user_type !== "company") {
    redirect("/dashboard");
  }

  // Candidates who blocked this company
  const { data: blockedRows } = await supabase
    .from("blocked_companies")
    .select("user_id")
    .eq("company_id", user.id);

  const blockedByIds = (blockedRows || []).map((r) => r.user_id as string);

  // Fetch visible candidate profiles (public + stealth, not hidden)
  let query = supabase
    .from("profiles")
    .select("id, user_type, full_name, country, avatar_url, visibility")
    .in("user_type", ["seafarer", "yacht"])
    .in("visibility", ["public", "stealth"]);

  if (blockedByIds.length > 0) {
    query = query.not("id", "in", `(${blockedByIds.join(",")})`);
  }

  const { data: profiles } = await query;
  const profileList = (profiles || []) as ProfileRow[];

  // Fetch details for these candidates
  const seafarerIds = profileList
    .filter((p) => p.user_type === "seafarer")
    .map((p) => p.id);
  const yachtIds = profileList
    .filter((p) => p.user_type === "yacht")
    .map((p) => p.id);

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

  if (yachtIds.length > 0) {
    const { data } = await supabase
      .from("yacht_details")
      .select("id, position, years_experience, availability")
      .in("id", yachtIds);
    (data || []).forEach((d) => {
      detailsMap[d.id as string] = d as Record<string, unknown>;
    });
  }

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
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Browse Candidates
          </h1>
          <p className="text-white/60 text-lg">
            {profileList.length} maritime professional{profileList.length === 1 ? "" : "s"} available
          </p>
        </div>

        {profileList.length === 0 ? (
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-white/60">
              No candidates available yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {profileList.map((p) => {
              const d = detailsMap[p.id] || {};
              const isStealth = p.visibility === "stealth";
              const roleTitle =
                (d.rank as string) || (d.position as string) || "Maritime Professional";
              const langs = Array.isArray(d.languages)
                ? (d.languages as string[])
                : [];
              const avail = availLabel(d.availability);

              return (
                <div
                  key={p.id}
                  className="bg-primary-dark border border-white/10 hover:border-accent/40 rounded-2xl p-6 transition flex flex-col"
                >
                  {/* Header row */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                      {isStealth ? (
                        <svg className="w-5 h-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="font-display text-lg font-bold text-accent">
                          {(p.full_name || "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-bold text-white truncate">
                        {isStealth ? "Hidden Profile" : p.full_name || "Unnamed"}
                      </h3>
                      <p className="text-accent text-sm font-bold truncate">{roleTitle}</p>
                    </div>
                    {isStealth && (
                      <span className="flex-shrink-0 px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-white/5 border border-white/15 text-white/60">
                        🔒
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 mb-5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Experience</span>
                      <span className="text-white/90">{expLabel(d.years_experience)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Country</span>
                      <span className="text-white/90">
                        {(d.nationality as string) || p.country || "—"}
                      </span>
                    </div>
                    {langs.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/50">Languages</span>
                        <span className="text-white/90 text-right truncate ml-2">
                          {langs.join(", ")}
                        </span>
                      </div>
                    )}
                    {avail && (
                      <div className="flex justify-between">
                        <span className="text-white/50">Availability</span>
                        <span className="text-emerald-400">{avail}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/candidate/${p.id}`}
                    className="mt-auto inline-flex items-center justify-center px-4 py-2.5 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition"
                  >
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
