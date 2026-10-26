import Link from 'next/link';
import { getToolSeo, toolPath, toolFullTitle, TOOL_SEO_BY_SLUG, SITE_URL } from '@/lib/tool-seo';

// Server component rendered under each /tools/<slug> page (via its layout.tsx).
// Adds crawlable "about / how to use / FAQ / related" content plus JSON-LD.
// Styling reuses the Crew Toolkit's dark navy + gold card look.

function jsonLd(obj: unknown) {
  return { __html: JSON.stringify(obj).replace(/</g, '\\u003c') };
}

export default function ToolSeo({ slug }: { slug: string }) {
  const t = getToolSeo(slug);
  const url = `${SITE_URL}${toolPath(slug)}`;
  const width = t.width ?? 720;
  const isFree = t.free !== false;
  const related = t.related.map((s) => TOOL_SEO_BY_SLUG[s]).filter(Boolean);

  const appLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t.name,
    headline: toolFullTitle(t),
    description: t.description,
    url,
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: t.category,
    operatingSystem: 'Web',
    isAccessibleForFree: isFree,
    inLanguage: 'en',
    audience: { '@type': 'Audience', audienceType: 'Seafarers, ship officers and shipping companies' },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
  if (isFree) {
    appLd.offers = { '@type': 'Offer', price: '0', priceCurrency: 'USD' };
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Crew Toolkit', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: t.name, item: url },
    ],
  };

  return (
    <section className="tseo" aria-label={`About the ${t.name}`}>
      <style>{`
        .tseo{background:#0d1030;color:#eef4fa;padding:8px 0 calc(64px + env(safe-area-inset-bottom,0px))}
        .tseo *{box-sizing:border-box}
        .tseo-wrap{margin:0 auto;padding:0 18px}
        .tseo-crumb ol{list-style:none;display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:12px;color:#6b83a0;margin:0 0 14px;padding:0}
        .tseo-crumb a{color:#a8bdd2;text-decoration:none;font-weight:600}
        .tseo-crumb a:hover{color:#fbbf24}
        .tseo-crumb [aria-current]{color:#eef4fa;font-weight:600}
        .tseo-card{background:linear-gradient(165deg,#141845,#050716);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;margin-bottom:12px}
        .tseo-h{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:800;font-size:15px;color:#fbbf24;margin:0 0 10px;letter-spacing:-.01em}
        .tseo-p{font-size:12.5px;color:#a8bdd2;line-height:1.7;margin:0}
        .tseo-steps{list-style:none;margin:0;padding:0}
        .tseo-step{display:flex;gap:12px;margin-bottom:10px;align-items:flex-start}
        .tseo-step:last-child{margin-bottom:0}
        .tseo-num{width:24px;height:24px;border-radius:50%;background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.4);color:#fbbf24;font-weight:800;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .tseo-text{font-size:12.5px;color:#eef4fa;line-height:1.6;padding-top:2px;min-width:0}
        .tseo-faq{border-top:1px solid rgba(255,255,255,.07)}
        .tseo-faq:first-of-type{border-top:none}
        .tseo-faq summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding:12px 0;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:700;font-size:13.5px;color:#eef4fa;line-height:1.45}
        .tseo-faq summary::-webkit-details-marker{display:none}
        .tseo-faq summary::after{content:'+';color:#fbbf24;font-weight:800;font-size:16px;line-height:1.2;flex-shrink:0}
        .tseo-faq[open] summary::after{content:'\\2212'}
        .tseo-faq .tseo-p{padding:0 0 12px}
        .tseo-rel{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        .tseo-rel a{display:block;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;text-decoration:none;color:#eef4fa;transition:.18s}
        .tseo-rel a:hover{border-color:#fbbf24}
        .tseo-rel b{display:block;font-family:'Bricolage Grotesque',system-ui,sans-serif;font-weight:700;font-size:13px;margin-bottom:3px}
        .tseo-rel span{display:block;font-size:11px;color:#6b83a0}
        .tseo-all{display:inline-block;margin-top:12px;font-size:12.5px;font-weight:700;color:#fbbf24;text-decoration:none}
        @media(max-width:640px){
          .tseo-wrap{padding:0 16px}
          .tseo-card{padding:16px}
          .tseo-rel{grid-template-columns:1fr 1fr}
        }
        @media(max-width:380px){.tseo-rel{grid-template-columns:1fr}}
        @media print{.tseo{display:none}}
      `}</style>
      <div className="tseo-wrap" style={{ maxWidth: width }}>
        <nav className="tseo-crumb" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/tools">Crew Toolkit</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">{t.name}</li>
          </ol>
        </nav>

        <div className="tseo-card">
          <h2 className="tseo-h">About this tool</h2>
          <p className="tseo-p">{t.about}</p>
        </div>

        <div className="tseo-card">
          <h2 className="tseo-h">How to use it</h2>
          <ol className="tseo-steps">
            {t.steps.map((s, i) => (
              <li className="tseo-step" key={i}>
                <span className="tseo-num" aria-hidden="true">{i + 1}</span>
                <span className="tseo-text">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="tseo-card">
          <h2 className="tseo-h">Frequently asked questions</h2>
          {t.faqs.map((f, i) => (
            <details className="tseo-faq" key={i}>
              <summary>{f.q}</summary>
              <p className="tseo-p">{f.a}</p>
            </details>
          ))}
        </div>

        {related.length > 0 && (
          <div className="tseo-card">
            <h2 className="tseo-h">Related tools</h2>
            <div className="tseo-rel">
              {related.map((r) => (
                <Link key={r.slug} href={toolPath(r.slug)}>
                  <b>{r.name}</b>
                  <span>{r.category}</span>
                </Link>
              ))}
            </div>
            <Link href="/tools" className="tseo-all">All Crew Toolkit tools →</Link>
          </div>
        )}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(appLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqLd)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(crumbLd)} />
    </section>
  );
}
