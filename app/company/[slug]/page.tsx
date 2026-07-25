import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

type WorkedCompanySummary = {
  company_name: string | null;
  crew_count: number;
  contract_count: number;
  vessels: { vessel_name: string; slug: string; cnt: number }[];
  ranks: { rank: string; cnt: number }[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: name + " — Crew Experience & Fleet | ShipCrewFinder",
    description:
      "Maritime employer profile of " + name + ": verified seafarers who served with this company, fleet vessels and crew ranks. ShipCrewFinder crew records.",
  };
}

export default async function WorkedCompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const clean = (slug || "").trim().toLowerCase();
  if (!clean || clean.length < 3 || clean.length > 90) notFound();

  const supabase = await createClient();

  // Sea Time kayıtlarından şirket özeti + varsa SCF üyesi eş şirket (kariyer sayfası linki)
  const [{ data }, { data: memberCo }] = await Promise.all([
    supabase.rpc("get_worked_company_summary", { cslug: clean }),
    supabase
      .from("company_details")
      .select("careers_slug, company_name")
      .eq("careers_slug", clean)
      .maybeSingle(),
  ]);

  const c = (data || null) as WorkedCompanySummary | null;

  // Ne sea time kaydı ne üye eşleşmesi varsa 404
  if ((!c || !c.company_name || !c.crew_count) && !memberCo) notFound();

  const name = (c?.company_name as string) || (memberCo?.company_name as string) || "Maritime Company";
  const crewCount = c?.crew_count || 0;
  const contractCount = c?.contract_count || 0;
  const vessels = c?.vessels || [];
  const ranks = c?.ranks || [];

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: name,
    url: "https://shipcrewfinder.com/company/" + clean,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;--blu:#60a5fa;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:820px;margin:0 auto;padding:0 20px}
  .top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 0;flex-wrap:wrap}
  .logo{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--tx)}
  .logo .ic{width:32px;height:32px;border-radius:9px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:16px;font-weight:700}
  .logo b span{color:var(--gold)}
  .topcta{display:inline-flex;align-items:center;gap:7px;border-radius:11px;font-weight:700;font-size:12.5px;padding:9px 15px;color:var(--tx);border:1px solid var(--line2);text-decoration:none;transition:.18s}
  .topcta:hover{border-color:var(--gold);color:var(--gold)}
  .chero{position:relative;padding:30px 0 20px;overflow:hidden;text-align:center}
  .aur{position:absolute;width:460px;height:460px;top:-250px;left:50%;transform:translateX(-50%);border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(96,165,250,.28),transparent 65%);pointer-events:none}
  .cico{width:62px;height:62px;border-radius:17px;background:rgba(96,165,250,.12);border:1.5px solid rgba(96,165,250,.35);display:grid;place-items:center;margin:0 auto 12px;font-size:27px}
  h1{font-family:var(--disp);font-size:clamp(1.6rem,4.4vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .cmeta{font-size:13.5px;color:var(--tx2)}
  .cbadges{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px}
  .cb{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:800;letter-spacing:.04em;border-radius:999px;padding:5px 13px;border:1px solid}
  .cb.grn{color:var(--grn);border-color:rgba(52,211,153,.4);background:rgba(52,211,153,.09)}
  .cb.blu{color:var(--blu);border-color:rgba(96,165,250,.4);background:rgba(96,165,250,.09)}
  section{padding:14px 0 46px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:700px){.grid{grid-template-columns:1fr}}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:20px 22px}
  .card h2{font-family:var(--disp);font-size:12.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
  .vlist{display:flex;flex-direction:column;gap:8px}
  .vrow{display:flex;justify-content:space-between;align-items:center;gap:10px;border:1px solid var(--line2);border-radius:11px;padding:10px 13px;text-decoration:none;color:var(--tx);transition:.15s;font-size:13px}
  .vrow:hover{border-color:var(--gold)}
  .vrow b{font-family:var(--disp);font-weight:700}
  .vrow span{font-size:11px;color:var(--tx3);white-space:nowrap}
  .rankbar{display:flex;flex-direction:column;gap:8px}
  .rrow{display:flex;align-items:center;gap:10px;font-size:12.5px}
  .rname{flex:0 0 130px;font-weight:700;font-family:var(--disp);font-size:12px}
  .rtrack{flex:1;height:8px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
  .rfill{height:100%;background:linear-gradient(90deg,var(--blu),#3b82f6);border-radius:99px}
  .rcnt{flex:0 0 26px;text-align:right;color:var(--tx2);font-weight:700}
  .claim{margin-top:16px;border:1.5px dashed rgba(251,191,36,.45);border-radius:16px;padding:18px 20px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:linear-gradient(160deg,rgba(251,191,36,.06),var(--ink))}
  .claim b{font-family:var(--disp);font-size:14px;display:block;margin-bottom:3px}
  .claim p{font-size:12px;color:var(--tx2);line-height:1.55}
  .cbtn{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:10px;padding:10px 17px;font-weight:800;font-size:12.5px;text-decoration:none;white-space:nowrap}
  .memberlink{margin-top:16px;border:1.5px solid rgba(52,211,153,.4);border-radius:16px;padding:16px 20px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:rgba(52,211,153,.06)}
  .memberlink b{font-family:var(--disp);font-size:13.5px;color:var(--grn)}
  footer{border-top:1px solid var(--line2);padding:26px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
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
          <Link href="/companies" className="topcta">All companies →</Link>
        </div>
      </div>

      <div className="chero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <div className="cico">🏢</div>
          <h1>{name}</h1>
          <p className="cmeta">Maritime employer · crew service records on ShipCrewFinder</p>
          <div className="cbadges">
            {crewCount > 0 ? <span className="cb grn">⚓ {crewCount} verified crew served with this company</span> : null}
            {vessels.length > 0 ? <span className="cb blu">🚢 {vessels.length} vessel{vessels.length === 1 ? "" : "s"} on record</span> : null}
          </div>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="grid">
            <div className="card">
              <h2>Fleet — reported by crew</h2>
              {vessels.length > 0 ? (
                <div className="vlist">
                  {vessels.slice(0, 10).map((vs) => (
                    <Link key={vs.slug} href={"/vessel/" + vs.slug} className="vrow"><b>🚢 {vs.vessel_name}</b><span>{vs.cnt} record{vs.cnt === 1 ? "" : "s"} →</span></Link>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "var(--tx3)" }}>No vessel records yet.</p>
              )}
            </div>

            <div className="card">
              <h2>Crew ranks served</h2>
              {ranks.length > 0 ? (
                <div className="rankbar">
                  {ranks.slice(0, 8).map((r) => (
                    <div key={r.rank} className="rrow">
                      <span className="rname">{r.rank}</span>
                      <span className="rtrack"><span className="rfill" style={{ width: Math.min(100, (r.cnt / Math.max(1, crewCount)) * 100) + "%", display: "block" }}></span></span>
                      <span className="rcnt">{r.cnt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "var(--tx3)" }}>No rank data yet.</p>
              )}
              <p style={{ fontSize: 10.5, color: "var(--tx3)", marginTop: 12, lineHeight: 1.5 }}>
                Data comes from {contractCount} sea service record{contractCount === 1 ? "" : "s"} logged by verified seafarers.
              </p>
            </div>
          </div>

          {memberCo ? (
            <div className="memberlink">
              <b>✓ This company is on ShipCrewFinder</b>
              <Link href={"/careers/" + (memberCo.careers_slug as string)} className="cbtn">View careers page →</Link>
            </div>
          ) : (
            <div className="claim">
              <div style={{ minWidth: 0 }}>
                <b>Is this your company?</b>
                <p>Claim your free profile — get a careers page, post jobs, receive applications and reach {crewCount > 0 ? "the crew who already know you plus " : ""}thousands of verified seafarers.</p>
              </div>
              <Link href="/signup/company" className="cbtn">Claim free profile →</Link>
            </div>
          )}

          <div className="claim" style={{ borderStyle: "solid", borderColor: "var(--line2)", background: "transparent" }}>
            <div style={{ minWidth: 0 }}>
              <b>⚓ Served with {name}?</b>
              <p>Add the contract to your Sea Time Tracker — it builds your CV and this employer&apos;s verified record.</p>
            </div>
            <Link href="/seatime" className="cbtn">Add my sea time →</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <Link href="/">ShipCrewFinder</Link> · <Link href="/companies">All companies</Link> · <Link href="/jobs">Maritime jobs</Link> · <Link href="/salary">Salary Index</Link>
        </div>
      </footer>
    </>
  );
}
