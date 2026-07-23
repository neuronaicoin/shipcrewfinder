export type VesselKey = "bulk" | "tanker" | "container" | "lng";

export type SalaryRange = { min: number; max: number };

export type RankSalary = {
  slug: string;
  rank: string;
  dept: "Deck" | "Engine" | "Ratings";
  desc: string;
  ranges: Record<VesselKey, SalaryRange>;
};

export const VESSELS: { key: VesselKey; label: string }[] = [
  { key: "bulk", label: "Bulk Carrier" },
  { key: "tanker", label: "Tanker" },
  { key: "container", label: "Container" },
  { key: "lng", label: "LNG / LPG" },
];

export const SALARY_DATA: RankSalary[] = [
  {
    slug: "master",
    rank: "Master",
    dept: "Deck",
    desc: "The Master holds ultimate responsibility for the vessel, cargo and crew. Pay reflects command-level accountability, with LNG and specialist tonnage at the top of the scale.",
    ranges: { bulk: { min: 9000, max: 13000 }, tanker: { min: 12000, max: 16000 }, container: { min: 10000, max: 14000 }, lng: { min: 15000, max: 21000 } },
  },
  {
    slug: "chief-officer",
    rank: "Chief Officer",
    dept: "Deck",
    desc: "Second in command and head of the deck department. Chief Officers run cargo operations and are one of the most in-demand ranks in 2026, pushing salaries above historical norms.",
    ranges: { bulk: { min: 7000, max: 9500 }, tanker: { min: 9000, max: 12000 }, container: { min: 8000, max: 10500 }, lng: { min: 11000, max: 14000 } },
  },
  {
    slug: "second-officer",
    rank: "2nd Officer",
    dept: "Deck",
    desc: "The ship's navigator. Responsible for passage planning, charts and bridge watches. A key stepping stone toward Chief Officer, with steady demand across all vessel types.",
    ranges: { bulk: { min: 4500, max: 6000 }, tanker: { min: 5500, max: 7500 }, container: { min: 5000, max: 6500 }, lng: { min: 7000, max: 8500 } },
  },
  {
    slug: "third-officer",
    rank: "3rd Officer",
    dept: "Deck",
    desc: "Entry officer rank on the bridge, typically handling safety equipment and watchkeeping. Pay rises quickly with sea time and the move to 2nd Officer.",
    ranges: { bulk: { min: 3000, max: 4200 }, tanker: { min: 3800, max: 5200 }, container: { min: 3500, max: 4800 }, lng: { min: 4500, max: 6000 } },
  },
  {
    slug: "chief-engineer",
    rank: "Chief Engineer",
    dept: "Engine",
    desc: "Head of the engine department, responsible for all machinery on board. Chief Engineers remain in structural shortage in 2026 — on LNG tonnage their pay matches the Master's.",
    ranges: { bulk: { min: 8500, max: 12500 }, tanker: { min: 11000, max: 15500 }, container: { min: 9500, max: 13500 }, lng: { min: 15000, max: 21000 } },
  },
  {
    slug: "second-engineer",
    rank: "2nd Engineer",
    dept: "Engine",
    desc: "Runs the day-to-day engine room and leads the engineering watch. The direct path to Chief Engineer, with strong demand keeping salaries firm across all tonnage.",
    ranges: { bulk: { min: 5500, max: 7500 }, tanker: { min: 7000, max: 9500 }, container: { min: 6000, max: 8500 }, lng: { min: 9000, max: 11000 } },
  },
  {
    slug: "third-engineer",
    rank: "3rd Engineer",
    dept: "Engine",
    desc: "Typically responsible for auxiliary engines, generators and fuel systems. A mid-level engineering rank with clear progression and healthy market demand.",
    ranges: { bulk: { min: 3500, max: 5000 }, tanker: { min: 4500, max: 6200 }, container: { min: 4000, max: 5500 }, lng: { min: 5500, max: 7000 } },
  },
  {
    slug: "fourth-engineer",
    rank: "4th Engineer",
    dept: "Engine",
    desc: "Entry officer rank in the engine department, usually covering purifiers, pumps and watchkeeping duties. The starting point of the engineering career ladder.",
    ranges: { bulk: { min: 2500, max: 3800 }, tanker: { min: 3200, max: 4500 }, container: { min: 2800, max: 4200 }, lng: { min: 4000, max: 5000 } },
  },
  {
    slug: "eto",
    rank: "ETO",
    dept: "Engine",
    desc: "Electro-Technical Officers maintain the vessel's electrical and automation systems. One of the tightest labour markets at sea — modern tonnage cannot sail without them.",
    ranges: { bulk: { min: 4000, max: 6000 }, tanker: { min: 5000, max: 7500 }, container: { min: 4500, max: 6500 }, lng: { min: 6500, max: 8500 } },
  },
  {
    slug: "bosun",
    rank: "Bosun",
    dept: "Ratings",
    desc: "Senior deck rating and foreman of the deck crew. Coordinates maintenance, mooring and cargo work under the Chief Officer.",
    ranges: { bulk: { min: 2200, max: 3200 }, tanker: { min: 2800, max: 4000 }, container: { min: 2500, max: 3500 }, lng: { min: 3500, max: 4500 } },
  },
  {
    slug: "fitter",
    rank: "Fitter",
    dept: "Ratings",
    desc: "The engine department's skilled fabricator — welding, machining and mechanical repairs. Experienced fitters earn at the top of the ratings scale.",
    ranges: { bulk: { min: 2200, max: 3200 }, tanker: { min: 2800, max: 4000 }, container: { min: 2500, max: 3500 }, lng: { min: 3500, max: 4500 } },
  },
  {
    slug: "ab",
    rank: "AB",
    dept: "Ratings",
    desc: "Able Seamen handle watchkeeping, mooring and deck maintenance. ITF minimums set the floor; market rates on tankers and gas carriers run well above it.",
    ranges: { bulk: { min: 1800, max: 2600 }, tanker: { min: 2200, max: 3200 }, container: { min: 2000, max: 2800 }, lng: { min: 2800, max: 3600 } },
  },
  {
    slug: "oiler",
    rank: "Oiler",
    dept: "Ratings",
    desc: "Engine room rating responsible for lubrication, cleaning and assisting the engineers on watch. Pay tracks closely with AB rates across vessel types.",
    ranges: { bulk: { min: 1800, max: 2600 }, tanker: { min: 2200, max: 3200 }, container: { min: 2000, max: 2800 }, lng: { min: 2800, max: 3600 } },
  },
  {
    slug: "os",
    rank: "OS",
    dept: "Ratings",
    desc: "Ordinary Seaman — the entry rating on deck. First rung of the deck career ladder, with a clear route to AB after sea time and certification.",
    ranges: { bulk: { min: 1400, max: 1900 }, tanker: { min: 1600, max: 2200 }, container: { min: 1500, max: 2000 }, lng: { min: 1900, max: 2400 } },
  },
  {
    slug: "cook",
    rank: "Cook",
    dept: "Ratings",
    desc: "Feeds the entire crew, every day of the contract. A good cook is one of the most valued people on board — and experienced cooks earn accordingly.",
    ranges: { bulk: { min: 2200, max: 3200 }, tanker: { min: 2800, max: 4000 }, container: { min: 2500, max: 3500 }, lng: { min: 3500, max: 4500 } },
  },
];

export const getRankBySlug = (slug: string) =>
  SALARY_DATA.find((r) => r.slug === slug);

export const fmtK = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;

export const fmtUsd = (n: number) => `$${n.toLocaleString("en-US")}`;

export const overallRange = (r: RankSalary): SalaryRange => ({
  min: Math.min(...Object.values(r.ranges).map((x) => x.min)),
  max: Math.max(...Object.values(r.ranges).map((x) => x.max)),
});

export const LAST_UPDATED = "July 2026";
