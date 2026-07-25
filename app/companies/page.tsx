import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Maritime Companies — Crew Experience Records | ShipCrewFinder",
  description:
    "Browse maritime employers with verified seafarer service records. See which companies crew have served with — real records on ShipCrewFinder.",
};

type CompanyIndexRow = {
  company_name: string;
  slug: string;
  crew_count: number;
};

export default async function CompaniesPage() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_worked_company_index");
  const companies = (Array.isArray(data) ? data : []) as CompanyIndexRow[];

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;--blu:#60a5fa;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:880px;margin:0 auto;padding:0 20px}
  .top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 0;flex-wrap:wrap}
  .logo{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--tx)}
  .logo .ic{width:32px;height:32px;border-radius:9px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:16px;font-weight:700}
  .logo b span{color:var(--gold)}
  .topcta{display:inline-flex;align-items:center;gap:7px;border-radius:11px;font-weight:700;font-size:12.5px;padding:9px 15px;color:var(--tx);border:1px solid var(--line2);text-decoration:none;transition:.18s}
  .topcta:hover{border-color:var(--gold);color:var(--gold)}
  .hero{position:relative;padding:28px 0 16px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-240px;right:-100px;border-radius:50%;filter:blur(90px);opacity:.4;background:radial-gradient(circle,rgba(96,165,250,.28),transparent 65%);pointer-events:none}
  h1{font-family:var(--disp);font-size:clamp(1.6rem,4vw,2.4rem);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:6px}
  .sub{font-size:13.5px;color:var(--tx2)}
  section{padding:14px 0 46px}
  .cgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:11px}
  @media(max-width:560px){.cgrid{grid-template-columns:1fr}}
  .ccard{display:flex;justify-content:space-between;align-items:center;gap:10px;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:14px;padding:15px 17px;text-decoration:none;color:var(--tx);transition:.18s}
  .ccard:hover{border-color:var(--blu);transform:translateY(-2px)}
  .ccard b{font-family:var(--disp);font-size:14px;font-weight:700;display:block}
  .ccnt{font-size:10.5px;font-weight:800;color:var(--grn);border:1px solid rgba(52,211,153,.35);background:rgba(52,211,153,.08);border-radius:999px;padding:4px 10px;white-space:nowrap}
  .claim{margin-top:20px;border:1.5px dashed rgba(251,191,36,.45);border-radius:16px;padding:18px 20px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:linear-gradient(160deg,rgba(251,191,36,.06),var(--ink))}
  .claim b{font-family:var(--disp);font-size:14px;display:block;margin-bottom:3px}
  .claim p{font-size:12px;color:var(--tx2);line-height:1.55}
  .cbtn{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:10px;padding:10px 17px;font-weight:800;font-size:12.5px;text-decoration:none;white-space:nowrap}
  .empty{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px dashed rgba(96,165,250,.4);border-radius:18px;padding:36px 24px;text-align:center;font-size:13.5px;color:var(--tx2);line-height:1.7}
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
          <Link href="/vessels" className="topcta">Vessels →</Link>
        </div>
      </div>

      <div className="hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <h1>🏢 Maritime companies — <span style={{ color: "var(--blu)" }}>crew experience records</span></h1>
          <p className="sub">Employers verified seafarers have served with, reported from real sea service logs.</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          {companies.length === 0 ? (
            <div className="empty">
              No company records yet.<br />
              Add your contracts (with the company field) in the Sea Time Tracker — employers appear here automatically.
            </div>
          ) : (
            <div className="cgrid">
              {companies.map((c) => (
                <Link key={c.slug} href={"/company/" + c.slug} className="ccard">
                  <b>🏢 {c.company_name}</b>
                  <span className="ccnt">⚓ {c.crew_count}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="claim">
            <div style={{ minWidth: 0 }}>
              <b>Run a maritime company?</b>
              <p>Claim your free profile — careers page, job posts, direct applications from verified crew.</p>
            </div>
            <Link href="/signup/company" className="cbtn">Claim free profile →</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <Link href="/">ShipCrewFinder</Link> · <Link href="/vessels">All vessels</Link> · <Link href="/jobs">Maritime jobs</Link>
        </div>
      </footer>
    </>
  );
}
