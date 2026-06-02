import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSortedCountries } from "@/lib/constants/countries";

export const metadata = {
  title: "Job Details — ShipCrewFinder",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job || (job.status !== "active" && job.company_id !== user?.id)) {
    notFound();
  }

  const countries = getSortedCountries();
  const countryName = (code: string | null) => {
    if (!code) return null;
    const c = countries.find((x) => x.code === code);
    return c ? `${c.flag} ${c.name}` : code;
  };

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  const salary =
    job.salary_min || job.salary_max
      ? `${job.salary_currency || "USD"} ${job.salary_min || "?"}${job.salary_max ? ` – ${job.salary_max}` : ""} / month`
      : null;

  const isMember = !!user;

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
            {isMember ? (
              <Link href="/dashboard" className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition">Login</Link>
                <Link href="/signup" className="px-4 py-2 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition shadow-lg shadow-accent/20">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link href="/jobs" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/60 text-sm transition mb-6">
          ← All Jobs
        </Link>

        {/* Title block — always visible */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-accent/15 border border-accent/30 rounded-full text-accent text-[10px] font-bold uppercase tracking-wider">
            {job.position}
          </span>
          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-[10px] font-bold uppercase tracking-wider">
            {job.job_type === "yacht" ? "Yacht" : "Ship"}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          {job.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-white/50 text-sm mb-8">
          {countryName(job.location_country) && (
            <span>{countryName(job.location_country)}{job.location_city ? `, ${job.location_city}` : ""}</span>
          )}
          <span>·</span>
          <span>Posted {fmtDate(job.created_at)}</span>
        </div>

        {isMember ? (
          <>
            {/* Quick facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {salary && (
                <div className="bg-primary-dark border border-white/10 rounded-xl p-4">
                  <div className="text-white/50 text-xs mb-1">Salary</div>
                  <div className="text-white font-bold text-sm">{salary}</div>
                </div>
              )}
              {job.contract_duration && (
                <div className="bg-primary-dark border border-white/10 rounded-xl p-4">
                  <div className="text-white/50 text-xs mb-1">Contract</div>
                  <div className="text-white font-bold text-sm">{job.contract_duration}</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="font-display text-xl font-bold text-white mb-4">Job Description</h2>
              <p className="text-white/75 text-base leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Apply / contact note */}
            <div className="mt-8 bg-primary-dark border border-accent/20 rounded-2xl p-6 text-center">
              <p className="text-white/70 text-sm">
                Interested? Make sure your profile is complete so this company can find and contact you.
              </p>
              <Link href="/dashboard" className="inline-block mt-4 px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition">
                Go to My Dashboard
              </Link>
            </div>
          </>
        ) : (
          /* Locked — not a member */
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-8 md:p-10 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-3">
              Sign in to see the full job
            </h2>
            <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
              You can see the job title and basics, but the full description and details are available to members only. Create a free account to view it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup/crew" className="px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20">
                Sign Up Free
              </Link>
              <Link href="/login" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10">
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
