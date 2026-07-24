import Link from "next/link";
import { blogIndex } from "@/app/data/blog";
import SiteHeader from "@/app/components/site-header";

export const metadata = {
  title: "Maritime Industry Blog — ShipCrewFinder",
  description:
    "Insights, trends, and guides for seafarers, yacht crew, and maritime companies. Stay ahead with expert analysis from people who've worked at sea.",
  alternates: { canonical: "https://shipcrewfinder.com/blog" },
  openGraph: {
    title: "Maritime Industry Blog — ShipCrewFinder",
    description:
      "Insights, trends, and guides for seafarers, yacht crew, and maritime companies.",
    url: "https://shipcrewfinder.com/blog",
    type: "website",
  },
};

const cardAnchor = (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(251,191,36,.7)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.4" />
    <line x1="12" y1="7.4" x2="12" y2="20.5" />
    <line x1="7.5" y1="10.4" x2="16.5" y2="10.4" />
    <path d="M4.5 14.8c0 3.7 3.3 5.7 7.5 5.7s7.5-2 7.5-5.7" />
    <path d="M4.5 14.8l-1.6-1.2M4.5 14.8l2-.4" />
    <path d="M19.5 14.8l1.6-1.2M19.5 14.8l-2-.4" />
  </svg>
);

export default function BlogIndexPage() {
  const posts = blogIndex;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <style>{`
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --navy:#0d1030;--navy2:#141845;--ink:#050716;
    --gold:#fbbf24;--gold2:#e0a010;--line:rgba(251,191,36,.16);--line2:rgba(255,255,255,.08);
    --tx:#eef4fa;--tx2:#a8bdd2;--tx3:#6b83a0;
    --disp:var(--font-bricolage),sans-serif;--body:var(--font-jakarta),sans-serif;
  }
  body.light{
    --navy:#f2f4fb;--navy2:#ffffff;--ink:#ffffff;
    --tx:#0e1730;--tx2:#2e3c5e;--tx3:#57678a;
    --line:rgba(224,160,16,.4);--line2:rgba(15,25,60,.12);
  }
  body{font-family:var(--body);background:var(--navy);color:var(--tx);overflow-x:hidden}
  .wrap{max-width:1080px;margin:0 auto;padding:0 20px}
  .bl-hero{position:relative;padding:40px 0 26px;overflow:hidden}
  .aur{position:absolute;width:460px;height:460px;top:-230px;right:-120px;border-radius:50%;filter:blur(90px);opacity:.45;background:radial-gradient(circle,rgba(251,191,36,.3),transparent 65%);pointer-events:none}
  .back{display:inline-flex;align-items:center;gap:7px;color:var(--tx3);text-decoration:none;font-size:13px;font-weight:600;transition:.18s;margin-bottom:16px}
  .back:hover{color:var(--gold)}
  .tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);background:rgba(251,191,36,.09);border:1px solid var(--line);border-radius:8px;padding:5px 12px;margin-bottom:14px}
  h1{font-family:var(--disp);font-size:clamp(1.9rem,4.6vw,3rem);font-weight:800;line-height:1.08;letter-spacing:-.02em;margin-bottom:10px}
  h1 .g{color:var(--gold)}
  .sub{font-size:15px;color:var(--tx2);line-height:1.65;max-width:60ch}
  section{padding:22px 0 48px}
  .pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  @media(max-width:960px){.pgrid{grid-template-columns:1fr 1fr}}
  @media(max-width:620px){.pgrid{grid-template-columns:1fr}}
  .pcard{display:flex;flex-direction:column;background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:16px;overflow:hidden;text-decoration:none;color:var(--tx);transition:.2s}
  .pcard:hover{transform:translateY(-3px);border-color:var(--gold)}
  .phead{position:relative;height:120px;display:grid;place-items:center;background:linear-gradient(160deg,rgba(251,191,36,.09),transparent 60%),linear-gradient(165deg,var(--navy2),var(--ink));border-bottom:1px solid var(--line2);overflow:hidden}
  .phead::after{content:'';position:absolute;top:-20px;right:-20px;width:110px;height:110px;border-radius:50%;filter:blur(30px);background:rgba(251,191,36,.14)}
  .pbody{padding:18px 20px;display:flex;flex-direction:column;flex:1}
  .pmeta{display:flex;align-items:center;gap:8px;margin-bottom:10px}
  .pcat{font-size:9.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);border-radius:999px;padding:3px 10px}
  .pmin{font-size:11px;color:var(--tx3)}
  .ptitle{font-family:var(--disp);font-size:16px;font-weight:700;line-height:1.35;margin-bottom:8px}
  .pcard:hover .ptitle{color:var(--gold)}
  .pex{font-size:12.5px;color:var(--tx2);line-height:1.6;flex:1;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .pdate{font-size:11px;color:var(--tx3)}
  .empty{background:linear-gradient(165deg,var(--navy2),var(--ink));border:1px solid var(--line2);border-radius:18px;padding:40px;text-align:center;font-size:14px;color:var(--tx2)}
  footer{border-top:1px solid var(--line2);padding:30px 0;background:var(--ink);text-align:center;font-size:12.5px;color:var(--tx3)}
  footer a{color:var(--gold);text-decoration:none}
`}</style>

      <SiteHeader isLoggedIn={false} active="blog" />

      <div className="bl-hero">
        <div className="aur"></div>
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/" className="back">← Back to homepage</Link>
          <div style={{ height: 4 }} />
          <div className="tag">Blog</div>
          <h1>Maritime Industry <span className="g">Insights</span></h1>
          <p className="sub">
            Trends, guides, and analysis for seafarers, yacht crew, and maritime companies — from people who&apos;ve worked at sea.
          </p>
        </div>
      </div>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          {posts.length === 0 ? (
            <div className="empty">No articles yet. Check back soon.</div>
          ) : (
            <div className="pgrid">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="pcard">
                  <div className="phead">{cardAnchor}</div>
                  <div className="pbody">
                    <div className="pmeta">
                      <span className="pcat">{post.category}</span>
                      <span className="pmin">{post.readingMinutes} min read</span>
                    </div>
                    <div className="ptitle">{post.title}</div>
                    <p className="pex">{post.excerpt}</p>
                    <span className="pdate">{fmtDate(post.date)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap">
          © 2026 ShipCrewFinder · <Link href="/salary">Salary Index</Link> ·{" "}
          <Link href="/jobs">Jobs</Link> · <Link href="/">Home</Link>
        </div>
      </footer>
    </>
  );
}
