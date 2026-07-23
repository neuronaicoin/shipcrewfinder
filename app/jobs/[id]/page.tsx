import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSortedCountries } from "@/lib/constants/countries";
import ApplyForm from "@/app/components/apply-form";

export const metadata = {
  title: "Job Details — ShipCrewFinder",
};

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const applied = sp.applied;
  const error = sp.error;

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

  // Kullanıcının tipi + bu ilana başvurup başvurmadığı
  let userType: string | null = null;
  let alreadyApplied = false;
  if (user) {
    const { data: me } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();
    userType = (me?.user_type as string) || null;

    const { data: existing } = await supabase
      .from("job_applications")
      .select("id")
      .eq("job_id", job.id)
      .eq("applicant_id", user.id)
      .maybeSingle();
    alreadyApplied = !!existing;
  }

  // İlan sahibi şirketin bilgileri (üyelere gösterilir)
  const { data: companyProfile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, country")
    .eq("id", job.company_id)
    .single();
  const { data: companyDetails } = await supabase
    .from("company_details")
    .select("website, contact_phone, description, company_type")
    .eq("id", job.company_id)
    .maybeSingle();

  const isOwner = !!user && job.company_id === user.id;

  // ── Google for Jobs: JobPosting yapılandırılmış verisi ──
  const jobLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.title,
    datePosted: job.created_at,
    validThrough: new Date(new Date(job.created_at).getTime() + 60 * 24 * 3600 * 1000).toISOString(),
    employmentType: "CONTRACTOR",
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: companyProfile?.full_name || "Verified Maritime Company",
      ...(companyDetails?.website
        ? { sameAs: companyDetails.website.startsWith("http") ? companyDetails.website : `https://${companyDetails.website}` }
        : {}),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(job.location_city ? { addressLocality: job.location_city } : {}),
        addressCountry: job.location_country || "INT",
      },
    },
    ...(job.salary_min || job.salary_max
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salary_currency || "USD",
            value: {
              "@type": "QuantitativeValue",
              ...(job.salary_min ? { minValue: job.salary_min } : {}),
              ...(job.salary_max ? { maxValue: job.salary_max } : {}),
              unitText: "MONTH",
            },
          },
        }
      : {}),
  };
  const isCrew = userType === "seafarer" || userType === "yacht";

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobLd) }} />
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
              <Link href="/dashboard" className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-lg transition border border-white/10">Your Account</Link>
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

        {/* Status banners */}
        {applied === "1" && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-300 text-sm">
            Your application has been sent. The company has been notified.
          </div>
        )}
        {applied === "already" && (
          <div className="mb-6 bg-white/5 border border-white/15 rounded-xl p-4 text-white/70 text-sm">
            You have already applied to this job.
          </div>
        )}
        {error === "closed" && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
            This job is no longer accepting applications.
          </div>
        )}
        {error === "notcrew" && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
            Only crew accounts can apply to jobs.
          </div>
        )}
        {error === "failed" && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
            Something went wrong. Please try again.
          </div>
        )}

        {/* Title block — always visible */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-accent/15 border border-accent/30 rounded-full text-accent text-[10px] font-bold uppercase tracking-wider">
            {job.position}
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

            {/* About the company */}
            <div className="mt-8 bg-primary-dark border border-white/10 rounded-2xl p-6 md:p-8">
              <h2 className="font-display text-xl font-bold text-white mb-1">About the Company</h2>
              <p className="text-accent font-bold mb-4">{companyProfile?.full_name || "Verified Company"}</p>
              {companyDetails?.description && (
                <p className="text-white/70 text-sm leading-relaxed mb-5 whitespace-pre-line">
                  {companyDetails.description}
                </p>
              )}
              <div className="space-y-3">
                {companyDetails?.website && (
                  <div className="flex items-center justify-between py-2.5 border-b border-white/5">
                    <span className="text-white/50 text-sm">Website</span>
                    <a href={companyDetails.website.startsWith("http") ? companyDetails.website : `https://${companyDetails.website}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-accent hover:text-accent-light font-medium text-sm underline underline-offset-2 break-all">
                      {companyDetails.website}
                    </a>
                  </div>
                )}
                {(companyDetails?.contact_phone || companyProfile?.phone) && (
                  <div className="flex items-center justify-between py-2.5 border-b border-white/5">
                    <span className="text-white/50 text-sm">Phone</span>
                    <span className="text-white font-medium text-sm">{companyDetails?.contact_phone || companyProfile?.phone}</span>
                  </div>
                )}
                {companyProfile?.email && (
                  <div className="flex items-center justify-between py-2.5 border-b border-white/5">
                    <span className="text-white/50 text-sm">Email</span>
                    <a href={`mailto:${companyProfile.email}`} className="text-white font-medium text-sm break-all hover:text-accent transition">
                      {companyProfile.email}
                    </a>
                  </div>
                )}
                {companyProfile?.country && (
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-white/50 text-sm">Country</span>
                    <span className="text-white font-medium text-sm">{countryName(companyProfile.country) || companyProfile.country}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Apply section */}
            {isOwner ? (
              <div className="mt-8 bg-primary-dark border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-white/70 text-sm mb-4">This is your job posting.</p>
                <Link href={`/jobs/${job.id}/applications`} className="inline-block px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition">
                  View Applications
                </Link>
              </div>
            ) : alreadyApplied ? (
              <div className="mt-8 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
                <p className="text-emerald-300 font-bold text-sm">✓ You have applied to this job</p>
                <p className="text-white/50 text-xs mt-1">The company can see your application and profile.</p>
              </div>
            ) : isCrew ? (
              <div className="mt-8 bg-primary-dark border border-accent/20 rounded-2xl p-6">
                <h2 className="font-display text-xl font-bold text-white mb-4">Apply for this position</h2>
                <ApplyForm jobId={job.id} />
              </div>
            ) : (
              <div className="mt-8 bg-primary-dark border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-white/60 text-sm">Only crew accounts can apply to jobs.</p>
              </div>
            )}
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
