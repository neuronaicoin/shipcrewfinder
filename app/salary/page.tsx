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
