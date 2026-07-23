import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SALARY_DATA,
  VESSELS,
  getRankBySlug,
  fmtUsd,
  fmtK,
  overallRange,
  LAST_UPDATED,
} from "@/lib/data/salary";

export function generateStaticParams() {
  return SALARY_DATA.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getRankBySlug(slug);
  if (!r) return {};
  const o = overallRange(r);
  return {
    title: `${r.rank} Salary 2026 — ${fmtUsd(o.min)} to ${fmtUsd(o.max)}/month | ShipCrewFinder`,
    description: `How much does a ${r.rank} earn in 2026? Monthly basic wages from ${fmtUsd(o.min)} to ${fmtUsd(o.max)} across bulk carriers, tankers, container ships and LNG. Real market data, no agency spin.`,
  };
}

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

export default async function RankSalaryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getRankBySlug(slug);
  if (!r) notFound();

  const o = overallRange(r);
  const others = SALARY_DATA.filter((x) => x.slug !== r.slug && x.dept === r.dept);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much does a ${r.rank} earn per month in 2026?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A ${r.rank} earns between ${fmtUsd(o.min)} and ${fmtUsd(o.max)} per month in 2026, depending on vessel type and operator. On bulk carriers the typical range is ${fmtUsd(r.ranges.bulk.min)}–${fmtUsd(r.ranges.bulk.max)}, on tankers ${fmtUsd(r.ranges.tanker.min)}–${fmtUsd(r.ranges.tanker.max)}, and on LNG/LPG carriers ${fmtUsd(r.ranges.lng.min)}–${fmtUsd(r.ranges.lng.max)}. Figures are monthly basic wages excluding overtime.`,
        },
      },
      {
        "@type": "Question",
        name: `Which vessel type pays a ${r.rank} the most?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `LNG/LPG carriers pay the highest ${r.rank} salaries at ${fmtUsd(r.ranges.lng.min)}–${fmtUsd(r.ranges.lng.max)} per month, followed by tankers. Bulk carriers typically sit at the lower end of the scale.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:14px;text-decoration:none;transition:.18s;padding:11px 20px}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink)}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2)}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .crumb{padding:20px 0 0;font-size:12.5px;color:var(--tx3)}
  .crumb a{color:var(--tx3);text-decoration:none}
  .crumb a:hover{color:var(--gold)}
  .hero{position:relative;padding:28px 0 36px;overflow:hidden}
  .aur{position:absolute;width:460px;height:460px;top:-220px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.45;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .dtag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);background:rgba(251,191,36,.09);border:1px solid var(--line);border-radius:8px;padding:5px 12px;margin-bottom:14px}
  h1{font-family:var(--disp);font-size:clamp(1.9rem,4.6vw,3rem);font-weight:800;line-height:1.08;letter-spacing:-.02em;margin-bottom:10px}
  .bigrange{font-family:var(--disp);font-weight:800;font-size:clamp(1.5rem,3.6vw,2.2rem);color:var(--gold);margin-bottom:14px}
  .bigrange small{font-size:14px;color:var(--tx3);font-weight:600}
  .desc{font-size:15px;color:var(--tx2);line-height:1.7;max-width:64ch}
  section{padding:34px 0}
  .stitle{font-family:var(--disp);font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
  .vgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:13px}
  @media(max-width:560px){.vgrid{grid-template-columns:1fr}}
  .vcard{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;padding:20px}
  .vcard.hi{border-color:var(--gold)}
  .vcard .vl{font-size:12px;color:var(--tx3);margin-bottom:8px;display:flex;justify-content:space-between}
  .vcard .vl .tag{color:var(--gold);font-weight:700;font-size:10.5px;letter-spacing:.08em}
  .vcard .vr{font-family:var(--disp);font-weight:800;font-size:22px}
  .vcard .vr small{font-size:12px;color:var(--tx3);font-weight:600}
  .bar{height:6px;background:rgba(255,255,255,.06);border-radius:99px;margin-top:12px;overflow:hidden}
  .bar i{display:block;height:100%;background:linear-gradient(90deg,var(--gold2),var(--gold));border-radius:99px}
  .jobcta{background:linear-gradient(160deg,var(--navy2),var(--navy));border:1.5px solid var(--line);border-radius:18px;padding:24px 26px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
  .jobcta b{font-family:var(--disp);font-size:17px;display:block;margin-bottom:4px}
  .jobcta p{font-size:13px;color:var(--tx2)}
  .meth{background:rgba(251,191,36,.06);border:1px solid var(--line);border-radius:14px;padding:18px 22px;font-size:12.5px;color:var(--tx2);line-height:1.65}
  .others{display:flex;gap:8px;flex-wrap:wrap}
  .opill{font-size:12.5px;font-weight:700;border:1px solid var(--line2);border-radius:999px;padding:8px 15px;text-decoration:none;color:var(--tx2);transition:.18s}
  .opill:hover{border-color:var(--gold);color:var(--gold)}
  footer{border-top:1px solid var(--line2);padding:34px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
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

      <div className="wrap crumb">
        <Link href="/salary">Salary Index</Link> <span style={{ margin: "0 6px" }}>›</span> {r.rank}
      </div>

      <div className="hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <div className="dtag">{r.dept} department</div>
          <h1>{r.rank} salary in 2026</h1>
          <div className="bigrange">
            {fmtUsd(o.min)} – {fmtUsd(o.max)} <small>/ month basic</small>
          </div>
          <p className="desc">{r.desc}</p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stitle">By vessel type</div>
          <div className="vgrid">
            {VESSELS.map((v) => {
              const rng = r.ranges[v.key];
              const isTop = rng.max === o.max;
              const width = Math.round((rng.max / o.max) * 100);
              return (
                <div key={v.key} className={`vcard ${isTop ? "hi" : ""}`}>
                  <div className="vl">
                    <span>{v.label}</span>
                    {isTop && <span className="tag">HIGHEST</span>}
                  </div>
                  <div className="vr">
                    ${fmtK(rng.min)} – {fmtK(rng.max)} <small>/mo</small>
                  </div>
                  <div className="bar"><i style={{ width: `${width}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="jobcta">
            <div>
              <b>Open {r.rank} positions</b>
              <p>Verified companies are hiring on ShipCrewFinder right now — apply directly, zero commission.</p>
            </div>
            <Link
              className="btn btn-gold"
              href={`/jobs?rank=${encodeURIComponent(r.rank.toUpperCase())}`}
            >
              View {r.rank} jobs →
            </Link>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="meth">
            Figures are monthly basic wages in USD, excluding overtime and bonuses. Compiled from
            ITF/IBF frameworks, 2026 market data and live ShipCrewFinder listings. Upper bounds
            reflect premium operators and specialist tonnage. Last update: {LAST_UPDATED}.
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stitle">Other {r.dept.toLowerCase()} ranks</div>
          <div className="others">
            {others.map((x) => (
              <Link key={x.slug} href={`/salary/${x.slug}`} className="opill">
                {x.rank}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/salary">Salary Index</Link> ·{" "}
          <Link href="/jobs">Browse jobs</Link>
        </div>
      </footer>
    </>
  );
}
