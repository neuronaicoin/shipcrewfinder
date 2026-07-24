import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getSortedCountries } from "@/lib/constants/countries";
import { SHIP_RANKS } from "@/lib/constants/ranks";
import JobAlertBox from "@/app/components/job-alert-box";
import SiteHeader from "@/app/components/site-header";

export const metadata = {
  title: "Maritime Jobs — ShipCrewFinder",
  description:
    "Browse maritime job openings from verified companies. Find seafarer and yacht crew positions by rank and country.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const fRank = sp.rank || "";
  const fCountry = sp.country || "";

  const supabase = await createClient();

  // getSession: çerezden okur — ekstra ağ turu yok
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  let query = supabase
    .from("jobs")
    .select("id, title, position, job_type, location_country, location_city, created_at, company_id, salary_min, salary_max, salary_currency, contract_duration")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (fRank) {
    query = query.eq("position", fRank);
  }
  if (fCountry) {
    query = query.eq("location_country", fCountry);
  }

  const { data: jobs } = await query;
  const jobList = jobs || [];

  // Job alert durumu + kullanıcı tipi + okunmamış bildirim (paralel)
  let alertActive = false;
  let isCompany = false;
  let userType: "seafarer" | "yacht" | "company" | null = null;
  let unreadCount = 0;

  if (user) {
    const [{ data: myProfile }, { count: unread }] = await Promise.all([
      supabase.from("profiles").select("user_type").eq("id", user.id).single(),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false),
    ]);
    userType = (myProfile?.user_type as typeof userType) || null;
    isCompany = userType === "company";
    unreadCount = unread || 0;

    if (fRank && !isCompany) {
      const { data: myAlert } = await supabase
        .from("job_alerts")
        .select("active")
        .eq("user_id", user.id)
        .eq("rank", fRank)
        .maybeSingle();
      alertActive = myAlert?.active === true;
    }
  }

  const alertRedirectTo = `/jobs?rank=${encodeURIComponent(fRank)}${fCountry ? `&country=${encodeURIComponent(fCountry)}` : ""}`;

  // Şirket adları + puanları (tek turda)
  const companyIds = [...new Set(jobList.map((j) => j.company_id).filter(Boolean))] as string[];
  const companyNames: Record<string, string> = {};
  const companyScores: Record<string, number> = {};
  if (companyIds.length > 0) {
    const [{ data: comps }, { data: scores }] = await Promise.all([
      supabase.from("profiles").select("id, full_name").in("id", companyIds),
      supabase.rpc("get_company_ratings", { cids: companyIds }),
    ]);
    (comps || []).forEach((c) => { companyNames[c.id as string] = (c.full_name as string) || "Verified Company"; });
    ((scores || []) as { company_id: string; score: number }[]).forEach((s) => {
      companyScores[s.company_id] = Number(s.score) || 3.0;
    });
  }

  const salaryOf = (j: (typeof jobList)[number]) =>
    j.salary_min || j.salary_max
      ? `${j.salary_currency || "USD"} ${j.salary_min || "?"}${j.salary_max ? `–${j.salary_max}` : ""}/mo`
      : null;

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

  const hasFilter = fRank || fCountry;

  return (
    <>
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
  .wrap{max-width:980px;margin:0 auto;padding:0 20px}
  .jobs-hero{position:relative;padding:38px 0 22px;overflow:hidden}
  .aur{position:absolute;width:460px;height:460px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.45;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  h1{font-family:var(--disp);font-size:clamp(1.8rem,4.4vw,2.8rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .sub{font-size:14.5px;color:var(--tx2)}
  section{padding:20px 0 44px}
  .fcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:20px;margin-bottom:20px}
  .frow{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  @media(max-width:640px){.frow{grid-template-columns:1fr}}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--tx3);margin-bottom:7px}
  select{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:11px 13px;font-family:var(--body);font-size:13.5px;font-weight:500;outline:none;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 0.85rem center;padding-right:2.2rem}
  select:focus{border-color:var(--gold)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:13.5px;text-decoration:none;cursor:pointer;transition:.18s;border:none;padding:11px 19px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .jlist{display:flex;flex-direction:column;gap:12px}
  .jcard{display:block;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:20px 22px;text-decoration:none;color:var(--tx);transition:.2s}
  .jcard:hover{transform:translateY(-2px);border-color:var(--gold)}
  .jtags{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:9px}
  .jtag{font-size:10px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;border-radius:999px;padding:4px 11px;border:1px solid}
  .jtag.rank{color:var(--gold);border-color:rgba(251,191,36,.35);background:rgba(251,191,36,.08)}
  .jtag.sal{color:var(--grn);border-color:rgba(52,211,153,.35);background:rgba(52,211,153,.08)}
  .jtag.dur{color:var(--tx3);border-color:var(--line2);background:rgba(255,255,255,.03)}
  .jtitle{font-family:var(--disp);font-size:18px;font-weight:700;margin-bottom:6px}
  .jcard:hover .jtitle{color:var(--gold)}
  .jmeta{display:flex;flex-wrap:wrap;gap:6px 12px;font-size:12.5px;color:var(--tx3);align-items:center}
  .jmeta .co{color:var(--gold);font-weight:600}
  .rmini{display:inline-flex;align-items:center;gap:4px;font-weight:800;color:var(--gold);font-size:12px;border:1px solid rgba(251,191,36,.3);background:rgba(251,191,36,.07);border-radius:999px;padding:2px 9px}
  .empty{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:40px;text-align:center;font-size:14px;color:var(--tx2)}
  .salarycta{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;background:rgba(52,211,153,.07);border:1px solid rgba(52,211,153,.25);border-radius:14px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:var(--tx2)}
  .salarycta b{color:var(--tx);font-family:var(--disp)}
  .salarycta a{color:var(--gold);font-weight:700;text-decoration:none;white-space:nowrap}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader
        isLoggedIn={!!user}
        userType={userType}
        unreadCount={unreadCount}
        active="jobs"
      />
      <div className="jobs-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href={user ? "/dashboard" : "/"} className="back">
            ← {user ? "Back to dashboard" : "Back to homepage"}
          </Link>
          <h1>Maritime <span style={{ color: "var(--gold)" }}>Jobs</span></h1>
          <p className="sub">
            {jobList.length} open position{jobList.length === 1 ? "" : "s"} from verified companies — apply directly, zero commission.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {/* Filters */}
          <form method="get" className="fcard">
            <div className="frow">
              <div>
                <label>Rank</label>
                <select name="rank" defaultValue={fRank}>
                  <option value="">All ranks</option>
                  {Object.entries(SHIP_RANKS).map(([group, ranks]) => (
                    <optgroup key={group} label={group}>
                      {(ranks as string[]).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label>Country</label>
                <select name="country" defaultValue={fCountry}>
                  <option value="">All countries</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button type="submit" className="btn btn-gold">Apply Filters</button>
              {hasFilter ? (
                <Link href="/jobs" className="btn btn-ghost">Clear</Link>
              ) : null}
            </div>
          </form>

          {/* Job Alert */}
          {fRank ? (
            <div style={{ marginBottom: 20 }}>
              <JobAlertBox
                rank={fRank}
                isActive={alertActive}
                isLoggedIn={!!user}
                isCompany={isCompany}
                redirectTo={alertRedirectTo}
              />
            </div>
          ) : null}

          {/* Salary Index CTA */}
          <div className="salarycta">
            <div>
              <b>💰 Know your market rate.</b> Monthly wages for 15 ranks across bulk, tanker, container and LNG.
            </div>
            <Link href="/salary">Open Salary Index →</Link>
          </div>

          {/* Job list */}
          {jobList.length === 0 ? (
            <div className="empty">
              No open jobs match your filters. Try adjusting them — or set a job alert to get notified the moment a matching position is posted.
            </div>
          ) : (
            <div className="jlist">
              {jobList.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="jcard">
                  <div className="jtags">
                    <span className="jtag rank">{job.position}</span>
                    {salaryOf(job) ? <span className="jtag sal">{salaryOf(job)}</span> : null}
                    {job.contract_duration ? <span className="jtag dur">{job.contract_duration}</span> : null}
                  </div>
                  <div className="jtitle">{job.title}</div>
                  <div className="jmeta">
                    <span className="co">{companyNames[job.company_id] || "Verified Company"}</span>
                    <span className="rmini">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.4"/><line x1="12" y1="7.4" x2="12" y2="20.5"/><line x1="7.5" y1="10.4" x2="16.5" y2="10.4"/><path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7"/></svg>
                      {(companyScores[job.company_id] ?? 3.0).toFixed(1)}
                    </span>
                    {countryName(job.location_country) ? (
                      <span>{countryName(job.location_country)}{job.location_city ? `, ${job.location_city}` : ""}</span>
                    ) : null}
                    <span>{fmtDate(job.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/salary">Salary Index</Link> ·{" "}
          <Link href="/blog">Blog</Link> · <Link href="/">Home</Link>
        </div>
      </footer>
    </>
  );
}
