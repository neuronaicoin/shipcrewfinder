import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Applications — ShipCrewFinder",
};

export default async function JobApplicationsPage({
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

  // İlanı çek — sadece sahibi görebilir
  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, position, job_type, company_id, status")
    .eq("id", id)
    .eq("company_id", user.id)
    .single();

  if (!job) notFound();

  // Başvuruları çek
  const { data: applications } = await supabase
    .from("job_applications")
    .select("id, applicant_id, message, status, created_at")
    .eq("job_id", job.id)
    .order("created_at", { ascending: false });

  const apps = applications || [];

  // Başvuranların profil bilgileri
  const applicantIds = [...new Set(apps.map((a) => a.applicant_id as string))];
  const profileMap: Record<string, { full_name: string; user_type: string; country: string | null }> = {};
  if (applicantIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, user_type, country")
      .in("id", applicantIds);
    (profiles || []).forEach((p) => {
      profileMap[p.id as string] = {
        full_name: (p.full_name as string) || "A candidate",
        user_type: (p.user_type as string) || "seafarer",
        country: (p.country as string) || null,
      };
    });
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

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
          <Link href="/jobs/mine" className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10">
            My Jobs
          </Link>
        </div>
      </header>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link href="/jobs/mine" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/60 text-sm transition mb-6">
          ← My Job Posts
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-accent/15 border border-accent/30 rounded-full text-accent text-[10px] font-bold uppercase tracking-wider">
            {job.position}
          </span>
          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-[10px] font-bold uppercase tracking-wider">
            {job.job_type === "yacht" ? "Yacht" : "Ship"}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
          {job.title}
        </h1>
        <p className="text-white/60 text-base mb-8">
          {apps.length} application{apps.length === 1 ? "" : "s"}
        </p>

        {apps.length === 0 ? (
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-white/60">No applications yet. They will appear here when crew apply.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => {
              const p = profileMap[app.applicant_id as string];
              const name = p?.full_name || "A candidate";
              return (
                <div key={app.id as string} className="bg-primary-dark border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <span className="font-display text-lg font-bold text-accent">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-bold text-white">{name}</h3>
                      <p className="text-white/40 text-xs mb-2">
                        {p?.user_type === "yacht" ? "Yacht Crew" : "Ship Crew"} · Applied {fmtDate(app.created_at as string)}
                      </p>
                      {app.message && (
                        <p className="text-white/70 text-sm leading-relaxed bg-primary border border-white/5 rounded-lg p-3 mt-2">
                          {app.message as string}
                        </p>
                      )}
                      <Link
                        href={`/candidate/${app.applicant_id}`}
                        className="inline-block mt-3 px-4 py-2 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
