import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getSortedCountries } from "@/lib/constants/countries";

export const metadata = {
  title: "Maritime Jobs — ShipCrewFinder",
  description:
    "Browse maritime job openings from verified companies. Find seafarer and yacht crew positions by rank and country.",
};

export default async function JobsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, position, job_type, location_country, location_city, created_at, company_id")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const jobList = jobs || [];

  const countries = getSortedCountries();
  const countryName = (code: string | null) => {
    if (!code) return null;
    const c = countries.find((x) => x.code === code);
    return c ? `${c.flag} ${c.name}` : code;
  };

  const fmtDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "";

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
            {user ? (
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

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Maritime Jobs
          </h1>
          <p className="text-white/60 text-lg">
            {jobList.length} open position{jobList.length === 1 ? "" : "s"} from verified companies.
          </p>
        </div>

        {jobList.length === 0 ? (
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-white/60">No open jobs right now. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobList.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group block bg-primary-dark border border-white/10 hover:border-accent/40 rounded-2xl p-6 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-accent/15 border border-accent/30 rounded-full text-accent text-[10px] font-bold uppercase tracking-wider">
                        {job.position}
                      </span>
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-[10px] font-bold uppercase tracking-wider">
                        {job.job_type === "yacht" ? "Yacht" : "Ship"}
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-bold text-white group-hover:text-accent transition truncate">
                      {job.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-white/50 text-sm">
                      {countryName(job.location_country) && (
                        <span>{countryName(job.location_country)}{job.location_city ? `, ${job.location_city}` : ""}</span>
                      )}
                      <span>·</span>
                      <span>{fmtDate(job.created_at)}</span>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-white/30 group-hover:text-accent transition flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
