import Link from "next/link";
import { blogIndex } from "@/app/data/blog";

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

export default function BlogIndexPage() {
  const posts = blogIndex;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <main className="min-h-screen bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="relative border-b border-white/10 backdrop-blur-md bg-primary/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 14 Q10 6, 20 14 T38 14" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
              <path d="M2 20 Q10 12, 20 20 T38 20" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              <path d="M2 26 Q10 18, 20 26 T38 26" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-white font-display font-bold text-lg tracking-tight">
              Ship<span className="text-accent">Crew</span>Finder
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition">Login</Link>
            <Link href="/signup" className="px-4 py-2 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition shadow-lg shadow-accent/20">
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Heading */}
        <div className="max-w-2xl mb-12">
          <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-4">
            <span className="text-accent text-xs font-extrabold tracking-wider uppercase">Blog</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Maritime Industry Insights
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Trends, guides, and analysis for seafarers, yacht crew, and maritime companies — from people who&apos;ve worked at sea.
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-white/60">No articles yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-primary-dark border border-white/10 hover:border-accent/40 rounded-2xl overflow-hidden transition flex flex-col"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.heroImage}
                  alt={post.heroAlt}
                  className="w-full h-44 object-cover"
                  loading="lazy"
                />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-accent/15 border border-accent/30 rounded-full text-accent text-[10px] font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-white/40 text-xs">{post.readingMinutes} min read</span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-white mb-2 leading-snug group-hover:text-accent transition">
                    {post.title}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="text-white/40 text-xs">{fmtDate(post.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
