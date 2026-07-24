import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSortedCountries } from "@/lib/constants/countries";
import ApplyForm from "@/app/components/apply-form";
import SiteHeader from "@/app/components/site-header";

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
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job || (job.status !== "active" && job.company_id !== user?.id)) {
    notFound();
  }

  let userType: string | null = null;
  let alreadyApplied = false;
  let unreadCount = 0;
  if (user) {
    const [{ data: me }, { data: existing }, { count: unread }] = await Promise.all([
      supabase.from("profiles").select("user_type").eq("id", user.id).single(),
      supabase
        .from("job_applications")
        .select("id")
        .eq("job_id", job.id)
        .eq("applicant_id", user.id)
        .maybeSingle(),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false),
    ]);
    userType = (me?.user_type as string) || null;
    alreadyApplied = !!existing;
    unreadCount = unread || 0;
  }

  const [{ data: companyProfile }, { data: companyDetails }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email, phone, country")
      .eq("id", job.company_id)
      .single(),
    supabase
      .from("company_details")
      .select("website, contact_phone, description, company_type")
      .eq("id", job.company_id)
      .maybeSingle(),
  ]);

  const isOwner = !!user && job.company_id === user.id;

  const websiteUrl = companyDetails?.website
    ? (companyDetails.website.startsWith("http") ? companyDetails.website : "https://" + companyDetails.website)
    : null;

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
      ...(websiteUrl ? { sameAs: websiteUrl } : {}),
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
    return c ? c.flag + " " + c.name : code;
  };

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  const salary =
    job.salary_min || job.salary_max
      ? (job.salary_currency || "USD") + " " + (job.salary_min || "?") + (job.salary_max ? " – " + job.salary_max : "") + " / month"
      : null;

  const isMember = !!user;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobLd) }} />
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body.light{
    --navy:#f2f4fb;--navy2:#ffffff;--ink:#ffffff;
    --tx:#0e1730;--tx2:#2e3c5e;--tx3:#57678a;
    --line:rgba(224,160,16,.4);--line2:rgba(15,25,60,.12);
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:820px;margin:0 auto;padding:0 20px}
  .jd-hero{position:relative;padding:34px 0 8px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:18px}
  .back:hover{color:var(--gold)}
  .jtag{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);border-radius:999px;padding:4px 12px;margin-bottom:12px}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.2vw,2.6rem);font-weight:800;line-height:1.12;letter-spacing:-.02em;margin-bottom:10px}
  .jmeta{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:13px;color:var(--tx3);margin-bottom:8px}
  section{padding:20px 0 44px}
  .banner{border-radius:13px;padding:13px 17px;font-size:13px;margin-bottom:16px;border:1px solid}
  .banner.ok{color:var(--grn);border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.08)}
  .banner.info{color:var(--tx2);border-color:var(--line2);background:rgba(255,255,255,.03)}
  .banner.err{color:#f87171;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
  .facts{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}
  @media(max-width:560px){.facts{grid-template-columns:1fr}}
  .fact{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:14px;padding:15px 18px}
  .fact .fl{font-size:11px;color:var(--tx3);margin-bottom:4px}
  .fact .fv{font-family:var(--disp);font-weight:700;font-size:15px}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:24px 26px;margin-bottom:18px}
  .card h2{font-family:var(--disp);font-size:18px;font-weight:800;margin-bottom:12px}
  .card .co{color:var(--gold);font-weight:700;font-size:14px;margin-bottom:12px}
  .desc{font-size:14px;color:var(--tx2);line-height:1.75;white-space:pre-line}
  .rows{display:flex;flex-direction:column}
  .row{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid var(--line2);font-size:13.5px}
  .row:last-child{border-bottom:none}
  .row span{color:var(--tx3)}
  .row b,.row a{font-weight:600;text-align:right;word-break:break-all}
  .row a{color:var(--gold);text-decoration:none}
  .row a:hover{text-decoration:underline}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:12px 22px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .center{text-align:center}
  .lock{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px solid var(--line);border-radius:20px;padding:36px 28px;text-align:center}
  .lock .lic{width:54px;height:54px;margin:0 auto 18px;border-radius:16px;background:rgba(251,191,36,.13);border:1px solid rgba(251,191,36,.3);display:grid;place-items:center;font-size:22px}
  .lock h2{font-family:var(--disp);font-size:22px;font-weight:800;margin-bottom:10px}
  .lock p{font-size:13.5px;color:var(--tx2);line-height:1.65;max-width:46ch;margin:0 auto 20px}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={isMember}
        userType={userType as "seafarer" | "yacht" | "company" | null}
        unreadCount={unreadCount}
        active="jobs"
      />

      <div className="jd-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/jobs" className="back">← All Jobs</Link>
          <div style={{ height: 2 }} />
          <span className="jtag">{job.position}</span>
          <h1>{job.title}</h1>
          <div className="jmeta">
            {countryName(job.location_country) ? (
              <span>{countryName(job.location_country)}{job.location_city ? ", " + job.location_city : ""}</span>
            ) : null}
            <span>Posted {fmtDate(job.created_at)}</span>
          </div>
        </div>
      </div>
      <section style={{ paddingTop: 8 }}>
        <div className="wrap">
          {applied === "1" ? (
            <div className="banner ok">Your application has been sent. The company has been notified.</div>
          ) : null}
          {applied === "already" ? (
            <div className="banner info">You have already applied to this job.</div>
          ) : null}
          {error === "closed" ? (
            <div className="banner err">This job is no longer accepting applications.</div>
          ) : null}
          {error === "notcrew" ? (
            <div className="banner err">Only crew accounts can apply to jobs.</div>
          ) : null}
          {error === "failed" ? (
            <div className="banner err">Something went wrong. Please try again.</div>
          ) : null}

          {isMember ? (
            <>
              <div className="facts">
                {salary ? (
                  <div className="fact">
                    <div className="fl">Salary</div>
                    <div className="fv" style={{ color: "var(--grn)" }}>{salary}</div>
                  </div>
                ) : null}
                {job.contract_duration ? (
                  <div className="fact">
                    <div className="fl">Contract</div>
                    <div className="fv">{job.contract_duration}</div>
                  </div>
                ) : null}
              </div>

              <div className="card">
                <h2>Job Description</h2>
                <p className="desc">{job.description}</p>
              </div>

              <div className="card">
                <h2 style={{ marginBottom: 4 }}>About the Company</h2>
                <div className="co">{companyProfile?.full_name || "Verified Company"}</div>
                {companyDetails?.description ? (
                  <p className="desc" style={{ fontSize: 13, marginBottom: 14 }}>{companyDetails.description}</p>
                ) : null}
                <div className="rows">
                  {websiteUrl ? (
                    <div className="row">
                      <span>Website</span>
                      <a href={websiteUrl} target="_blank" rel="noopener noreferrer">{companyDetails?.website}</a>
                    </div>
                  ) : null}
                  {(companyDetails?.contact_phone || companyProfile?.phone) ? (
                    <div className="row">
                      <span>Phone</span>
                      <b>{companyDetails?.contact_phone || companyProfile?.phone}</b>
                    </div>
                  ) : null}
                  {companyProfile?.email ? (
                    <div className="row">
                      <span>Email</span>
                      <a href={"mailto:" + companyProfile.email}>{companyProfile.email}</a>
                    </div>
                  ) : null}
                  {companyProfile?.country ? (
                    <div className="row">
                      <span>Country</span>
                      <b>{countryName(companyProfile.country) || companyProfile.country}</b>
                    </div>
                  ) : null}
                </div>
              </div>

              {isOwner ? (
                <div className="card center">
                  <p style={{ fontSize: 13.5, color: "var(--tx2)", marginBottom: 16 }}>This is your job posting.</p>
                  <Link href={"/jobs/" + job.id + "/applications"} className="btn btn-gold">
                    View Applications
                  </Link>
                </div>
              ) : alreadyApplied ? (
                <div className="banner ok center" style={{ padding: "22px" }}>
                  <b>✓ You have applied to this job</b>
                  <div style={{ fontSize: 12, color: "var(--tx3)", marginTop: 5 }}>
                    The company can see your application and profile.
                  </div>
                </div>
              ) : isCrew ? (
                <div className="card" style={{ borderColor: "var(--line)" }}>
                  <h2>Apply for this position</h2>
                  <ApplyForm jobId={job.id} />
                </div>
              ) : (
                <div className="card center">
                  <p style={{ fontSize: 13.5, color: "var(--tx2)" }}>Only crew accounts can apply to jobs.</p>
                </div>
              )}
            </>
          ) : (
            <div className="lock">
              <div className="lic">🔒</div>
              <h2>Sign in to see the full job</h2>
              <p>
                You can see the job title and basics, but the full description, salary and company
                details are available to members only. Create a free account to view everything.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/signup/crew" className="btn btn-gold">⚓ Sign Up Free</Link>
                <Link href="/login" className="btn btn-ghost">Login</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/jobs">All Jobs</Link> ·{" "}
          <Link href="/salary">Salary Index</Link> · <Link href="/">Home</Link>
        </div>
      </footer>
    </>
  );
}
