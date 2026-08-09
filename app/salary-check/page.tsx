import Link from "next/link";
import { SALARY_DATA, VESSELS, type VesselKey } from "@/lib/data/salary";

export const metadata = {
  title: "How Does Your Salary Compare? — Free Seafarer Salary Check | ShipCrewFinder",
  description:
    "Compare your salary against real 2026 market ranges for your rank and vessel type — free, anonymous, instant.",
};

export default async function SalaryCheckPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const rankSlug = sp.rank || "";
  const vesselKey = (sp.vessel || "") as VesselKey | "";
  const salaryRaw = sp.salary || "";
  const salary = salaryRaw ? Number(salaryRaw) : null;

  const rankData = SALARY_DATA.find((r) => r.slug === rankSlug) || null;
  const vesselData = VESSELS.find((v) => v.key === vesselKey) || null;
  const range = rankData && vesselKey ? rankData.ranges[vesselKey as VesselKey] : null;

  const hasResult = !!(rankData && vesselData && range && salary && salary > 0);

  let resultLabel = "";
  let resultCls = "";
  let position = 50;
  let resultNote = "";

  if (hasResult && range && salary) {
    if (salary < range.min) {
      resultLabel = "Below Market";
      resultCls = "res-low";
      position = 4;
      const gap = Math.round(((range.min - salary) / range.min) * 100);
      resultNote = `Your salary is roughly ${gap}% below the typical starting range for this rank and vessel type.`;
    } else if (salary > range.max) {
      resultLabel = "Above Market";
      resultCls = "res-high";
      position = 96;
      resultNote = "You're earning above the typical range — a strong position for this rank and vessel type.";
    } else {
      const pct = Math.round(((salary - range.min) / (range.max - range.min)) * 100);
      position = Math.max(6, Math.min(94, pct));
      if (pct < 33) {
        resultLabel = "Lower Third of Range";
        resultCls = "res-mid-low";
        resultNote = "You're in the lower part of the typical pay range — there may be room to negotiate on your next contract.";
      } else if (pct < 67) {
        resultLabel = "Middle of Range";
        resultCls = "res-mid";
        resultNote = "You're right around the typical middle of the market for this rank and vessel type.";
      } else {
        resultLabel = "Upper Third of Range";
        resultCls = "res-mid-high";
        resultNote = "You're in the upper part of the typical pay range — a solid position for this rank and vessel type.";
      }
    }
  }

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;--red:#f87171;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:680px;margin:0 auto;padding:0 20px}
  .top{position:sticky;top:0;z-index:50;background:rgba(10,37,64,.85);backdrop-filter:blur(14px);border-bottom:1px solid var(--line2)}
  .top-in{display:flex;align-items:center;justify-content:space-between;height:66px;gap:10px}
  .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--tx)}
  .logo-ic{width:38px;height:38px;border-radius:10px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:18px;font-weight:700}
  .logo b span{color:var(--gold)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:14px;text-decoration:none;transition:.18s;padding:11px 20px;cursor:pointer;border:none;font-family:var(--body)}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink)}
  .btn-gold:hover{transform:translateY(-2px)}
  .hero{position:relative;padding:48px 0 20px;overflow:hidden;text-align:center}
  .aur{position:absolute;width:520px;height:520px;top:-220px;left:50%;transform:translateX(-50%);border-radius:50%;filter:blur(100px);opacity:.4;background:radial-gradient(circle,rgba(52,211,153,.3),transparent 65%);pointer-events:none}
  .badge{display:inline-flex;align-items:center;gap:9px;background:rgba(52,211,153,.09);border:1px solid rgba(52,211,153,.3);border-radius:22px;padding:7px 16px;font-size:12.5px;font-weight:700;color:var(--grn);margin-bottom:20px}
  h1{font-family:var(--disp);font-size:clamp(1.9rem,5vw,2.7rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:14px}
  h1 .g{color:var(--gold)}
  .sub{font-size:15px;color:var(--tx2);line-height:1.6;max-width:48ch;margin:0 auto 30px}
  section{padding:10px 0 60px}
  .card{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:22px;padding:30px 28px;box-shadow:0 8px 30px rgba(0,0,0,.3)}
  label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tx3);margin-bottom:8px}
  select,input[type=number]{width:100%;background:var(--navy);border:1.5px solid var(--line2);color:var(--tx);border-radius:12px;padding:13px 15px;font-family:var(--body);font-size:15px;outline:none;margin-bottom:18px}
  select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 15px center;padding-right:36px}
  select:focus,input:focus{border-color:var(--gold)}
  .btnfull{width:100%;padding:15px;font-size:15.5px;margin-top:6px}
  .resultwrap{margin-top:28px;padding-top:28px;border-top:1px solid var(--line2)}
  .resulthead{text-align:center;margin-bottom:24px}
  .resultbadge{display:inline-block;font-family:var(--disp);font-weight:800;font-size:20px;border-radius:14px;padding:10px 24px;margin-bottom:10px}
  .res-low{background:rgba(239,68,68,.12);color:var(--red);border:1.5px solid rgba(239,68,68,.4)}
  .res-mid-low{background:rgba(251,191,36,.12);color:var(--gold);border:1.5px solid rgba(251,191,36,.4)}
  .res-mid{background:rgba(52,211,153,.12);color:var(--grn);border:1.5px solid rgba(52,211,153,.4)}
  .res-mid-high{background:rgba(52,211,153,.16);color:var(--grn);border:1.5px solid rgba(52,211,153,.5)}
  .res-high{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border:1.5px solid var(--gold)}
  .resultnote{font-size:13.5px;color:var(--tx2);line-height:1.6;max-width:40ch;margin:0 auto}
  .gaugewrap{margin:26px 0 10px;position:relative;padding-top:26px}
  .gaugebar{height:14px;border-radius:999px;background:linear-gradient(90deg,#f87171,#fbbf24,#34d399,#34d399);position:relative}
  .gaugemarker{position:absolute;top:-8px;width:4px;height:30px;background:#fff;border-radius:4px;box-shadow:0 0 0 3px rgba(255,255,255,.2),0 2px 8px rgba(0,0,0,.4);transform:translateX(-50%)}
  .gaugelabels{display:flex;justify-content:space-between;font-size:11px;color:var(--tx3);margin-top:8px;font-weight:600}
  .ctacard{background:linear-gradient(150deg,rgba(251,191,36,.09),var(--navy2) 45%);border:1px solid rgba(251,191,36,.3);border-radius:18px;padding:22px;margin-top:26px;text-align:center}
  .ctacard p{font-size:13px;color:var(--tx2);margin-bottom:14px;line-height:1.55}
  .again{display:block;text-align:center;font-size:12.5px;color:var(--tx3);text-decoration:none;margin-top:16px}
  .again:hover{color:var(--gold)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <div className="top">
        <div className="wrap">
          <div className="top-in">
            <Link href="/" className="logo">
              <div className="logo-ic">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0b0e13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="2.4" />
                  <line x1="12" y1="7.4" x2="12" y2="20.5" />
                  <line x1="7.5" y1="10.4" x2="16.5" y2="10.4" />
                  <path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7" />
                  <path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4" />
                  <path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4" />
                </svg>
              </div>
              <b>Ship<span>Crew</span>Finder</b>
            </Link>
            <Link href="/signup" className="btn btn-gold">Join Free</Link>
          </div>
        </div>
      </div>

      <div className="hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <span className="badge">💰 Free · Anonymous · Instant</span>
          <h1>How Does Your <span className="g">Salary</span> Compare?</h1>
          <p className="sub">
            Check your monthly wage against real 2026 market ranges for your rank and vessel type — takes 10 seconds.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="card">
            <form method="get">
              <label htmlFor="rank">Your Rank</label>
              <select id="rank" name="rank" required defaultValue={rankSlug}>
                <option value="" disabled>Select your rank</option>
                {SALARY_DATA.map((r) => (
                  <option key={r.slug} value={r.slug}>{r.rank}</option>
                ))}
              </select>

              <label htmlFor="vessel">Vessel Type</label>
              <select id="vessel" name="vessel" required defaultValue={vesselKey}>
                <option value="" disabled>Select vessel type</option>
                {VESSELS.map((v) => (
                  <option key={v.key} value={v.key}>{v.label}</option>
                ))}
              </select>

              <label htmlFor="salary">Your Monthly Salary (USD)</label>
              <input id="salary" name="salary" type="number" min="0" step="50" required defaultValue={salaryRaw} placeholder="e.g. 6500" />

              <button type="submit" className="btn btn-gold btnfull">Check My Salary →</button>
            </form>

            {hasResult ? (
              <div className="resultwrap">
                <div className="resulthead">
                  <div className={`resultbadge ${resultCls}`}>{resultLabel}</div>
                  <p className="resultnote">{resultNote}</p>
                </div>

                <div className="gaugewrap">
                  <div className="gaugebar">
                    <div className="gaugemarker" style={{ left: `${position}%` }}></div>
                  </div>
                  <div className="gaugelabels">
                    <span>${range!.min.toLocaleString("en-US")}</span>
                    <span>${range!.max.toLocaleString("en-US")}</span>
                  </div>
                </div>

                <div className="ctacard">
                  <p>
                    Want the full breakdown by nationality, contract length, and real-time market alerts when your rank&apos;s pay range changes?
                  </p>
                  <Link href="/signup" className="btn btn-gold">Create Free Profile →</Link>
                </div>

                <Link href="/salary-check" className="again">← Check another rank</Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/salary">Full Salary Index</Link> · <Link href="/jobs">Jobs</Link>
        </div>
      </footer>
    </>
  );
}
