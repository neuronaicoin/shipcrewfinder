import Link from "next/link";
import { SALARY_DATA, VESSELS, fmtK, LAST_UPDATED, type VesselKey } from "@/lib/data/salary";
import SalarySubmitForm from "@/app/components/salary-submit-form";

export const metadata = {
  title: "Seafarer Salary Index 2026 — Monthly Wages by Rank & Vessel Type | ShipCrewFinder",
  description:
    "What every maritime rank actually earns in 2026. Monthly basic wages for Master, Chief Engineer, officers, engineers and ratings across bulk carriers, tankers, container ships and LNG.",
};

const anchorSvg = (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.4" />
    <line x1="12" y1="7.4" x2="12" y2="20.5" />
    <line x1="7.5" y1="10.4" x2="16.5" y2="10.4" />
    <path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7" />
    <path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4" />
    <path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4" />
  </svg>
);

export default async function SalaryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const vesselParam = (sp.vessel || "") as VesselKey | "";
  const activeVessel: VesselKey | null = VESSELS.some((v) => v.key === vesselParam)
    ? (vesselParam as VesselKey)
    : null;

  const showCols = activeVessel ? VESSELS.filter((v) => v.key === activeVessel) : VESSELS;

  const depts: ("Deck" | "Engine" | "Ratings")[] = ["Deck", "Engine", "Ratings"];

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
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:1080px;margin:0 auto;padding:0 20px}
  .top{position:sticky;top:0;z-index:50;background:rgba(10,37,64,.85);backdrop-filter:blur(14px);border-bottom:1px solid var(--line2)}
  .top-in{display:flex;align-items:center;justify-content:space-between;height:66px;gap:10px}
  .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--tx)}
  .logo-ic{width:38px;height:38px;border-radius:10px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:18px;font-weight:700}
  .logo b span{color:var(--gold)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:14px;text-decoration:none;transition:.18s;padding:11px 20px;cursor:pointer;border:none;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink)}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s}
  .back:hover{color:var(--gold)}
  .hero{position:relative;padding:44px 0 36px;overflow:hidden}
  .aur{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none;opacity:.5}
  .aur1{width:520px;height:520px;top:-200px;right:-100px;background:radial-gradient(circle,rgba(251,191,36,.28),transparent 65%)}
  .badge{display:inline-flex;align-items:center;gap:9px;background:rgba(251,191,36,.09);border:1px solid var(--line);border-radius:22px;padding:7px 16px;font-size:12.5px;font-weight:600;color:var(--gold);margin-bottom:20px}
  h1{font-family:var(--disp);font-size:clamp(2rem,4.8vw,3.2rem);font-weight:800;line-height:1.08;letter-spacing:-.02em;margin-bottom:14px}
  h1 .g{color:var(--gold)}
  .sub{font-size:15.5px;color:var(--tx2);line-height:1.65;max-width:62ch;margin-bottom:26px}
  .hcards{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:620px;margin-bottom:20px}
  @media(max-width:560px){.hcards{grid-template-columns:1fr}}
  .hcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line);border-radius:16px;padding:20px;text-decoration:none;color:var(--tx);display:block;transition:.2s}
  .hcard:hover{transform:translateY(-3px);border-color:var(--gold)}
  .hcard .hl{font-size:12px;color:var(--tx3);margin-bottom:6px}
  .hcard .hr{font-family:var(--disp);font-weight:800;font-size:26px;color:var(--gold)}
  .hcard .hn{font-family:var(--disp);font-weight:700;font-size:16px;margin-bottom:2px}
  .toolstrip{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;background:rgba(52,211,153,.07);border:1px solid rgba(52,211,153,.25);border-radius:16px;padding:16px 20px;max-width:620px}
  .toolstrip b{font-family:var(--disp);font-size:14.5px;display:block;margin-bottom:3px}
  .toolstrip p{font-size:12.5px;color:var(--tx2)}
  .toolstrip .btn{white-space:nowrap}
  section{padding:44px 0}
  .filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
  .fpill{font-size:12.5px;font-weight:700;border-radius:999px;padding:8px 16px;text-decoration:none;border:1px solid var(--line2);color:var(--tx2);transition:.18s}
  .fpill:hover{border-color:var(--gold);color:var(--gold)}
  .fpill.on{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink);border-color:transparent}
  .dept{font-family:var(--disp);font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin:26px 0 10px}
  .tbl{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;overflow:hidden}
  .trow{display:grid;grid-template-columns:1.4fr repeat(var(--cols),1fr);align-items:center;padding:13px 18px;border-bottom:1px solid var(--line2);text-decoration:none;color:var(--tx);transition:.15s}
  .trow:last-child{border-bottom:none}
  a.trow:hover{background:rgba(251,191,36,.06)}
  .thead{background:rgba(255,255,255,.03)}
  .thead span{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--tx3);font-weight:700}
  .rname{font-family:var(--disp);font-weight:700;font-size:14.5px}
  .rng{font-size:13px;color:var(--tx2);text-align:right;font-variant-numeric:tabular-nums}
  .thead .rng{color:var(--tx3)}
  .go{color:var(--gold);font-size:11px;font-weight:700;margin-top:2px;display:block}
  .vguide{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:960px}
  @media(max-width:820px){.vguide{grid-template-columns:1fr}}
  .vg{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:24px;position:relative}
  .vg.hi{border-color:var(--line)}
  .vg .vtier{font-size:10.5px;font-weight:800;letter-spacing:.1em;color:var(--gold);margin-bottom:8px}
  .vg h3{font-family:var(--disp);font-size:18px;font-weight:800;margin-bottom:10px}
  .vg p{font-size:13px;color:var(--tx2);line-height:1.65;margin-bottom:10px}
  .vg p:last-child{margin-bottom:0}
  .vg .vk{color:var(--tx);font-weight:600}
  .sec-head{font-family:var(--disp);font-size:clamp(1.4rem,3.2vw,1.9rem);font-weight:800;letter-spacing:-.02em;margin-bottom:8px}
  .sec-sub2{font-size:13.5px;color:var(--tx2);line-height:1.6;max-width:66ch;margin-bottom:24px}
  .meth{background:rgba(251,191,36,.06);border:1px solid var(--line);border-radius:16px;padding:22px 26px;font-size:13px;color:var(--tx2);line-height:1.7;max-width:860px}
  .meth b{color:var(--tx);font-family:var(--disp)}
  .cta{background:linear-gradient(160deg,var(--navy2),var(--navy));border:1.5px solid var(--line);border-radius:20px;padding:30px;text-align:center;max-width:640px;margin:0 auto}
  .cta h2{font-family:var(--disp);font-size:22px;font-weight:800;margin-bottom:8px}
  .cta p{font-size:13.5px;color:var(--tx2);margin-bottom:18px;line-height:1.6}
  footer{border-top:1px solid var(--line2);padding:36px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
  @media(max-width:720px){
    .trow{grid-template-columns:1.2fr 1fr;padding:12px 14px}
    .trow .rng:not(:last-child){display:none}
    .thead span.hidem{display:none}
  }
`}</style>
<header className="top">
        <div className="wrap top-in">
          <Link className="logo" href="/">
            <span className="logo-ic">{anchorSvg}</span>
            <b>Ship<span>Crew</span>Finder</b>
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link className="btn btn-ghost" href="/jobs">Browse Jobs</Link>
            <Link className="btn btn-gold" href="/signup/crew">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <div className="hero">
        <div className="aur aur1"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/" className="back" style={{ marginBottom: 18, display: "inline-flex" }}>
            ← Back to homepage
          </Link>
          <div style={{ height: 6 }} />
          <div className="badge">SEAFARER SALARY INDEX · UPDATED {LAST_UPDATED.toUpperCase()}</div>
          <h1>What every rank <span className="g">actually earns</span> in 2026</h1>
          <p className="sub">
            Monthly basic wages for 15 maritime ranks across bulk carriers, tankers, container
            ships and LNG. Built from ITF frameworks, current market data and real listings on
            ShipCrewFinder — no agency spin.
          </p>
          <div className="hcards">
            <Link className="hcard" href="/salary/master">
              <div className="hl">Highest command rank</div>
              <div className="hn">Master</div>
              <div className="hr">$9k – 21k<span style={{ fontSize: 13, color: "var(--tx3)", fontWeight: 600 }}> /mo</span></div>
            </Link>
            <Link className="hcard" href="/salary/chief-engineer">
              <div className="hl">Highest engineering rank</div>
              <div className="hn">Chief Engineer</div>
              <div className="hr">$8.5k – 21k<span style={{ fontSize: 13, color: "var(--tx3)", fontWeight: 600 }}> /mo</span></div>
            </Link>
          </div>
          <div className="toolstrip">
            <div>
              <b>🧮 Salary tools</b>
              <p>Calculator, rank comparison and the full career ladder — interactive.</p>
            </div>
            <Link className="btn btn-gold" href="/salary/tools">Open tools →</Link>
          </div>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="filters">
            <Link href="/salary" className={`fpill ${!activeVessel ? "on" : ""}`}>All vessels</Link>
            {VESSELS.map((v) => (
              <Link
                key={v.key}
                href={`/salary?vessel=${v.key}`}
                className={`fpill ${activeVessel === v.key ? "on" : ""}`}
              >
                {v.label}
              </Link>
            ))}
          </div>

          {depts.map((dept) => (
            <div key={dept}>
              <div className="dept">{dept}</div>
              <div className="tbl" style={{ ["--cols" as string]: showCols.length }}>
                <div className="trow thead">
                  <span>Rank</span>
                  {showCols.map((v, i) => (
                    <span key={v.key} className={`rng ${i < showCols.length - 1 ? "hidem" : ""}`}>{v.label}</span>
                  ))}
                </div>
                {SALARY_DATA.filter((r) => r.dept === dept).map((r) => (
                  <Link key={r.slug} href={`/salary/${r.slug}`} className="trow">
                    <span>
                      <span className="rname">{r.rank}</span>
                      <span className="go">View details →</span>
                    </span>
                    {showCols.map((v) => (
                      <span key={v.key} className="rng">
                        ${fmtK(r.ranges[v.key].min)}–{fmtK(r.ranges[v.key].max)}
                      </span>
                    ))}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
<section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">Why vessel type changes everything</div>
          <p className="sec-sub2">
            Same rank, same certificate — up to double the pay. The difference is cargo risk,
            certification burden and how deep the qualified pool runs. Written from the engine
            room, not from a desk.
          </p>
          <div className="vguide">
            <div className="vg">
              <div className="vtier">THE BASELINE</div>
              <h3>Bulk Carrier</h3>
              <p>
                Coal, iron ore, grain — <span className="vk">low cargo risk, minimal extra
                certification</span>, and a huge supply of qualified crew. That combination sets
                the floor of the pay scale.
              </p>
              <p>
                The trade-off is honest: older tonnage is common, ports sit far from city
                centers, and loading means crane noise and dust. But port turnarounds are calmer,
                inspection pressure is lighter than tankers, and{" "}
                <span className="vk">it is the fastest lane to sea time and promotion</span> —
                which is why many careers start here.
              </p>
            </div>
            <div className="vg">
              <div className="vtier">THE MIDDLE GROUND</div>
              <h3>Container</h3>
              <p>
                Liner schedules measure port stays in <span className="vk">hours, not days</span>.
                There is no "we'll fix it alongside" — every repair happens at sea, on the move.
              </p>
              <p>
                The machinery is enormous: ultra-large container vessels run 11–12 cylinder main
                engines, backed by heavy generator capacity for thousands of reefer boxes. No
                explosive cargo means it pays under tankers — but the tempo and machinery stress
                put it <span className="vk">firmly above bulk</span>.
              </p>
            </div>
            <div className="vg hi">
              <div className="vtier">THE RISK PREMIUM</div>
              <h3>Tanker</h3>
              <p>
                Basic STCW is not enough — <span className="vk">Advanced Oil/Chemical Tanker
                Cargo Operations plus a flag-state endorsement</span> are mandatory before you
                sign on.
              </p>
              <p>
                And the work never stops at the berth: inert gas systems, steam turbine or FRAMO
                cargo pumps, boilers and vapor recovery all sit on the engine team — under
                constant OCIMF/SIRE inspection pressure. Add flammable and toxic cargo (H₂S,
                chemicals) where one static spark matters, and the premium explains itself.
              </p>
            </div>
            <div className="vg hi">
              <div className="vtier">THE TOP OF THE SCALE</div>
              <h3>LNG / LPG</h3>
              <p>
                IGC and IGF Code training, an advanced gas endorsement — and the hardest part:{" "}
                <span className="vk">accumulating the required sea time on gas tonnage</span> to
                even enter the pool.
              </p>
              <p>
                The cargo isn't just carried — it's reliquefied on board or burned in dual-fuel
                engines (ME-GI, X-DF), with cryogenic systems at −162°C leaving{" "}
                <span className="vk">zero tolerance for error</span>. Few officers can run this
                technology, and companies pay top of the market to keep the ones who can.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="meth">
            <b>Methodology.</b> Figures are monthly basic wages in USD, excluding overtime, leave
            pay and bonuses — actual take-home typically runs 15–25% higher with guaranteed
            overtime. Ranges are compiled from ITF/IBF wage frameworks, published 2026 market
            data and live listings on ShipCrewFinder. Upper bounds reflect premium operators and
            specialist tonnage; lower bounds reflect older vessels and budget operators. Updated
            quarterly. Last update: {LAST_UPDATED}.
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">Share your salary — anonymously</div>
          <p className="sec-sub2">
            Real figures from real seafarers make this index stronger than any agency report.
            Takes 20 seconds. Completely anonymous.
          </p>
          <div style={{ maxWidth: 720, background: "linear-gradient(165deg,var(--navy2),var(--ink))", border: "1px solid var(--line)", borderRadius: 20, padding: 26 }}>
            <SalarySubmitForm />
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta">
            <h2>Know what you're worth. Now get found.</h2>
            <p>
              Create a free verified profile and let companies come to you — with salary
              expectations set by real data, not agency talk.
            </p>
            <Link className="btn btn-gold" href="/signup/crew">⚓ Create free profile →</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/salary/tools">Salary Tools</Link> ·{" "}
          <Link href="/jobs">Browse jobs</Link> · <Link href="/">Home</Link>
        </div>
      </footer>
    </>
  );
}
