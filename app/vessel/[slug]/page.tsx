import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

type VesselSummary = {
  vessel_name: string | null;
  vessel_type: string | null;
  dwt: number | null;
  main_engine: string | null;
  crew_count: number;
  contract_count: number;
  first_service: string | null;
  last_service: string | null;
  ranks: { rank: string; cnt: number }[];
  companies: string[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: name + " — Vessel Info & Verified Crew | ShipCrewFinder",
    description:
      "Vessel profile of " + name + ": type, DWT, main engine and verified seafarers who served on board. Maritime crew data on ShipCrewFinder.",
  };
}

export default async function VesselPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const clean = (slug || "").trim().toLowerCase();
  if (!clean || clean.length < 3 || clean.length > 90) notFound();

  const supabase = await createClient();
  const { data } = await supabase.rpc("get_vessel_summary", { vslug: clean });

  const v = (data || null) as VesselSummary | null;
  if (!v || !v.vessel_name || !v.crew_count) notFound();

  const fmtDwt = (n: number | null) => (n ? n.toLocaleString("en-US") + " DWT" : null);
  const fmtYear = (d: string | null) => (d ? new Date(d + "T00:00:00").getFullYear() : null);

  const slugify = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const serviceSpan = (() => {
    const a = fmtYear(v.first_service);
    const b = fmtYear(v.last_service);
    if (!a) return null;
    return a === b ? String(a) : a + " – " + b;
  })();

  const shipLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: v.vessel_name,
    vehicleConfiguration: v.vessel_type || undefined,
    url: "https://shipcrewfinder.com/vessel/" + clean,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(shipLd) }} />
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;
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
  .vhero{position:relative;padding:30px 0 20px;overflow:hidden;text-align:center}
  .aur{position:absolute;width:460px;height:460px;top:-250px;left:50%;transform:translateX(-50%);border-radius:50%;filter:blur(90px);opacity:.42;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .vico{width:62px;height:62px;border-radius:17px;background:rgba(251,191,36,.13);border:1.5px solid rgba(251,191,36,.35);display:grid;place-items:center;margin:0 auto 12px;font-size:27px}
  h1{font-family:var(--disp);font-size:clamp(1.6rem,4.4vw,2.5rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:8px}
  .vmeta{font-size:13.5px;color:var(--tx2)}
  .vbadges{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px}
  .vb{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:800;letter-spacing:.04em;border-radius:999px;padding:5px 13px;border:1px solid;color:var(--gold);border-color:rgba(251,191,36,.4);background:rgba(251,191,36,.09)}
  .vb.grn{color:var(--grn);border-color:rgba(52,211,153,.4);background:rgba(52,211,153,.09)}
  section{padding:14px 0 46px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:700px){.grid{grid-template-columns:1fr}}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:20px 22px}
  .card h2{font-family:var(--disp);font-size:12.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
  .rows{display:flex;flex-direction:column}
  .row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--line2);font-size:13px}
  .row:last-child{border-bottom:none}
  .row span{color:var(--tx3)}
  .row b{font-weight:600;text-align:right}
  .rankbar{display:flex;flex-direction:column;gap:8px}
  .rrow{display:flex;align-items:center;gap:10px;font-size:12.5px}
  .rname{flex:0 0 130px;font-weight:700;font-family:var(--disp);font-size:12px}
  .rtrack{flex:1;height:8px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
  .rfill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold2));border-radius:99px}
  .rcnt{flex:0 0 26px;text-align:right;color:var(--tx2);font-weight:700}
  .colist{display:flex;flex-wrap:wrap;gap:8px}
  .colink{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--tx);border:1px solid var(--line2);border-radius:10px;padding:8px 13px;text-decoration:none;transition:.15s}
  .colink:hover{border-color:var(--gold);color:var(--gold)}
  .ctas{margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
  @media(max-width:700px){.ctas{grid-template-columns:1fr}}
  .cta{border:1.5px solid var(--line);border-radius:16px;padding:18px 20px;background:linear-gradient(160deg,rgba(251,191,36,.07),var(--ink))}
  .cta b{font-family:var(--disp);font-size:14px;display:block;margin-bottom:5px}
  .cta p{font-size:12px;color:var(--tx2);line-height:1.55;margin-bottom:12px}
  .cbtn{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:10px;padding:9px 15px;font-weight:800;font-size:12.5px;text-decoration:none}
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
          <Link href="/vessels" className="topcta">All vessels →</Link>
        </div>
      </div>

      <div className="vhero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <div className="vico">🚢</div>
          <h1>{v.vessel_name}</h1>
          <p className="vmeta">
            {v.vessel_type || "Vessel"}
            {fmtDwt(v.dwt) ? " · " + fmtDwt(v.dwt) : ""}
          </p>
          <div className="vbadges">
            <span className="vb grn">⚓ {v.crew_count} verified crew served on board</span>
            {serviceSpan ? <span className="vb">Service records {serviceSpan}</span> : null}
          </div>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="grid">
            <div className="card">
              <h2>Vessel particulars</h2>
              <div className="rows">
                <div className="row"><span>Name</span><b>{v.vessel_name}</b></div>
                <div className="row"><span>Type</span><b>{v.vessel_type || "—"}</b></div>
                <div className="row"><span>DWT</span><b>{fmtDwt(v.dwt) || "—"}</b></div>
                <div className="row"><span>Main engine</span><b>{v.main_engine || "—"}</b></div>
                <div className="row"><span>Crew records</span><b>{v.contract_count} contracts · {v.crew_count} seafarers</b></div>
              </div>
              <p style={{ fontSize: 10.5, color: "var(--tx3)", marginTop: 10, lineHeight: 1.5 }}>
                Particulars are reported by verified crew members from their sea service records.
              </p>
            </div>

            <div className="card">
              <h2>Who served on board</h2>
              {v.ranks && v.ranks.length > 0 ? (
                <div className="rankbar">
                  {v.ranks.slice(0, 8).map((r) => (
                    <div key={r.rank} className="rrow">
                      <span className="rname">{r.rank}</span>
                      <span className="rtrack"><span className="rfill" style={{ width: Math.min(100, (r.cnt / v.crew_count) * 100) + "%", display: "block" }}></span></span>
                      <span className="rcnt">{r.cnt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "var(--tx3)" }}>No rank data yet.</p>
              )}
              {v.companies && v.companies.length > 0 ? (
                <div style={{ marginTop: 16 }}>
                  <h2 style={{ marginBottom: 10 }}>Operated / managed by</h2>
                  <div className="colist">
                    {v.companies.slice(0, 6).map((c) => (
                      <Link key={c} href={"/company/" + slugify(c)} className="colink">🏢 {c}</Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="ctas">
            <div className="cta">
              <b>⚓ Served on {v.vessel_name}?</b>
              <p>Add it to your Sea Time Tracker — your service builds your CV and this vessel&apos;s verified record.</p>
              <Link href="/seatime" className="cbtn">Add to my sea time →</Link>
            </div>
            <div className="cta">
              <b>🏢 Hiring crew with {v.vessel_type || "this vessel"} experience?</b>
              <p>Post a job — seafarers with matching vessel experience get notified instantly.</p>
              <Link href="/signup/company" className="cbtn">Post a job →</Link>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <Link href="/">ShipCrewFinder</Link> · <Link href="/vessels">All vessels</Link> · <Link href="/jobs">Maritime jobs</Link> · <Link href="/salary">Salary Index</Link>
        </div>
      </footer>
    </>
  );
}
