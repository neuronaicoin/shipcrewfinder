import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import Link from "next/link";

export const metadata = {
  title: "Candidate — ShipCrewFinder",
};

// Plan → aylık tam-CV limiti (null = sınırsız)
const PLAN_LIMITS: Record<string, number | null> = {
  founding: 100,
  pro: 100,
  fleet: null,
};

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Only companies
  const { data: me } = await supabase
    .from("profiles")
    .select("user_type, plan")
    .eq("id", user.id)
    .single();
  if (!me || me.user_type !== "company") redirect("/dashboard");

  const myPlan = (me.plan as string) || "founding";
  const limit = PLAN_LIMITS[myPlan] ?? 100;

  // Candidate profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, user_type, full_name, email, phone, country, visibility")
    .eq("id", id)
    .single();

  if (!profile || !["seafarer", "yacht"].includes(profile.user_type)) {
    notFound();
  }

  // Hidden profiles are not viewable (crew privacy — kept)
  if (profile.visibility === "hidden") {
    notFound();
  }

  // Did this candidate block the company? (crew blocking — kept)
  const { data: blocked } = await supabase
    .from("blocked_companies")
    .select("id")
    .eq("user_id", id)
    .eq("company_id", user.id)
    .maybeSingle();
  if (blocked) notFound();

  // ── Credit system ─────────────────────────────────────────
  const monthKey = new Date().toISOString().slice(0, 7); // "2026-07"

  // Already viewed this crew this month? (re-opening is free)
  const { data: existingView } = await supabase
    .from("company_profile_views")
    .select("id")
    .eq("company_id", user.id)
    .eq("crew_id", id)
    .eq("month_key", monthKey)
    .maybeSingle();

  // How many distinct CVs viewed this month?
  const { count: usedRaw } = await supabase
    .from("company_profile_views")
    .select("id", { count: "exact", head: true })
    .eq("company_id", user.id)
    .eq("month_key", monthKey);
  let used = usedRaw || 0;

  let unlocked = false;
  if (existingView) {
    unlocked = true;
  } else if (limit === null || used < limit) {
    // Spend one credit (unique constraint makes double-insert harmless)
    const { error: insErr } = await supabase.from("company_profile_views").insert({
      company_id: user.id,
      crew_id: id,
      month_key: monthKey,
    });
    if (!insErr) used += 1;
    unlocked = true;
  }
  // else: limit reached → locked view (rank + country only)

  // Details
  let details: Record<string, unknown> | null = null;
  if (profile.user_type === "seafarer") {
    const { data } = await supabase
      .from("seafarer_details")
      .select("*")
      .eq("id", id)
      .single();
    details = data;
  } else {
    const { data } = await supabase
      .from("yacht_details")
      .select("*")
      .eq("id", id)
      .single();
    details = data;
  }

  const roleTitle =
    (details?.rank as string) ||
    (details?.position as string) ||
    "Maritime Professional";

  const expLabel = (() => {
    const n = details?.years_experience as number | null | undefined;
    if (n === undefined || n === null) return "—";
    if (n <= 1) return "0–1 years";
    if (n <= 3) return "1–3 years";
    return "3+ years";
  })();

  const availLabel = (() => {
    const v = details?.availability as string | null | undefined;
    if (!v) return null;
    if (v === "immediate") return "Available within 1 month";
    if (v === "1-3_months") return "Available in 1–3 months";
    if (v === "3+_months") return "Available in 3+ months";
    return v;
  })();

  const languages = Array.isArray(details?.languages)
    ? (details?.languages as string[])
    : [];

  const displayName = unlocked ? profile.full_name || "Unnamed" : "Profile Locked";
  const counterText =
    limit === null ? "Unlimited plan" : `Views this month: ${used}/${limit}`;

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
            <span className="hidden sm:inline-block px-3 py-1.5 bg-accent/10 border border-accent/25 rounded-lg text-accent text-xs font-bold">
              {counterText}
            </span>
            <Link
              href="/browse"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10"
            >
              Browse
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

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/60 text-sm transition mb-6"
        >
          ← Back to Browse
        </Link>

        {/* Header card */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center">
              {unlocked ? (
                <span className="font-display text-3xl font-bold text-accent">
                  {(profile.full_name || "U").charAt(0).toUpperCase()}
                </span>
              ) : (
                <svg className="w-8 h-8 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block px-3 py-1 bg-accent/15 border border-accent/30 rounded-full mb-2">
                <span className="text-accent text-xs font-extrabold tracking-wider uppercase">
                  {profile.user_type === "yacht" ? "Yacht Crew" : "Ship Crew"}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight break-words">
                {displayName}
              </h1>
              <p className="text-accent font-bold mt-1">{roleTitle}</p>
            </div>
          </div>
        </div>

        {/* Professional details */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Professional Details
          </h2>
          <div className="space-y-3">
            {/* Rank + Country: her zaman görünür (kilitliyken de) */}
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-white/60 text-sm">
                {profile.user_type === "yacht" ? "Position" : "Rank"}
              </span>
              <span className="text-white font-medium text-sm">{roleTitle}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-white/60 text-sm">Country</span>
              <span className="text-white font-medium text-sm">
                {(details?.nationality as string) || profile.country || "—"}
              </span>
            </div>

            {unlocked ? (
              <>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-white/60 text-sm">Experience</span>
                  <span className="text-white font-medium text-sm">{expLabel}</span>
                </div>
                {languages.length > 0 && (
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-white/60 text-sm">Languages</span>
                    <span className="text-white font-medium text-sm text-right">
                      {languages.join(", ")}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-3">
                  <span className="text-white/60 text-sm">Availability</span>
                  <span className="text-white font-medium text-sm">
                    {availLabel || "—"}
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Kilitli: bulanık placeholder satırları */}
                <div className="flex items-center justify-between py-3 border-b border-white/5 select-none">
                  <span className="text-white/60 text-sm">Experience</span>
                  <span className="text-white/70 font-medium text-sm blur-sm">3+ years</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5 select-none">
                  <span className="text-white/60 text-sm">Languages</span>
                  <span className="text-white/70 font-medium text-sm blur-sm">English, ······</span>
                </div>
                <div className="flex items-center justify-between py-3 select-none">
                  <span className="text-white/60 text-sm">Availability</span>
                  <span className="text-white/70 font-medium text-sm blur-sm">Available ······</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact & CV */}
        {unlocked ? (
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-white mb-4">
              Contact & Documents
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">Email</span>
                <span className="text-white font-medium text-sm break-all">
                  {profile.email || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-white/60 text-sm">Phone</span>
                <span className="text-white font-medium text-sm">
                  {profile.phone || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-white/60 text-sm">CV</span>
                <span className="text-white font-medium text-sm">
                  {details?.cv_url ? (
                    <a href={details.cv_url as string} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-light underline underline-offset-2">View CV</a>
                  ) : (
                    "Not uploaded"
                  )}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-primary-dark border border-accent/20 rounded-2xl p-6 md:p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 mb-4">
              <svg className="w-7 h-7 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-2">
              Monthly view limit reached
            </h2>
            <p className="text-white/60 text-sm mb-2 max-w-md mx-auto">
              You&apos;ve used {limit === null ? "" : `all ${limit}`} full profile views for this month
              ({counterText}). This profile shows rank and country only.
            </p>
            <p className="text-white/40 text-xs mb-6 max-w-md mx-auto">
              Your credits reset at the start of next month — or upgrade to Fleet for unlimited views.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20"
              >
                Upgrade to Fleet — Unlimited
              </Link>
              <Link
                href="/browse"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10"
              >
                Back to Browse
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
