import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Vessels — Ships & Verified Crew Records | ShipCrewFinder",
  description:
    "Browse vessels with verified seafarer service records: bulk carriers, tankers, container ships and more. Real crew data on ShipCrewFinder.",
};

type VesselIndexRow = {
  vessel_name: string;
  slug: string;
  vessel_type: string | null;
  crew_count: number;
};

export default async function VesselsPage() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_vessel_index");
  const vessels = (Array.isArray(data) ? data : []) as VesselIndexRow[];

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
  .wrap{max-width:880px;margin:0 auto;padding:0 20px}
  .top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 0;flex-wrap:wrap}
  .logo{display:flex;align-items:center;gap:9px;text-decoration:none;color:var(--tx)}
  .logo .ic{width:32px;height:32px;border-radius:9px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:16px;font-weight:700}
  .logo b span{color:var(--gold)}
  .topcta{display:inline-flex;align-items:center;gap:7px;border-radius:11px;font-weight:700;font-size:12.5px;padding:9px 15px;color:var(--tx);border:1px solid var(--line2);text-decoration:none;transition:.18s}
  .topcta:hover{border-color:var(--gold);color:var(--gold)}
  .hero{position:relative;padding:28px 0 16px;overflow:hidden}
  .aur{position:absolute;width:440px;height:440px;top:-240px;right:-100px;border-radius:50%;filter:blur(90px);opacity:.4;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  h1{font-family:var(--disp);font-size:clamp(1.6rem,4vw,2.4rem);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-bottom:6px}
  .sub{font-size:13.5px;color:var(--tx2)}
  section{padding:14px 0 46px}
  .vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:11px}
  @media(max-width:560px){.vgrid{grid-template-columns:1fr}}
  .vcard{display:flex;justify-content:space-between;align-items:center;gap:10px;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:14px;padding:15px 17px;text-decoration:none;color:var(--tx);transition:.18s}
  .vcard:hover{border-color:var(--gold);transform:translateY(-2px)}
  .vcard b{font-family:var(--disp);font-size:14px;font-weight:700;display:block;margin-bottom:3px}
  .vcard p{font-size:11.5px;color:var(--tx3)}
  .vcnt{font-size:10.5px;font-weight:800;color:var(--grn);border:1px solid rgba(52,211,153,.35);background:rgba(52,211,153,.08);border-radius:999px;padding:4px 10px;white-space:nowrap}
  .empty{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1.5px dashed rgba(251,191,36,.4);border-radius:18px;padding:36px 24px;text-align:center;font-size:13.5px;color:var(--tx2);line-height:1.7}
  .ebtn{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:11px;padding:11px 19px;font-weight:800;font-size:13px;text-decoration:none;margin-top:14px}
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
          <Link href="/companies" className="topcta">Companies →</Link>
        </div>
      </div>

      <div className="hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <h1>🚢 Vessels with <span style={{ color: "var(--gold)" }}>verified crew records</span></h1>
          <p className="sub">Every vessel below carries real sea service records from verified seafarers.</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          {vessels.length === 0 ? (
            <div className="empty">
              No vessel records yet — be the first.<br />
              Log your contracts in the Sea Time Tracker and your vessels appear here automatically.
              <div><Link href="/seatime" className="ebtn">⚓ Add my sea time →</Link></div>
            </div>
          ) : (
            <div className="vgrid">
              {vessels.map((v) => (
                <Link key={v.slug} href={"/vessel/" + v.slug} className="vcard">
                  <span style={{ minWidth: 0 }}>
                    <b>🚢 {v.vessel_name}</b>
                    <p>{v.vessel_type || "Vessel"}</p>
                  </span>
                  <span className="vcnt">⚓ {v.crew_count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">
          <Link href="/">ShipCrewFinder</Link> · <Link href="/companies">All companies</Link> · <Link href="/jobs">Maritime jobs</Link>
        </div>
      </footer>
    </>
  );
}
