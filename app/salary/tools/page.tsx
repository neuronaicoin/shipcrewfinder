"use client";

import Link from "next/link";
import { useState } from "react";
import { SALARY_DATA, VESSELS, fmtUsd, type VesselKey } from "@/lib/data/salary";

const EXP_LEVELS = [
  { key: "junior", label: "0–2 years in rank", lo: 0, hi: 0.45 },
  { key: "mid", label: "3–5 years in rank", lo: 0.25, hi: 0.75 },
  { key: "senior", label: "5+ years in rank", lo: 0.55, hi: 1 },
] as const;

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

export default function SalaryToolsPage() {
  const [calcRank, setCalcRank] = useState("chief-engineer");
  const [calcVessel, setCalcVessel] = useState<VesselKey>("bulk");
  const [calcExp, setCalcExp] = useState<(typeof EXP_LEVELS)[number]["key"]>("mid");

  const [cmpA, setCmpA] = useState("second-engineer");
  const [cmpB, setCmpB] = useState("chief-engineer");
  const [cmpVessel, setCmpVessel] = useState<VesselKey>("bulk");

  const [ladderDept, setLadderDept] = useState<"Deck" | "Engine">("Engine");
  const [ladderVessel, setLadderVessel] = useState<VesselKey>("bulk");

  const calcData = SALARY_DATA.find((r) => r.slug === calcRank)!;
  const calcRange = calcData.ranges[calcVessel];
  const exp = EXP_LEVELS.find((e) => e.key === calcExp)!;
  const span = calcRange.max - calcRange.min;
  const estMin = Math.round((calcRange.min + span * exp.lo) / 100) * 100;
  const estMax = Math.round((calcRange.min + span * exp.hi) / 100) * 100;

  const a = SALARY_DATA.find((r) => r.slug === cmpA)!;
  const b = SALARY_DATA.find((r) => r.slug === cmpB)!;
  const aR = a.ranges[cmpVessel];
  const bR = b.ranges[cmpVessel];
  const aMid = (aR.min + aR.max) / 2;
  const bMid = (bR.min + bR.max) / 2;
  const diff = Math.round(Math.abs(bMid - aMid));
  const higher = bMid >= aMid ? b : a;

  const ladderRanks = SALARY_DATA.filter(
    (r) => r.dept === ladderDept && !["eto"].includes(r.slug)
  )
    .slice()
    .reverse();
  const ladderMax = Math.max(...ladderRanks.map((r) => r.ranges[ladderVessel].max));

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
  .wrap{max-width:920px;margin:0 auto;padding:0 20px}
  .top{position:sticky;top:0;z-index:50;background:rgba(10,37,64,.85);backdrop-filter:blur(14px);border-bottom:1px solid var(--line2)}
  .top-in{display:flex;align-items:center;justify-content:space-between;height:66px}
  .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--tx)}
  .logo-ic{width:38px;height:38px;border-radius:10px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:18px;font-weight:700}
  .logo b span{color:var(--gold)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:14px;text-decoration:none;transition:.18s;padding:11px 20px;cursor:pointer;border:none;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2);background:transparent}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .hero{padding:52px 0 8px}
  h1{font-family:var(--disp);font-size:clamp(1.8rem,4.4vw,2.8rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:10px}
  h1 .g{color:var(--gold)}
  .sub{font-size:14.5px;color:var(--tx2);line-height:1.65;max-width:60ch}
  section{padding:34px 0}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:20px;padding:26px}
  .stag{font-family:var(--disp);font-size:12px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
  .stitle{font-family:var(--disp);font-size:20px;font-weight:800;margin-bottom:16px}
  .row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:18px}
  @media(max-width:640px){.row{grid-template-columns:1fr}}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--tx3);margin-bottom:7px}
  select{width:100%;background:var(--navy);border:1px solid var(--line2);color:var(--tx);border-radius:11px;padding:12px 13px;font-family:var(--body);font-size:13.5px;font-weight:500;outline:none;cursor:pointer}
  select:focus{border-color:var(--gold)}
  .result{background:rgba(251,191,36,.07);border:1px solid var(--line);border-radius:16px;padding:22px;text-align:center}
  .rlabel{font-size:12px;color:var(--tx3);margin-bottom:6px}
  .rnum{font-family:var(--disp);font-weight:800;font-size:clamp(1.6rem,4vw,2.4rem);color:var(--gold)}
  .rnum small{font-size:14px;color:var(--tx3);font-weight:600}
  .rnote{font-size:11.5px;color:var(--tx3);margin-top:8px}
  .cgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px}
  @media(max-width:560px){.cgrid{grid-template-columns:1fr}}
  .cbox{background:rgba(255,255,255,.03);border:1px solid var(--line2);border-radius:14px;padding:18px;text-align:center}
  .cbox.hi{border-color:var(--gold)}
  .cbox .cn{font-family:var(--disp);font-weight:700;font-size:15px;margin-bottom:6px}
  .cbox .cr{font-family:var(--disp);font-weight:800;font-size:20px;color:var(--gold)}
  .cbox .cr small{font-size:11px;color:var(--tx3);font-weight:600}
  .verdict{background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.28);border-radius:12px;padding:14px 18px;font-size:13.5px;text-align:center;color:var(--tx2)}
  .verdict b{color:var(--grn)}
  .lrow{display:grid;grid-template-columns:110px 1fr 118px;gap:12px;align-items:center;padding:9px 0}
  @media(max-width:560px){.lrow{grid-template-columns:90px 1fr 100px}}
  .lname{font-family:var(--disp);font-weight:700;font-size:13px}
  .lbar{height:22px;background:rgba(255,255,255,.05);border-radius:8px;overflow:hidden;position:relative}
  .lbar i{position:absolute;top:0;bottom:0;border-radius:8px;background:linear-gradient(90deg,rgba(251,191,36,.35),var(--gold))}
  .lval{font-size:12px;color:var(--tx2);text-align:right;font-variant-numeric:tabular-nums}
  .pills{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
  .pill{font-size:12px;font-weight:700;border-radius:999px;padding:7px 14px;border:1px solid var(--line2);color:var(--tx2);cursor:pointer;background:transparent;font-family:var(--body);transition:.18s}
  .pill.on{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink);border-color:transparent}
  .foot-note{font-size:11.5px;color:var(--tx3);margin-top:14px;line-height:1.6}
  footer{border-top:1px solid var(--line2);padding:32px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <header className="top">
        <div className="wrap top-in">
          <Link className="logo" href="/">
            <span className="logo-ic">{anchorSvg}</span>
            <b>Ship<span>Crew</span>Finder</b>
          </Link>
          <div style={{ display: "flex", gap: 10 }}>
            <Link className="btn btn-ghost" href="/salary">Salary Index</Link>
            <Link className="btn btn-gold" href="/signup/crew">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <div className="hero">
        <div className="wrap">
          <h1>Salary <span className="g">tools</span></h1>
          <p className="sub">
            Estimate your worth, compare ranks side by side, and see the full career ladder —
            all built on the ShipCrewFinder Salary Index.
          </p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="card">
            <div className="stag">Tool 01</div>
            <div className="stitle">Salary calculator</div>
            <div className="row">
              <div>
                <label>Rank</label>
                <select value={calcRank} onChange={(e) => setCalcRank(e.target.value)}>
                  {SALARY_DATA.map((r) => (
                    <option key={r.slug} value={r.slug}>{r.rank}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Vessel type</label>
                <select value={calcVessel} onChange={(e) => setCalcVessel(e.target.value as VesselKey)}>
                  {VESSELS.map((v) => (
                    <option key={v.key} value={v.key}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Experience in rank</label>
                <select value={calcExp} onChange={(e) => setCalcExp(e.target.value as typeof calcExp)}>
                  {EXP_LEVELS.map((x) => (
                    <option key={x.key} value={x.key}>{x.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="result">
              <div className="rlabel">Estimated monthly basic wage — {calcData.rank}, {VESSELS.find(v => v.key === calcVessel)!.label}</div>
              <div className="rnum">
                {fmtUsd(estMin)} – {fmtUsd(estMax)} <small>/mo</small>
              </div>
              <div className="rnote">
                Full market range for this rank: {fmtUsd(calcRange.min)} – {fmtUsd(calcRange.max)}. Excludes overtime and bonuses.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="card">
            <div className="stag">Tool 02</div>
            <div className="stitle">Compare two ranks</div>
            <div className="row">
              <div>
                <label>Rank A</label>
                <select value={cmpA} onChange={(e) => setCmpA(e.target.value)}>
                  {SALARY_DATA.map((r) => (
                    <option key={r.slug} value={r.slug}>{r.rank}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Rank B</label>
                <select value={cmpB} onChange={(e) => setCmpB(e.target.value)}>
                  {SALARY_DATA.map((r) => (
                    <option key={r.slug} value={r.slug}>{r.rank}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Vessel type</label>
                <select value={cmpVessel} onChange={(e) => setCmpVessel(e.target.value as VesselKey)}>
                  {VESSELS.map((v) => (
                    <option key={v.key} value={v.key}>{v.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="cgrid">
              <div className={`cbox ${aMid >= bMid ? "hi" : ""}`}>
                <div className="cn">{a.rank}</div>
                <div className="cr">{fmtUsd(aR.min)} – {fmtUsd(aR.max)} <small>/mo</small></div>
              </div>
              <div className={`cbox ${bMid > aMid ? "hi" : ""}`}>
                <div className="cn">{b.rank}</div>
                <div className="cr">{fmtUsd(bR.min)} – {fmtUsd(bR.max)} <small>/mo</small></div>
              </div>
            </div>
            <div className="verdict">
              {diff === 0 ? (
                <>Both ranks earn roughly the same on this vessel type.</>
              ) : (
                <><b>{higher.rank}</b> earns about <b>{fmtUsd(diff)}/month more</b> on average on this vessel type.</>
              )}
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="card">
            <div className="stag">Tool 03</div>
            <div className="stitle">Career ladder</div>
            <div className="pills">
              <button className={`pill ${ladderDept === "Engine" ? "on" : ""}`} onClick={() => setLadderDept("Engine")}>Engine</button>
              <button className={`pill ${ladderDept === "Deck" ? "on" : ""}`} onClick={() => setLadderDept("Deck")}>Deck</button>
              {VESSELS.map((v) => (
                <button
                  key={v.key}
                  className={`pill ${ladderVessel === v.key ? "on" : ""}`}
                  onClick={() => setLadderVessel(v.key)}
                >
                  {v.label}
                </button>
              ))}
            </div>
            {ladderRanks.map((r) => {
              const rng = r.ranges[ladderVessel];
              const left = (rng.min / ladderMax) * 100;
              const width = ((rng.max - rng.min) / ladderMax) * 100;
              return (
                <div key={r.slug} className="lrow">
                  <span className="lname">{r.rank}</span>
                  <div className="lbar">
                    <i style={{ left: `${left}%`, width: `${width}%` }} />
                  </div>
                  <span className="lval">${(rng.min / 1000).toFixed(1)}k–{(rng.max / 1000).toFixed(1)}k</span>
                </div>
              );
            })}
            <div className="foot-note">
              Each bar shows the min–max monthly basic wage for the selected vessel type. The
              gap between entry rank and top rank is the real story: this career transforms
              earnings, not just improves them.
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          Built on the <Link href="/salary">ShipCrewFinder Salary Index</Link> · Updated July 2026 ·{" "}
          <Link href="/jobs">Browse jobs</Link>
        </div>
      </footer>
    </>
  );
}
