import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSortedCountries } from "@/lib/constants/countries";

export const metadata = {
  title: "Careers — ShipCrewFinder",
};

type CareerJob = {
  id: string;
  title: string;
  position: string;
  location_country: string | null;
  location_city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  contract_duration: string | null;
  created_at: string;
};

export default async function CompanyCareersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const clean = (slug || "").trim().toLowerCase();
  if (!clean || clean.length < 3 || clean.length > 80) notFound();

  const supabase = await createClient();

  // Şirketi slug ile bul
  const { data: company } = await supabase
    .from("company_details")
    .select("id, company_name, company_type, headquarters_country, website, description, careers_slug")
    .eq("careers_slug", clean)
    .maybeSingle();

  if (!company) notFound();

  // Profil (görünürlük kontrolü) + puan + açık ilanlar
  const [{ data: profile }, { data: ratingData }, { data: jobs }] = await Promise.all([
    supabase
      .from("profiles")
      .select("visibility, country")
      .eq("id", company.id)
      .single(),
    supabase.rpc("get_company_rating", { cid: company.id }),
    supabase
      .from("jobs")
      .select("id, title, position, location_country, location_city, salary_min, salary_max, salary_currency, contract_duration, created_at")
      .eq("company_id", company.id)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ]);

  if (!profile || profile.visibility === "hidden") notFound();

  const score = typeof ratingData === "number" ? ratingData : Number(ratingData) || 3.0;
  const jobList = (jobs || []) as CareerJob[];

  const countries = getSortedCountries();
  const hq = countries.find((c) => c.code === company.headquarters_country || c.name === company.headquarters_country);
  const hqLabel = hq ? hq.flag + " " + hq.name : (company.headquarters_country as string) || null;

  const countryLabel = (code: string | null) => {
    if (!code) return null;
    const c = countries.find((x) => x.code === code);
    return c ? c.flag + " " + c.name : code;
  };

  const salaryOf = (j: CareerJob) =>
    j.salary_min || j.salary_max
      ? (j.salary_currency || "USD") + " " + (j.salary_min || "?") + (j.salary_max ? "–" + j.salary_max : "") + "/mo"
      : null;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const name = (company.company_name as string) || "Maritime Company";
  const websiteUrl = company.website
    ? ((company.website as string).startsWith("http") ? (company.website as string) : "https://" + (company.website as string))
    : null;

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: name,
    url: "https://shipcrewfinder.com/careers/" + clean,
    ...(websiteUrl ? { sameAs: websiteUrl } : {}),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:800px;margin:0 auto;padding:0 20px}
  .top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 0;flex-wrap:wrap}
  .logo{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--tx)}
  .logo .ic{width:32px;height:32px;border-radius:9px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:16px;font-weight:700}
  .logo b span{color:var(--gold)}
  .topcta{display:inline-flex;align-items:center;gap:7px;border-radius:11px;font-weight:700;font-size:12.5px;padding:9px 15px;color:var(--tx);border:1px solid var(--line2);text-decoration:none;transition:.18s}
  .topcta:hover{border-color:var(--gold);color:var(--gold)}
  .hero{position:relative;padding:34px 0 24px;overflow:hidden;text-align:center}
  .aur{position:absolute;width:460px;height:460px;top:-240px;left:50%;transform:translateX(-50%);border-radius:50%;filter:blur(90px);opacity:.45;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .cico{width:64px;height:64px;border-radius:17px;background:rgba(251,191,36,.13);border:1.5px solid rgba(251,191,36,.35);display:grid;place-items:center;margin:0 auto 14px;font-size:28px}
  h1{font-family:var(--disp);font-size:clamp(1.7rem,4.5vw,2.6rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .meta{font-size:13.5px;color:var(--tx2);margin-bottom:12px}
  .badges{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
  .badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:800;letter-spacing:.04em;border-radius:999px;padding:5px 13px;border:1px solid}
  .badge.gold{color:var(--gold);border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.09)}
  .badge.grn{color:var(--grn);border-color:rgba(52,211,153,.4);background:rgba(52,211,153,.09)}
  .desc{font-size:13.5px;color:var(--tx2);line-height:1.7;max-width:56ch;margin:14px auto 0}
  section{padding:20px 0 44px}
  .stitle{font-family:var(--disp);font-size:12.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
  .jlist{display:flex;flex-direction:column;gap:11px}
  .jcard{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:17px 20px;transition:.2s}
  .jcard:hover{border-color:var(--gold)}
  .jtitle{font-family:var(--disp);font-size:15.5px;font-weight:700;margin-bottom:4px}
  .jmeta{display:flex;flex-wrap:wrap;gap:5px 11px;font-size:12px;color:var(--tx3);align-items:center}
  .jtag{font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);border-radius:999px;padding:3px 10px}
  .sal{color:var(--grn);font-weight:700}
  .abtn{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:11px;padding:11px 21px;font-weight:800;font-size:13px;text-decoration:none;transition:.18s;white-space:nowrap}
  .abtn:hover{transform:translateY(-2px)}
  .empty{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:34px;text-align:center;font-size:13.5px;color:var(--tx2);line-height:1.7}
  .powered{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:linear-gradient(160deg,var(--navy2),var(--ink));border:1.5px solid var(--line);border-radius:16px;padding:16px 20px;margin-top:22px}
  .powered p{font-size:12.5px;color:var(--tx2);line-height:1.6}
  .powered b{color:var(--tx);font-family:var(--disp);display:block;font-size:13.5px;margin-bottom:2px}
  footer{border-top:1px solid var(--line2);padding:28px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <div className="wrap">
        <div className="top">
          <Link href="/" className="logo">
            <span className="ic">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.4"/><line x1="12" y1="7.4" x2="12" y2="20.5"/><line x1="7.5" y1="10.4" x2="16.5" y2="10.4"/><path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7"/><path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4"/><path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4"/></svg>
            </span>
            <b>Ship<span>Crew</span>Finder</b>
          </Link>
          <Link href="/jobs" className="topcta">All maritime jobs →</Link>
        </div>
      </div>

      <div className="hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <div className="cico">🚢</div>
          <h1>{name}</h1>
          <p className="meta">
            {(company.company_type as string) || "Maritime Company"}
            {hqLabel ? " · " + hqLabel : ""}
          </p>
          <div className="badges">
            <span className="badge gold">⚓ {score.toFixed(1)} crew rating</span>
            <span className="badge grn">✓ Verified employer</span>
          </div>
          {company.description ? <p className="desc">{company.description as string}</p> : null}
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stitle">Open positions ({jobList.length})</div>

          {jobList.length === 0 ? (
            <div className="empty">
              No open positions right now. Create a free ShipCrewFinder profile and set a job alert — you&apos;ll be notified the moment {name} posts a new position.
              <div style={{ marginTop: 16 }}>
                <Link href="/signup/crew" className="abtn">Create free profile →</Link>
              </div>
            </div>
          ) : (
            <div className="jlist">
              {jobList.map((j) => (
                <div key={j.id} className="jcard">
                  <div style={{ minWidth: 0, flex: "1 1 260px" }}>
                    <div className="jtitle">{j.title}</div>
                    <div className="jmeta">
                      <span className="jtag">{j.position}</span>
                      {salaryOf(j) ? <span className="sal">{salaryOf(j)}</span> : null}
                      {j.contract_duration ? <span>{j.contract_duration}</span> : null}
                      {countryLabel(j.location_country) ? <span>{countryLabel(j.location_country)}{j.location_city ? ", " + j.location_city : ""}</span> : null}
                      <span>{fmtDate(j.created_at)}</span>
                    </div>
                  </div>
                  <Link href={"/jobs/" + j.id} className="abtn">Apply →</Link>
                </div>
              ))}
            </div>
          )}

          <div className="powered">
            <div style={{ minWidth: 0 }}>
              <b>⚓ Applications are managed on ShipCrewFinder</b>
              <p>Apply with your verified maritime profile and live CV — sea service, certificates and availability in one place. Free for crew.</p>
            </div>
            <Link href="/signup/crew" className="abtn">Join free →</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          Careers powered by <Link href="/">ShipCrewFinder</Link> · <Link href="/jobs">Browse all jobs</Link> · <Link href="/salary">Salary Index</Link>
        </div>
      </footer>
    </>
  );
}
