import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { closeJob, reopenJob } from "@/lib/actions/jobs";
import DeleteJobButton from "@/app/components/delete-job-button";
import { getSortedCountries } from "@/lib/constants/countries";

export const metadata = {
  title: "My Job Posts — ShipCrewFinder",
};

export default async function MyJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const created = sp.created;
  const updated = sp.updated;
  const deleted = sp.deleted;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();
  if (!profile || profile.user_type !== "company") redirect("/dashboard");

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, position, job_type, location_country, location_city, status, created_at")
    .eq("company_id", user.id)
    .order("created_at", { ascending: false });

  const jobList = jobs || [];

  const countries = getSortedCountries();
  const countryName = (code: string | null) => {
    if (!code) return null;
    const c = countries.find((x) => x.code === code);
    return c ? `${c.flag} ${c.name}` : code;
  };

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "";

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
          <Link href="/dashboard" className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              My Job Posts
            </h1>
            <p className="text-white/60 text-base">{jobList.length} job{jobList.length === 1 ? "" : "s"} total</p>
          </div>
          <Link href="/jobs/new" className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20 whitespace-nowrap">
            + Post Job
          </Link>
        </div>

        {created === "1" && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-300 text-sm">
            Your job has been published.
          </div>
        )}
        {updated === "1" && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-300 text-sm">
            Your job has been updated.
          </div>
        )}
        {deleted === "1" && (
          <div className="mb-6 bg-white/5 border border-white/15 rounded-xl p-4 text-white/70 text-sm">
            The job has been deleted.
          </div>
        )}

        {jobList.length === 0 ? (
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-white/60 mb-4">You haven&apos;t posted any jobs yet.</p>
            <Link href="/jobs/new" className="inline-block px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobList.map((job) => (
              <div key={job.id} className="bg-primary-dark border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-accent/15 border border-accent/30 rounded-full text-accent text-[10px] font-bold uppercase tracking-wider">
                        {job.position}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        job.status === "active"
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white/50"
                      }`}>
                        {job.status === "active" ? "Active" : "Closed"}
                      </span>
                    </div>
                    <Link href={`/jobs/${job.id}`} className="font-display text-xl font-bold text-white hover:text-accent transition truncate block">
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-2 text-white/50 text-sm">
                      {countryName(job.location_country) && (
                        <span>{countryName(job.location_country)}{job.location_city ? `, ${job.location_city}` : ""}</span>
                      )}
                      <span>·</span>
                      <span>{fmtDate(job.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
                  <Link
                    href={`/jobs/${job.id}/edit`}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-bold rounded-lg transition border border-white/10"
                  >
                    Edit
                  </Link>

                  {job.status === "active" ? (
                    <form action={closeJob}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button type="submit" className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-bold rounded-lg transition border border-white/10">
                        Close
                      </button>
                    </form>
                  ) : (
                    <form action={reopenJob}>
                      <input type="hidden" name="jobId" value={job.id} />
                      <button type="submit" className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold rounded-lg transition border border-emerald-500/30">
                        Reopen
                      </button>
                    </form>
                  )}

                  <DeleteJobButton jobId={job.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
