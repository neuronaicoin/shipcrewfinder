import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RANK_CONTEXTS, getRankContextBySlug } from "@/lib/data/rank-context";
import { PORTS, getPortBySlug } from "@/lib/data/ports";
import { SALARY_DATA } from "@/lib/data/salary";

export function generateStaticParams() {
  const params: { port: string; rank: string }[] = [];
  for (const p of PORTS) {
    for (const r of RANK_CONTEXTS) {
      params.push({ port: p.slug, rank: r.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ port: string; rank: string }>;
}) {
  const { port, rank: slug } = await params;
  const rankCtx = getRankContextBySlug(slug);
  const portCtx = getPortBySlug(port);
  if (!rankCtx || !portCtx) return { title: "Not Found — ShipCrewFinder" };

  const rankName = rankCtx.rank.split(" ").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  return {
    title: `${rankName} Jobs in ${portCtx.name} — Salary, Demand & Direct Hire | ShipCrewFinder`,
    description: `Looking for ${rankName} positions in ${portCtx.name}? Real 2026 salary ranges, live open positions, and direct contact with verified shipping companies — 0% commission.`,
    alternates: { canonical: `https://shipcrewfinder.com/ports/${port}/${slug}` },
  };
}

export default async function PortRankPage({
  params,
}: {
  params: Promise<{ port: string; rank: string }>;
}) {
  const { port, rank: slug } = await params;
  const rankCtx = getRankContextBySlug(slug);
  const portCtx = getPortBySlug(port);
  if (!rankCtx || !portCtx) notFound();

  const rankName = rankCtx.rank
    .split(" ")
    .map((w) => (w.length <= 3 && w === w.toUpperCase() && !/^\d/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase()))
    .join(" ");

  const supabase = await createClient();

  const { count: jobCount } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("status", "active")
    .eq("position", rankCtx.rank)
    .eq("location_country", portCtx.countryCode);

  const { count: crewCount } = await supabase
    .from("seafarer_details")
    .select("id", { count: "exact", head: true })
    .eq("rank", rankCtx.rank);

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, location_city, salary_min, salary_max, salary_currency")
    .eq("status", "active")
    .eq("position", rankCtx.rank)
    .eq("location_country", portCtx.countryCode)
    .order("created_at", { ascending: false })
    .limit(5);

  const salaryEntry = SALARY_DATA.find((s) => s.slug === rankCtx.salarySlug);
  const salaryLow = salaryEntry ? salaryEntry.ranges.bulk.min : null;
  const salaryHigh = salaryEntry ? salaryEntry.ranges.lng.max : null;

  const faq = [
    {
      q: `How much does a ${rankName} earn on vessels calling ${portCtx.name}?`,
      a: salaryEntry
        ? `Across vessel types, ${rankName} salaries in 2026 typically range from $${salaryLow?.toLocaleString()} on bulk carriers up to $${salaryHigh?.toLocaleString()} on LNG carriers — see the full breakdown by vessel type on our Salary Index.`
        : `Salary varies by vessel type and company — see our full Salary Index for current 2026 ranges by rank.`,
    },
    {
      q: `Are there ${rankName} positions actually open right now near ${portCtx.name}?`,
      a: (jobCount || 0) > 0
        ? `Yes — there ${(jobCount || 0) === 1 ? "is" : "are"} currently ${jobCount} open ${rankName} position${(jobCount || 0) === 1 ? "" : "s"} posted by verified companies with operations connected to ${portCtx.name}.`
        : `Open positions change frequently — create a free profile and you'll be notified the moment a matching position is posted, and companies can find and contact you directly even without an active listing.`,
    },
    {
      q: `Does ShipCrewFinder charge commission on ${rankName} salaries?`,
      a: `Never. 0% commission from crew, ever, and it's currently 100% free for seafarers to join. Companies pay a flat subscription — your salary is fully yours.`,
    },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://shipcrewfinder.com" },
          { "@type": "ListItem", position: 2, name: "Crew Ranks", item: "https://shipcrewfinder.com/crew" },
          { "@type": "ListItem", position: 3, name: rankName, item: `https://shipcrewfinder.com/crew/${slug}` },
          { "@type": "ListItem", position: 4, name: portCtx.name, item: `https://shipcrewfinder.com/ports/${port}/${slug}` },
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
        <nav className="text-white/40 text-sm mb-5 flex flex-wrap gap-1">
          <Link href="/" className="hover:text-white/70">Home</Link> <span>/</span>
          <Link href="/crew" className="hover:text-white/70">Crew Ranks</Link> <span>/</span>
          <Link href={`/crew/${slug}`} className="hover:text-white/70">{rankName}</Link> <span>/</span>
          <span className="text-white/70">{portCtx.name}</span>
        </nav>

        <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-4">
          <span className="text-accent text-xs font-extrabold tracking-wider uppercase">{rankCtx.dept} · {portCtx.name}</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          {rankName} Jobs in {portCtx.name}
        </h1>
        <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl">
          Real 2026 salary data, live open positions, and direct contact with verified shipping companies
          operating in and around {portCtx.name} — <b className="text-accent">0% commission</b>, always.
        </p>

        <div className="flex flex-wrap gap-3 mb-10">
          <div className="px-5 py-3 bg-primary-dark border border-white/10 rounded-xl">
            <span className="text-accent font-display font-extrabold text-2xl">{jobCount || 0}</span>
            <span className="text-white/60 text-sm ml-2">open position{(jobCount || 0) === 1 ? "" : "s"}</span>
          </div>
          <div className="px-5 py-3 bg-primary-dark border border-white/10 rounded-xl">
            <span className="text-accent font-display font-extrabold text-2xl">{crewCount || 0}</span>
            <span className="text-white/60 text-sm ml-2">verified {rankName} profile{(crewCount || 0) === 1 ? "" : "s"} on ShipCrewFinder</span>
          </div>
          {salaryEntry && (
            <div className="px-5 py-3 bg-primary-dark border border-white/10 rounded-xl">
              <span className="text-accent font-display font-extrabold text-2xl">${salaryLow?.toLocaleString()}–${salaryHigh?.toLocaleString()}</span>
              <span className="text-white/60 text-sm ml-2">/month, by vessel type</span>
            </div>
          )}
        </div>

        {(jobs || []).length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-4">Open {rankName} positions</h2>
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
                  {j.location_city && <div className="text-white/50 text-sm mt-1">{j.location_city}</div>}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-10 space-y-4">
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-white mb-2">About {portCtx.name}</h2>
            <p className="text-white/65 text-sm leading-relaxed">{portCtx.intro}</p>
            <p className="text-white/65 text-sm leading-relaxed mt-3">{portCtx.hiringNote}</p>
            {portCtx.blogSlug && (
              <Link href={`/blog/${portCtx.blogSlug}`} className="inline-block mt-4 text-accent hover:text-accent-light font-bold text-sm">
                Read the full {portCtx.name} crew change guide →
              </Link>
            )}
          </div>
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-white mb-2">About the {rankName} role</h2>
            <p className="text-white/65 text-sm leading-relaxed">{rankCtx.intro}</p>
            <p className="text-white/65 text-sm leading-relaxed mt-3">{rankCtx.salaryVesselNote}</p>
            <Link href={`/crew/${slug}`} className="inline-block mt-4 text-accent hover:text-accent-light font-bold text-sm">
              See all {rankName} jobs worldwide →
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <div className="bg-primary-dark border border-accent/25 rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold text-white mb-2">I&apos;m a {rankName}</h3>
            <p className="text-white/60 text-sm mb-4">Create a verified profile — 100% free. Companies contact you directly.</p>
            <Link href="/signup/crew" className="inline-block px-5 py-2.5 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition text-sm">Create free profile →</Link>
          </div>
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold text-white mb-2">Hiring a {rankName}?</h3>
            <p className="text-white/60 text-sm mb-4">{crewCount || 0} verified {rankName} profiles. Search by availability &amp; experience.</p>
            <Link href="/signup/company" className="inline-block px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10 text-sm">Find crew →</Link>
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
          Other ports for {rankName}:{" "}
          {PORTS.filter((p) => p.slug !== port).slice(0, 6).map((p, i) => (
            <span key={p.slug}>{i > 0 && " · "}<Link href={`/ports/${p.slug}/${slug}`} className="text-accent/80 hover:text-accent">{p.name}</Link></span>
          ))}
        </div>
      </div>
    </main>
  );
}
