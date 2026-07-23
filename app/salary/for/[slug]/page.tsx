import Link from "next/link";
import { notFound } from "next/navigation";
import { NATIONALITIES, getNationalityBySlug, NATIONALITY_REPORT_NOTE } from "@/lib/data/nationalities";
import { SALARY_DATA, fmtK, LAST_UPDATED } from "@/lib/data/salary";

export function generateStaticParams() {
  return NATIONALITIES.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const n = getNationalityBySlug(slug);
  if (!n) return {};
  return {
    title: `${n.nationality} Seafarer Salaries 2026 — Wages, Ranks & Hiring Guide | ShipCrewFinder`,
    description: `${n.nationality} seafarer salaries in 2026 by rank and vessel type. ${n.headline} Wage data, strong ranks, fleet deployment and hiring guidance for companies.`,
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

export default async function NationalitySalaryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const n = getNationalityBySlug(slug);
  if (!n) notFound();

  const strongRankData = n.strongRanks
    .map((rankName) => SALARY_DATA.find((r) => r.rank === rankName))
    .filter(Boolean);

  const others = NATIONALITIES.filter((x) => x.slug !== n.slug);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: n.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Salary Index", item: "https://shipcrewfinder.com/salary" },
      { "@type": "ListItem", position: 2, name: `${n.nationality} Seafarers`, item: `https://shipcrewfinder.com/salary/for/${n.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
  .top-in{display:flex;align-items:center;justify-content:space-between;height:66px;gap:10px}
  .logo{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--tx)}
  .logo-ic{width:38px;height:38px;border-radius:10px;background:linear-gradient(145deg,var(--gold),var(--gold2));display:grid;place-items:center}
  .logo b{font-family:var(--disp);font-size:18px;font-weight:700}
  .logo b span{color:var(--gold)}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;font-weight:700;font-size:14px;text-decoration:none;transition:.18s;padding:11px 20px}
  .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--ink)}
  .btn-gold:hover{transform:translateY(-2px)}
  .btn-ghost{color:var(--tx);border:1px solid var(--line2)}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s}
  .back:hover{color:var(--gold)}
  .hero{position:relative;padding:30px 0 34px;overflow:hidden}
  .aur{position:absolute;width:460px;height:460px;top:-220px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.45;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .flagrow{display:flex;align-items:center;gap:12px;margin-bottom:12px}
  .flagbig{font-size:38px;line-height:1}
  .rank-tag{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);background:rgba(251,191,36,.09);border:1px solid var(--line);border-radius:8px;padding:5px 12px}
  h1{font-family:var(--disp);font-size:clamp(1.8rem,4.4vw,2.8rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:10px}
  .headline{font-size:15px;color:var(--tx2);line-height:1.65;max-width:64ch;margin-bottom:20px}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:640px}
  @media(max-width:640px){.stats{grid-template-columns:1fr}}
  .stat{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:14px;padding:16px 18px}
  .stat .sn{font-family:var(--disp);font-weight:800;font-size:20px;color:var(--gold)}
  .stat .sl{font-size:11px;color:var(--tx3);margin-top:4px;line-height:1.4}
  section{padding:32px 0}
  .stitle{font-family:var(--disp);font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
  .prose p{font-size:14px;color:var(--tx2);line-height:1.75;margin-bottom:14px;max-width:74ch}
  .prose p:last-child{margin-bottom:0}
  .tbl{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;overflow:hidden}
  .trow{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr 1fr;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line2);text-decoration:none;color:var(--tx);transition:.15s}
  .trow:last-child{border-bottom:none}
  a.trow:hover{background:rgba(251,191,36,.06)}
  .thead{background:rgba(255,255,255,.03)}
  .thead span{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--tx3);font-weight:700}
  .rname{font-family:var(--disp);font-weight:700;font-size:13.5px}
  .rng{font-size:12px;color:var(--tx2);text-align:right;font-variant-numeric:tabular-nums}
  .thead .rng{color:var(--tx3)}
  @media(max-width:720px){
    .trow{grid-template-columns:1.2fr 1fr 1fr}
    .trow .rng:nth-child(4),.trow .rng:nth-child(5){display:none}
  }
  .fleet{background:rgba(251,191,36,.06);border:1px solid var(--line);border-radius:14px;padding:18px 22px;font-size:13.5px;color:var(--tx2);line-height:1.7}
  .fleet b{color:var(--tx)}
  .faqbox{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:14px;padding:20px 22px;margin-bottom:12px}
  .faqbox .q{font-family:var(--disp);font-weight:700;font-size:15px;margin-bottom:8px}
  .faqbox .a{font-size:13.5px;color:var(--tx2);line-height:1.7}
  .cta2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:640px){.cta2{grid-template-columns:1fr}}
  .ctacard{background:linear-gradient(160deg,var(--navy2),var(--navy));border:1.5px solid var(--line);border-radius:18px;padding:24px;text-align:center}
  .ctacard b{font-family:var(--disp);font-size:16px;display:block;margin-bottom:6px}
  .ctacard p{font-size:12.5px;color:var(--tx2);margin-bottom:16px;line-height:1.6}
  .others{display:flex;gap:8px;flex-wrap:wrap}
  .opill{font-size:12.5px;font-weight:700;border:1px solid var(--line2);border-radius:999px;padding:8px 15px;text-decoration:none;color:var(--tx2);transition:.18s;display:inline-flex;align-items:center;gap:6px}
  .opill:hover{border-color:var(--gold);color:var(--gold)}
  .note{font-size:11.5px;color:var(--tx3);line-height:1.6;max-width:74ch}
  footer{border-top:1px solid var(--line2);padding:32px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>
      <header className="top">
        <div className="wrap top-in">
          <Link className="logo" href="/">
            <span className="logo-ic">{anchorSvg}</span>
            <b>Ship<span>Crew</span>Finder</b>
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link className="btn btn-ghost" href="/salary">Salary Index</Link>
            <Link className="btn btn-gold" href="/signup/crew">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <div className="hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <div style={{ paddingTop: 20, marginBottom: 16 }}>
            <Link href="/salary" className="back">← Back to Salary Index</Link>
          </div>
          <div className="flagrow">
            <span className="flagbig">{n.flag}</span>
            <span className="rank-tag">{n.globalRank}</span>
          </div>
          <h1>{n.nationality} seafarer salaries in 2026</h1>
          <p className="headline">{n.headline}</p>
          <div className="stats">
            <div className="stat">
              <div className="sn">{n.officers}</div>
              <div className="sl">Officers supplied to the world fleet</div>
            </div>
            <div className="stat">
              <div className="sn">{n.ratings}</div>
              <div className="sl">Ratings supplied to the world fleet</div>
            </div>
            <div className="stat">
              <div className="sn">{n.strongRanks.length}</div>
              <div className="sl">Ranks where this pool is strongest</div>
            </div>
          </div>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stitle">For {n.nationality} seafarers</div>
          <div className="prose">
            {n.seafarerNotes.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stitle">Strongest ranks — salary ranges 2026</div>
          <div className="tbl">
            <div className="trow thead">
              <span>Rank</span>
              <span className="rng">Bulk</span>
              <span className="rng">Tanker</span>
              <span className="rng">Container</span>
              <span className="rng">LNG/LPG</span>
            </div>
            {strongRankData.map((r) => (
              <Link key={r!.slug} href={`/salary/${r!.slug}`} className="trow">
                <span className="rname">{r!.rank}</span>
                <span className="rng">${fmtK(r!.ranges.bulk.min)}–{fmtK(r!.ranges.bulk.max)}</span>
                <span className="rng">${fmtK(r!.ranges.tanker.min)}–{fmtK(r!.ranges.tanker.max)}</span>
                <span className="rng">${fmtK(r!.ranges.container.min)}–{fmtK(r!.ranges.container.max)}</span>
                <span className="rng">${fmtK(r!.ranges.lng.min)}–{fmtK(r!.ranges.lng.max)}</span>
              </Link>
            ))}
          </div>
          <p className="note" style={{ marginTop: 10 }}>
            Monthly basic wages in USD, excluding overtime. Full 15-rank tables on the{" "}
            <Link href="/salary" style={{ color: "var(--gold)" }}>Salary Index</Link>.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stitle">Fleet deployment</div>
          <div className="fleet">
            <b>Where {n.nationality} crew serve:</b> {n.fleets}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stitle">For companies hiring {n.nationality} crew</div>
          <div className="prose">
            {n.companyNotes.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stitle">Frequently asked questions</div>
          {n.faq.map((f, i) => (
            <div key={i} className="faqbox">
              <div className="q">{f.q}</div>
              <div className="a">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta2">
            <div className="ctacard">
              <b>⚓ {n.nationality} seafarer?</b>
              <p>Create a free verified profile and let companies find you directly — zero commission, ever.</p>
              <Link className="btn btn-gold" href="/signup/crew">Create free profile →</Link>
            </div>
            <div className="ctacard">
              <b>🏢 Hiring {n.nationality} crew?</b>
              <p>Search verified profiles by rank, availability and vessel experience — first month free.</p>
              <Link className="btn btn-ghost" href="/signup/company" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>Start hiring →</Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="stitle">Other nationalities</div>
          <div className="others">
            {others.map((x) => (
              <Link key={x.slug} href={`/salary/for/${x.slug}`} className="opill">
                <span>{x.flag}</span> {x.nationality}
              </Link>
            ))}
          </div>
          <p className="note" style={{ marginTop: 18 }}>{NATIONALITY_REPORT_NOTE} Last update: {LAST_UPDATED}.</p>
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/salary">Salary Index</Link> ·{" "}
          <Link href="/salary/tools">Salary Tools</Link> · <Link href="/jobs">Browse jobs</Link>
        </div>
      </footer>
    </>
  );
}
