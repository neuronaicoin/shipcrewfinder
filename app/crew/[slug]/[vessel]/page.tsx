import { notFound } from "next/navigation";
import Link from "next/link";
import { SHIP_RANKS } from "@/lib/constants/ranks";
import { SALARY_DATA, VESSELS, fmtK, type VesselKey } from "@/lib/data/salary";

const slugify = (r: string) => r.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const prettify = (r: string) =>
  r.includes("/") || r.length <= 3
    ? r.toUpperCase()
    : r.split(" ").map((w) => (w.length <= 3 && w === w.toUpperCase() && !/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join(" ");

const ALL_RANKS: { rank: string; slug: string; dept: string }[] = Object.entries(SHIP_RANKS).flatMap(
  ([dept, ranks]) => (ranks as string[]).map((rank) => ({ rank, slug: slugify(rank), dept }))
);

type VesselInfo = {
  name: string;
  plural: string;
  certs: Record<string, string>;
  life: Record<string, string>;
};

const VESSEL_META: Record<VesselKey, VesselInfo> = {
  bulk: {
    name: "Bulk Carrier",
    plural: "Bulk Carriers",
    certs: {
      Deck: "Standard STCW II certificates apply — no cargo-specific endorsements are mandatory for dry bulk, which keeps the entry barrier low and the candidate pool wide. Grain stability knowledge and draft survey experience strengthen any application.",
      Engine: "Standard STCW III certificates are sufficient — bulk carriers carry no cargo-endorsement requirement, making them the most accessible tonnage for engineers building sea time in rank.",
      Ratings: "Basic STCW safety training and a valid rating certificate are enough — bulk carriers are the classic entry tonnage, with hatch, crane and hold-cleaning work forming the daily routine.",
    },
    life: {
      Deck: "Expect longer port stays than liner trades, anchorages, and cargo work measured in days — hold inspections, draft surveys and hatch operations set the rhythm. Older tonnage is common, but the calmer inspection climate makes it a proven lane for gaining time in rank quickly.",
      Engine: "Machinery is conventional and forgiving compared with specialist tonnage — a single slow-speed main engine, standard auxiliaries, no cargo plant. Port stays allow alongside maintenance that liner trades never permit.",
      Ratings: "Physical, honest work: hold cleaning between cargoes, crane and hatch operations, chipping and painting on longer passages. Port time is generous compared with container trades.",
    },
  },
  tanker: {
    name: "Tanker",
    plural: "Tankers",
    certs: {
      Deck: "Beyond STCW II, tankers require Basic and Advanced Oil/Chemical Tanker Cargo Operations training plus a flag-state endorsement before signing on. SIRE/OCIMF vetting familiarity is a genuine hiring differentiator at officer level.",
      Engine: "Beyond STCW III, Advanced Oil or Chemical Tanker Cargo Operations certification and a flag endorsement are mandatory. Framo or steam cargo pump experience, inert gas systems and boiler competence are what crewing departments actually screen for.",
      Ratings: "Basic Tanker Familiarization is the minimum; Advanced training opens pumpman and senior rating roles. Deck ratings work cargo watches — manifold, tank gauging, line handling under permit systems.",
    },
    life: {
      Deck: "Cargo operations never sleep: closed-loop loading and discharge, inert gas, vapour control, and constant vetting pressure (SIRE 2.0). The compensation premium over bulk directly reflects the certification burden and inspection intensity.",
      Engine: "The engine department runs the cargo plant too — pumps, inert gas, boilers — so port time is work time. Flammable and toxic cargo leaves no room for improvisation, and the pay scale acknowledges it.",
      Ratings: "Stricter permit-to-work culture, gas measurement routines, and more disciplined deck operations than dry cargo — with a visible pay premium for the added responsibility.",
    },
  },
  container: {
    name: "Container Ship",
    plural: "Container Ships",
    certs: {
      Deck: "Standard STCW II certificates apply; reefer cargo knowledge and lashing/stability software familiarity are valued. The real requirement is tempo: port calls measured in hours demand sharp cargo-watch discipline.",
      Engine: "Standard STCW III certificates, with high-voltage training increasingly expected on larger tonnage. Experience with large-bore two-stroke engines and heavy generator plants for reefer loads is the practical differentiator.",
      Ratings: "Basic STCW plus lashing competence — container ratings live on the lashing bridges during port calls, and the liner schedule makes every call short and intense.",
    },
    life: {
      Deck: "Liner schedules mean hours in port, not days — arrivals, cargo watches and departures stack tightly, and the passage is where paperwork and rest happen. Predictable rotations and modern tonnage are the trade-off for the tempo.",
      Engine: "There is no 'fix it alongside' — repairs happen at sea, on the move. Ultra-large tonnage runs 11–12 cylinder mains with massive auxiliary capacity for thousands of reefers; the machinery scale alone places container pay above bulk.",
      Ratings: "Fast port calls, constant lashing work, and modern accommodation — the liner rhythm is demanding but predictable, with schedules families can actually plan around.",
    },
  },
  lng: {
    name: "LNG / LPG Carrier",
    plural: "LNG / LPG Carriers",
    certs: {
      Deck: "IGC Code training and an Advanced Liquefied Gas Tanker endorsement are mandatory — and the harder requirement is accumulating supervised sea time on gas tonnage to enter the pool at all. Cargo containment and custody transfer knowledge define the officer role.",
      Engine: "IGC/IGF Code training plus an advanced gas endorsement are mandatory, and dual-fuel experience (ME-GI, X-DF) is what top operators pay for. Cryogenic cargo plant and reliquefaction systems sit firmly on the engine department.",
      Ratings: "Basic Liquefied Gas Tanker training is the entry requirement; gas ratings work under the industry's strictest permit and gas-measurement regimes — and earn the scale's top rating wages for it.",
    },
    life: {
      Deck: "Cargo at −162°C leaves zero tolerance for error: custody transfer, boil-off management and terminal compatibility work make this the most procedural trade at sea — and the best paid. Few officers hold the tickets, and operators fight to keep the ones who do.",
      Engine: "The cargo is also the fuel: dual-fuel engines, reliquefaction plants and cryogenic systems make this the most technically demanding engine room afloat. Scarcity of qualified engineers keeps LNG pay at the top of every salary table.",
      Ratings: "The strictest safety culture in shipping, modern fleets, structured training — and the highest rating wages on the market as the reward for the discipline.",
    },
  },
};

const VESSEL_KEYS = VESSELS.map((v) => v.key);

const findSalary = (rank: string) => SALARY_DATA.find((s) => norm(s.rank) === norm(rank));

export function generateStaticParams() {
  const params: { slug: string; vessel: string }[] = [];
  ALL_RANKS.forEach((r) => {
    if (!findSalary(r.rank)) return;
    VESSEL_KEYS.forEach((v) => params.push({ slug: r.slug, vessel: v }));
  });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; vessel: string }> }) {
  const { slug, vessel } = await params;
  const entry = ALL_RANKS.find((r) => r.slug === slug);
  const sal = entry ? findSalary(entry.rank) : null;
  if (!entry || !sal || !VESSEL_KEYS.includes(vessel as VesselKey)) {
    return { title: "Not found — ShipCrewFinder" };
  }
  const vm = VESSEL_META[vessel as VesselKey];
  const name = prettify(entry.rank);
  const rg = sal.ranges[vessel as VesselKey];
  return {
    title: `${name} on ${vm.plural} — Salary $${fmtK(rg.min)}–${fmtK(rg.max)}/mo & Requirements 2026 | ShipCrewFinder`,
    description: `${name} jobs on ${vm.plural.toLowerCase()}: 2026 monthly salary $${fmtK(rg.min)}–$${fmtK(rg.max)}, required certificates, and what the work is really like. Direct contracts, 0% commission.`,
    alternates: { canonical: `https://shipcrewfinder.com/crew/${slug}/${vessel}` },
  };
}

export default async function RankVesselPage({ params }: { params: Promise<{ slug: string; vessel: string }> }) {
  const { slug, vessel } = await params;
  const entry = ALL_RANKS.find((r) => r.slug === slug);
  if (!entry || !VESSEL_KEYS.includes(vessel as VesselKey)) notFound();
  const sal = findSalary(entry.rank);
  if (!sal) notFound();

  const vk = vessel as VesselKey;
  const vm = VESSEL_META[vk];
  const name = prettify(entry.rank);
  const rg = sal.ranges[vk];
  const certText = vm.certs[entry.dept] || vm.certs.Ratings;
  const lifeText = vm.life[entry.dept] || vm.life.Ratings;

  const faq = [
    {
      q: `How much does a ${name} earn on ${vm.plural.toLowerCase()} in 2026?`,
      a: `Typical monthly basic wages for a ${name} on ${vm.plural.toLowerCase()} run $${fmtK(rg.min)}–$${fmtK(rg.max)} USD, excluding overtime, leave pay and bonuses — take-home is usually 15–25% higher with guaranteed overtime. Premium operators and modern tonnage sit at the top of the band.`,
    },
    {
      q: `What certificates does a ${name} need for ${vm.plural.toLowerCase()}?`,
      a: certText,
    },
    {
      q: `How do I find ${name} jobs on ${vm.plural.toLowerCase()}?`,
      a: `Create a free verified ShipCrewFinder profile, log your ${vm.name.toLowerCase()} sea time, and set your availability — companies search by rank and vessel experience and contact you directly. You can also browse open ${name} positions and apply with one click. No agency, 0% commission.`,
    },
    {
      q: `Is ${vm.name.toLowerCase()} experience worth it for a ${name}?`,
      a: lifeText,
    },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://shipcrewfinder.com" },
          { "@type": "ListItem", position: 2, name: `${name} Jobs`, item: `https://shipcrewfinder.com/crew/${slug}` },
          { "@type": "ListItem", position: 3, name: `${name} on ${vm.plural}`, item: `https://shipcrewfinder.com/crew/${slug}/${vessel}` },
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
          <Link href={`/crew/${slug}`} className="hover:text-white/70">{name}</Link> <span className="mx-1">/</span>
          <span className="text-white/70">{vm.plural}</span>
        </nav>

        <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-4">
          <span className="text-accent text-xs font-extrabold tracking-wider uppercase">{entry.dept} · {vm.name}</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          {name} on {vm.plural}
        </h1>
        <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl">
          Salary, certificates and the real day-to-day of sailing as a {name} on {vm.plural.toLowerCase()} —
          plus direct contracts with <b className="text-accent">0% commission</b>, ever.
        </p>

        <div className="bg-primary-dark border border-emerald-500/30 rounded-2xl p-6 mb-8">
          <div className="text-white/50 text-xs font-bold tracking-wider uppercase mb-1">2026 monthly salary — {name}, {vm.name}</div>
          <div className="font-display text-4xl md:text-5xl font-extrabold text-emerald-300">
            ${fmtK(rg.min)} – ${fmtK(rg.max)}
            <span className="text-white/40 text-lg font-bold"> /mo basic</span>
          </div>
          <div className="text-white/50 text-sm mt-2">Excluding overtime &amp; leave pay — take-home typically runs 15–25% higher. Full method: <Link href={`/salary/${sal.slug}`} className="text-accent hover:underline">{name} salary page →</Link></div>
        </div>

        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">How {vm.name.toLowerCase()} pay compares</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {VESSELS.map((v) => (
              <Link
                key={v.key}
                href={`/crew/${slug}/${v.key}`}
                className={`rounded-xl p-4 border transition ${v.key === vk ? "bg-accent/10 border-accent/50" : "bg-primary-dark border-white/10 hover:border-accent/40"}`}
              >
                <div className={`text-xs font-bold mb-1 ${v.key === vk ? "text-accent" : "text-white/50"}`}>{v.label}</div>
                <div className="text-white font-display font-extrabold">
                  ${fmtK(sal.ranges[v.key].min)}–{fmtK(sal.ranges[v.key].max)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-white mb-3">📜 Required certificates</h2>
            <p className="text-white/60 text-sm leading-relaxed">{certText}</p>
          </div>
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold text-white mb-3">⚙️ What the work is really like</h2>
            <p className="text-white/60 text-sm leading-relaxed">{lifeText}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <div className="bg-primary-dark border border-accent/25 rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold text-white mb-2">I&apos;m a {name}</h3>
            <p className="text-white/60 text-sm mb-4">Log your {vm.name.toLowerCase()} sea time, build a verified profile — companies contact you directly. First month free.</p>
            <Link href="/signup/crew" className="inline-block px-5 py-2.5 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition text-sm">Create free profile →</Link>
          </div>
          <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
            <h3 className="font-display text-lg font-bold text-white mb-2">Hiring for {vm.plural.toLowerCase()}?</h3>
            <p className="text-white/60 text-sm mb-4">Search verified {name}s by vessel experience &amp; availability — first month free.</p>
            <Link href="/signup/company" className="inline-block px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg transition border border-white/10 text-sm">Find {name}s →</Link>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">Frequently asked</h2>
          {faq.map((f) => (
            <details key={f.q} className="bg-primary-dark border border-white/10 rounded-xl mb-3 p-4">
              <summary className="text-white font-bold text-sm cursor-pointer">{f.q}</summary>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="text-white/40 text-sm leading-relaxed">
          See also:{" "}
          <Link href={`/crew/${slug}`} className="text-accent/80 hover:text-accent">{name} jobs</Link>
          {" · "}
          <Link href={`/salary/${sal.slug}`} className="text-accent/80 hover:text-accent">{name} salary details</Link>
          {" · "}
          <Link href={`/jobs?rank=${encodeURIComponent(entry.rank)}`} className="text-accent/80 hover:text-accent">Open {name} positions</Link>
          {" · "}
          <Link href="/salary" className="text-accent/80 hover:text-accent">All 15 ranks</Link>
        </div>
      </div>
    </main>
  );
}
