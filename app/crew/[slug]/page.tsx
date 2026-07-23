import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SHIP_RANKS } from "@/lib/constants/ranks";
import { getSortedCountries } from "@/lib/constants/countries";

// ── slug ↔ rank haritası ──
const slugify = (r: string) => r.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const prettify = (r: string) =>
  r.includes("/") || r.length <= 3
    ? r.toUpperCase()
    : r.split(" ").map((w) => (w.length <= 3 && w === w.toUpperCase() && !/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join(" ");

const ALL_RANKS: { rank: string; slug: string; dept: string }[] = Object.entries(SHIP_RANKS).flatMap(
  ([dept, ranks]) => (ranks as string[]).map((rank) => ({ rank, slug: slugify(rank), dept }))
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = ALL_RANKS.find((r) => r.slug === slug);
  if (!entry) return { title: "Rank not found — ShipCrewFinder" };
  const name = prettify(entry.rank);
  return {
    title: `${name} Jobs at Sea — Direct Contracts, 0% Commission | ShipCrewFinder`,
    description: `Open ${name} positions from verified shipping companies worldwide. Apply directly — no agency, no commission. Build a verified ${name} profile and get contacted by employers.`,
    alternates: { canonical: `https://shipcrewfinder.com/crew/${slug}` },
  };
}

export default async function RankPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = ALL_RANKS.find((r) => r.slug === slug);
  if (!entry) notFound();

  const name = prettify(entry.rank);
  const supabase = await createClient();

  const { count: jobCount } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("status", "active")
    .eq("position", entry.rank);

  const { count: crewCount } = await supabase
    .from("seafarer_details")
    .select("id", { count: "exact", head: true })
    .eq("rank", entry.rank);

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, location_country, location_city, created_at, salary_min, salary_max, salary_currency")
    .eq("status", "active")
    .eq("position", entry.rank)
    .order("created_at", { ascending: false })
    .limit(5);

  const countries = getSortedCountries();
  const countryName = (code: string | null) => countries.find((c) => c.code === code)?.name || code || "";

  const faq = [
    { q: `How do I find ${name} jobs on ShipCrewFinder?`, a: `Create a free verified profile, set your availability, and browse open ${name} positions. Companies also contact registered crew directly — no agency in between.` },
    { q: `Does ShipCrewFinder take commission from ${name} salaries?`, a: `Never. 0% commission from crew, ever. Companies pay a flat subscription; your salary is fully yours.` },
    { q: `Are the companies posting ${name} jobs verified?`, a: `Every company account is reviewed before it can contact crew, and every crew profile is document-checked (CV, STCW, COC) before going live.` },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://shipcrewfinder.com" },
          { "@type": "ListItem", position: 2, name: "Crew Ranks", item: "https://shipcrewfinder.com/crew" },
          { "@type": "ListItem", position: 3, name: `${name} Jobs`, item: `https://shipcrewfinder.com/crew/${slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-primary relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />

      <header className="relative border-b border-white/10 backdrop-blur-md bg-primary/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-primary font-display font-extrabold">⚓</span>
            <span className="text-white font-display font-bold text-lg tracking-tight">Ship<span className="text-accent">Crew</span>Finder</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-white/70 hover:text-white text-sm font-medium transition">Login</Link>
            <Link href="/signup" className="px-4 py-2 bg-accent hover:bg-accent-dark text-primary font-bold text-sm rounded-lg transition">Sign Up Free</Link>
          </div>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <nav className="text-white/40 text-sm mb-5">
          <Link href="/" className="hover:text-white/70">Home</Link> <span className="mx-1">/</span>
          <Link href="/crew" className="hover:text-white/70">Crew Ranks</Link> <span className="mx-1">/</span>
          <span className="text-white/70">{name}</span>
        </nav>

        <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-4">
          <span className="text-accent text-xs font-extrabold tracking-wider uppercase">{entry.dept}</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          {name} Jobs at Sea
        </h1>
        <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl">
          Open {name} positions from verified shipping companies — direct contact, transparent terms,
          and <b className="text-accent">0% commission</b> from your salary. Ever.
        </p>

        <div className="flex flex-wrap gap-3 mb-10">
          <div className="px-5 py-3 bg-primary-dark border border-white/10 rounded-xl">
            <span className="text-accent font-display font-extrabold text-2xl">{jobCount || 0}</span>
            <span className="text-white/60 text-sm ml-2">open {name} job{(jobCount || 0) === 1 ? "" : "s"}</span>
          </div>
          <div className="px-5 py-3 bg-primary-dark border border-white/10 rounded-xl">
            <span className="text-accent font-display font-extrabold text-2xl">{crewCount || 0}</span>
            <span className="text-white/60 text-sm ml-2">verified {name} profile{(crewCount || 0) === 1 ? "" : "s"}</span>
          </div>
        </div>

        {(jobs || []).length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-4">Latest {name} openings</h2>
            <div className="space-y-3">
              {(jobs || []).map((j) => (
                <Link key={j.id} href={`/jobs/${j.id}`}
                  className="block bg-primary-dark border border-white/10 hover:border-accent/50 rounded-xl p-4 transition">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-white font-bold">{j.title}</span>
                    {(j.salary_min || j.salary_max) && (
                      <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold">
                        {j.salary_currency || "USD"} {j.salary_min || "?"}{j.salary_max ? `–${j.salary_max}` : ""}/mo
                      </span>
                    )}
                  </div>
                  <div className="text-white/50 text-sm mt-1">
                    {countryName(j.location_country)}{j.location_city ? `, ${j.location_city}` : ""}
                  </div>
                </Link>
              ))}
            </div>
            <Link href={`/jobs?rank=${encodeURIComponent(entry.rank)}`}
              className="inline-block mt-4 text-accent hover:text-accent-light font-bold text-sm">
              View all {name} jobs →
            </Link>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <div className="bg-primary-dark border border-accent/25 rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold text-white mb-2">I&apos;m a {name}</h3>
            <p className="text-white/60 text-sm mb-4">Create a verified profile. Companies contact you directly — first month free.</p>
            <Link href="/signup/crew" className="inline-block px-5 py-2.5 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition text-sm">Create free profile →</Link>
          </div>
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold text-white mb-2">Hiring a {name}?</h3>
            <p className="text-white/60 text-sm mb-4">{crewCount || 0} verified {name} profiles. Search by availability &amp; vessel experience — first month free.</p>
            <Link href="/signup/company" className="inline-block px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10 text-sm">Find {name}s →</Link>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-display text-xl font-bold text-white mb-4">Frequently asked</h2>
          {faq.map((f) => (
            <details key={f.q} className="bg-primary-dark border border-white/10 rounded-xl mb-3 p-4">
              <summary className="text-white font-bold text-sm cursor-pointer">{f.q}</summary>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="text-white/40 text-sm">
          Other ranks:{" "}
          {ALL_RANKS.filter((r) => r.dept === entry.dept && r.slug !== slug).slice(0, 6).map((r, i) => (
            <span key={r.slug}>{i > 0 && " · "}<Link href={`/crew/${r.slug}`} className="text-accent/80 hover:text-accent">{prettify(r.rank)}</Link></span>
          ))}
          {" · "}<Link href="/crew" className="text-accent/80 hover:text-accent">All ranks</Link>
        </div>
      </div>
    </main>
  );
}
