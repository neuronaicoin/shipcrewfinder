import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getAllSlugs, blogIndex } from "@/app/data/blog";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found — ShipCrewFinder" };

  const url = `https://shipcrewfinder.com/blog/${post.slug}`;
  return {
    title: `${post.title} — ShipCrewFinder`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.heroImage, alt: post.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.heroImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `https://shipcrewfinder.com/blog/${post.slug}`;

  // Related posts: tüm yazılar, bu yazı hariç, ilk 3
  const related = blogIndex.filter((p) => p.slug !== post.slug).slice(0, 3);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.heroImage,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "ShipCrewFinder" },
    publisher: {
      "@type": "Organization",
      name: "ShipCrewFinder",
      url: "https://shipcrewfinder.com",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.keywords.join(", "),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main className="min-h-screen bg-primary relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

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
            <Link href="/blog" className="text-white/70 hover:text-white text-sm font-medium transition">Blog</Link>
            <Link href="/signup" className="px-4 py-2 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition shadow-lg shadow-accent/20">
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      <article className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/60 text-sm transition mb-6"
        >
          ← Back to Blog
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-1 bg-accent/15 border border-accent/30 rounded-full text-accent text-[10px] font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-white/40 text-xs">{post.readingMinutes} min read</span>
          <span className="text-white/40 text-xs">·</span>
          <span className="text-white/40 text-xs">{fmtDate(post.date)}</span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.heroImage}
          alt={post.heroAlt}
          className="w-full h-56 md:h-80 object-cover rounded-2xl mb-10"
        />

        <div className="space-y-5 mb-10">
          {post.intro.map((para, i) => (
            <p key={i} className="text-white/80 text-base md:text-lg leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        <div className="space-y-10">
          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                  {section.heading}
                </h2>
              )}
              <div className="space-y-4">
                {section.paragraphs.map((para, j) => (
                  <p key={j} className="text-white/75 text-base leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {post.faqs.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {post.faqs.map((faq, i) => (
                <div key={i} className="bg-primary-dark border border-white/10 rounded-2xl p-6">
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related reading (internal links) */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
              Related reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group bg-primary-dark border border-white/10 hover:border-accent/40 rounded-2xl p-5 transition"
                >
                  <span className="px-2 py-0.5 bg-accent/15 border border-accent/30 rounded-full text-accent text-[10px] font-bold uppercase tracking-wider">
                    {r.category}
                  </span>
                  <h3 className="font-display text-base font-bold text-white mt-3 mb-1 leading-snug group-hover:text-accent transition">
                    {r.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed line-clamp-2">
                    {r.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-14 bg-primary-dark border border-accent/20 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            Ready to find your next contract?
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
            Build a verified profile and get contacted directly by maritime companies worldwide. Free 7-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup/crew"
              className="px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20"
            >
              Join as Crew
            </Link>
            <Link
              href="/signup/company"
              className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10"
            >
              Hire Crew
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
