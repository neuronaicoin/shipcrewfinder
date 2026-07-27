import type { Metadata } from "next";
import Link from "next/link";

type SP = Promise<Record<string, string | undefined>>;

const clean = (sp: Record<string, string | undefined>) => {
  const r = (sp.r || "CHIEF ENGINEER").slice(0, 28).toUpperCase();
  const s = (sp.s || "$8,500 – $11,500").slice(0, 24);
  const v = (sp.v || "per month · international fleet").slice(0, 44);
  return { r, s, v };
};

const cardUrl = (r: string, s: string, v: string) =>
  `/api/card/salary?r=${encodeURIComponent(r)}&s=${encodeURIComponent(s)}&v=${encodeURIComponent(v)}`;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const { r, s, v } = clean(sp);
  const title = `💰 ${r} salary 2026: ${s} | ShipCrewFinder Salary Index`;
  const description =
    "Seafarer salary benchmarks for 15 ranks across bulk, tanker, container and LNG tonnage — from ShipCrewFinder, the maritime career platform built at sea.";
  const img = `https://shipcrewfinder.com${cardUrl(r, s, v)}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: img, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img],
    },
  };
}

export default async function SalarySharePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const { r, s, v } = clean(sp);

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--navy:#0d1030;--navy2:#141845;--ink:#050716;--gold:#fbbf24;--gold2:#e0a010;
    --line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);--tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;--grn:#34d399;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif}
  body{font-family:var(--body);background:var(--navy);color:var(--tx);min-height:100vh}
  .sw{max-width:640px;margin:0 auto;padding:34px 18px 50px;display:flex;flex-direction:column;align-items:center;gap:22px;text-align:center}
  .slogo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--tx);font-family:var(--disp);font-weight:800;font-size:19px}
  .slogo .ic{width:38px;height:38px;border-radius:10px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center;font-size:19px}
  .slogo span{color:var(--gold)}
  .scard{width:100%;border:1.5px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.45)}
  .scard img{display:block;width:100%;height:auto}
  .stitle{font-family:var(--disp);font-size:clamp(1.3rem,4vw,1.8rem);font-weight:800;line-height:1.2}
  .stitle b{color:var(--grn)}
  .ssub{font-size:14px;color:var(--tx2);line-height:1.65;max-width:46ch}
  .sbtns{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
  .sgold{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0b0e13;border-radius:12px;padding:14px 26px;font-weight:800;font-size:14.5px;text-decoration:none;box-shadow:0 6px 24px rgba(251,191,36,.3)}
  .sghost{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line2);color:var(--tx);border-radius:12px;padding:14px 22px;font-weight:700;font-size:14px;text-decoration:none}
  .sghost:hover{border-color:var(--gold);color:var(--gold)}
  .snote{font-size:11.5px;color:var(--tx3)}
`}</style>

      <div className="sw">
        <Link href="/" className="slogo"><span className="ic">⚓</span>Ship<span>Crew</span>Finder</Link>

        <div className="scard">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cardUrl(r, s, v)} alt={`${r} salary 2026: ${s}`} width={1200} height={630} />
        </div>

        <h1 className="stitle">Know your worth. <b>All 15 ranks benchmarked.</b></h1>
        <p className="ssub">
          The ShipCrewFinder Salary Index covers monthly wages by rank, vessel type and nationality —
          so you negotiate your next contract with real numbers, not guesses.
        </p>

        <div className="sbtns">
          <Link href="/salary" className="sgold">💰 See the full Salary Index</Link>
          <Link href="/signup/crew" className="sghost">⚓ Join free →</Link>
        </div>

        <p className="snote">Built at sea. Works at sea. · shipcrewfinder.com</p>
      </div>
    </>
  );
}
