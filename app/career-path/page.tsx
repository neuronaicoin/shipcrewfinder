import Link from "next/link";
import { SALARY_DATA } from "@/lib/data/salary";

export const metadata = {
  title: "Maritime Career Path: From Cadet to Master or Chief Engineer | ShipCrewFinder",
  description:
    "See the full deck and engine officer career progression — typical years at each rank, and real 2026 salary ranges. Free, interactive career path visualizer.",
};

const g = (slug: string) => SALARY_DATA.find((s) => s.slug === slug);

const DECK_PATH = [
  { rank: "Deck Cadet", years: "0", slug: null, note: "Training aboard, building sea time toward first watchkeeping certificate." },
  { rank: "3rd Officer", years: "0–2", slug: "third-officer", note: "First officer rank — navigation watches, safety duties." },
  { rank: "2nd Officer", years: "2–4", slug: "second-officer", note: "Primary navigation and voyage planning responsibility." },
  { rank: "Chief Officer", years: "5–8", slug: "chief-officer", note: "Cargo operations, deck department, direct link to the Master." },
  { rank: "Master", years: "9+", slug: "master", note: "Full command — navigation, cargo, crew, and regulatory compliance." },
];

const ENGINE_PATH = [
  { rank: "Engine Cadet", years: "0", slug: null, note: "Training aboard, building sea time toward first engineering certificate." },
  { rank: "4th Engineer", years: "0–2", slug: "fourth-engineer", note: "Entry engineering rank — auxiliary machinery, watchkeeping." },
  { rank: "3rd Engineer", years: "2–4", slug: "third-engineer", note: "Broader machinery responsibility, growing technical scope." },
  { rank: "2nd Engineer", years: "5–7", slug: "second-engineer", note: "Manages day-to-day engine room operations and department." },
  { rank: "Chief Engineer", years: "8+", slug: "chief-engineer", note: "Full responsibility for all mechanical and electrical systems." },
];

function fmtRange(slug: string | null) {
  const entry = slug ? g(slug) : null;
  if (!entry) return null;
  const low = entry.ranges.bulk.min;
  const high = entry.ranges.lng.max;
  return `$${low.toLocaleString()}–$${high.toLocaleString()}`;
}

export default function CareerPathPage() {
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
  .wrap{max-width:900px;margin:0 auto;padding:0 20px}
  .top{position:sticky;top:0;z-index:50;background:rgba(10,37,64,.85);backdrop-filter:blur(14px);border-bottom:1px solid var(--line2)}
  .top-in{display:flex;align-items:center;justify-content:space-between;height:64px}
  .logo{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--tx)}
  .logo-ic{width:34px;height:34px;border-radius:9px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:17px;font-weight:700}
  .logo b span{color:var(--gold)}
  .btn{display:inline-flex;align-items:center;gap:7px;border-radius:10px;font-weight:700;font-size:13.5px;text-decoration:none;padding:10px 18px;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13}
  .hero{padding:44px 0 8px;text-align:center;position:relative;overflow:hidden}
  .aur{position:absolute;width:480px;height:480px;top:-220px;left:50%;transform:translateX(-50%);border-radius:50%;filter:blur(100px);opacity:.4;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  h1{font-family:var(--disp);font-size:clamp(1.9rem,4.6vw,2.7rem);font-weight:800;line-height:1.12;letter-spacing:-.02em;margin-bottom:14px;position:relative}
  .sub{font-size:15px;color:var(--tx2);line-height:1.6;max-width:52ch;margin:0 auto 28px;position:relative}
  .tabs{display:flex;gap:8px;justify-content:center;margin-bottom:8px;position:relative}
  .tab{background:var(--navy2);border:1.5px solid var(--line2);color:var(--tx2);border-radius:11px;padding:11px 22px;font-weight:800;font-size:13.5px;cursor:pointer;font-family:var(--body)}
  .tab.on{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-color:var(--gold)}
  section{padding:30px 0 60px}
  .track{position:relative}
  .track::before{content:'';position:absolute;left:27px;top:36px;bottom:36px;width:3px;background:linear-gradient(var(--line2),var(--gold),var(--line2));opacity:.5}
  @media(max-width:640px){.track::before{left:21px}}
  .step{display:flex;gap:20px;position:relative;padding-bottom:34px}
  @media(max-width:640px){.step{gap:14px}}
  .step:last-child{padding-bottom:0}
  .dot{width:56px;height:56px;border-radius:16px;background:linear-gradient(160deg,var(--navy2),var(--ink));border:2px solid var(--line);display:grid;place-items:center;flex-shrink:0;position:relative;z-index:2;font-family:var(--disp);font-weight:800;font-size:13px;color:var(--gold)}
  @media(max-width:640px){.dot{width:44px;height:44px;font-size:11px}}
  .step.final .dot{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-color:var(--gold)}
  .content{flex:1;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:18px 20px;min-width:0}
  .step.final .content{border-color:rgba(251,191,36,.4)}
  .rank-name{font-family:var(--disp);font-weight:800;font-size:17px;margin-bottom:4px}
  .years{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.06em;color:var(--tx3);margin-bottom:8px}
  .years b{color:var(--grn)}
  .note{font-size:13px;color:var(--tx2);line-height:1.55;margin-bottom:10px}
  .sal{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:var(--gold);background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.3);border-radius:999px;padding:5px 12px}
  .disclaimer{font-size:11.5px;color:var(--tx3);text-align:center;margin-top:30px;line-height:1.6}
  .cta{margin-top:44px;background:linear-gradient(150deg,rgba(251,191,36,.09),var(--navy2) 45%);border:1px solid rgba(251,191,36,.3);border-radius:20px;padding:30px 26px;text-align:center}
  .cta h2{font-family:var(--disp);font-size:1.5rem;font-weight:800;margin-bottom:10px}
  .cta p{font-size:13.5px;color:var(--tx2);margin-bottom:18px}
  footer{border-top:1px solid var(--line2);padding:26px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <div className="top">
        <div className="wrap top-in">
          <Link href="/" className="logo">
            <span className="logo-ic">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2.4"/><line x1="12" y1="7.4" x2="12" y2="20.5"/><line x1="7.5" y1="10.4" x2="16.5" y2="10.4"/><path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7"/></svg>
            </span>
            <b>Ship<span>Crew</span>Finder</b>
          </Link>
          <Link href="/signup" className="btn btn-gold">Join Free</Link>
        </div>
      </div>

      <div className="hero">
        <div className="aur"></div>
        <h1>Your Maritime Career Path</h1>
        <p className="sub">From cadet to command — typical progression timelines and real 2026 salary ranges for every rank, deck and engine.</p>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <input type="radio" name="track" id="tab-deck" defaultChecked style={{ display: "none" }} />
          <input type="radio" name="track" id="tab-engine" style={{ display: "none" }} />

          <style>{`
            #tab-deck:checked ~ .tabsel #lbl-deck{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-color:var(--gold)}
            #tab-engine:checked ~ .tabsel #lbl-engine{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-color:var(--gold)}
            #tab-deck:checked ~ .panels #panel-deck{display:block}
            #tab-deck:checked ~ .panels #panel-engine{display:none}
            #tab-engine:checked ~ .panels #panel-engine{display:block}
            #tab-engine:checked ~ .panels #panel-deck{display:none}
          `}</style>

          <div className="tabsel tabs">
            <label htmlFor="tab-deck" id="lbl-deck" className="tab on">⚓ Deck Department</label>
            <label htmlFor="tab-engine" id="lbl-engine" className="tab">🔧 Engine Department</label>
          </div>

          <div className="panels" style={{ marginTop: 30 }}>
            <div id="panel-deck">
              <div className="track">
                {DECK_PATH.map((s, i) => (
                  <div className={`step ${i === DECK_PATH.length - 1 ? "final" : ""}`} key={s.rank}>
                    <div className="dot">{i === DECK_PATH.length - 1 ? "⚓" : i + 1}</div>
                    <div className="content">
                      <div className="rank-name">{s.rank}</div>
                      <div className="years">Typically <b>{s.years} years</b> at sea to reach</div>
                      <p className="note">{s.note}</p>
                      {fmtRange(s.slug) && <span className="sal">💰 {fmtRange(s.slug)}/mo</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div id="panel-engine" style={{ display: "none" }}>
              <div className="track">
                {ENGINE_PATH.map((s, i) => (
                  <div className={`step ${i === ENGINE_PATH.length - 1 ? "final" : ""}`} key={s.rank}>
                    <div className="dot">{i === ENGINE_PATH.length - 1 ? "⚓" : i + 1}</div>
                    <div className="content">
                      <div className="rank-name">{s.rank}</div>
                      <div className="years">Typically <b>{s.years} years</b> at sea to reach</div>
                      <p className="note">{s.note}</p>
                      {fmtRange(s.slug) && <span className="sal">💰 {fmtRange(s.slug)}/mo</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="disclaimer">
            Timelines are general industry patterns and vary by company, flag state, and individual sea time —
            not a guarantee. Salary ranges span bulk carrier to LNG carrier rates for 2026, from ShipCrewFinder&apos;s{" "}
            <Link href="/salary" style={{ color: "var(--gold)" }}>Salary Index</Link>.
          </p>

          <div className="cta">
            <h2>See where you stand today</h2>
            <p>Check your current salary against the market — free, 10 seconds, no signup.</p>
            <Link href="/salary-check" className="btn btn-gold">Check My Salary →</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/salary">Salary Index</Link> · <Link href="/jobs">Jobs</Link> · <Link href="/blog">Blog</Link>
        </div>
      </footer>
    </>
  );
}
