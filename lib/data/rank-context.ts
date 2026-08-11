// Programmatic SEO: rütbe-spesifik zengin bağlam metni
// slug: mevcut /crew/[slug] sayfalarıyla aynı format (DB sorguları + iç linkler için)
// salarySlug: SALARY_DATA'daki format (maaş verisi çekmek için)

export type RankContextEntry = {
  slug: string;
  salarySlug: string;
  rank: string; // SHIP_RANKS'teki tam değer (DB filtreleme için)
  dept: string;
  intro: string;
  salaryVesselNote: string;
};

export const RANK_CONTEXTS: RankContextEntry[] = [
  {
    slug: "master",
    salarySlug: "master",
    rank: "MASTER",
    dept: "Deck Department",
    intro:
      "The Master carries ultimate responsibility for a vessel — navigation, cargo, crew welfare, and regulatory compliance all rest with this position. Companies evaluate Master candidates on documented command experience, incident-free voyage history, and demonstrated judgment under pressure, making this one of the most carefully vetted hiring decisions in any crewing department.",
    salaryVesselNote:
      "LNG carriers and specialized gas tankers consistently offer the strongest compensation for experienced Masters, reflecting both the technical complexity and the genuine scarcity of officers with relevant command experience on these vessel types.",
  },
  {
    slug: "chief-officer",
    salarySlug: "chief-officer",
    rank: "CHIEF OFFICER",
    dept: "Deck Department",
    intro:
      "The Chief Officer manages cargo operations, deck department personnel, and safety systems, serving as the direct link between the Master and the rest of the deck crew. Strong Chief Officers are consistently in demand because this rank represents the primary pipeline toward Master, and companies invest in developing officers who show clear command potential.",
    salaryVesselNote:
      "Container and specialized cargo vessels tend to offer the strongest premiums for Chief Officers with proven cargo planning and stowage expertise, given the technical complexity these vessel types demand.",
  },
  {
    slug: "chief-engineer",
    salarySlug: "chief-engineer",
    rank: "CHIEF ENGINEER",
    dept: "Engine Department",
    intro:
      "The Chief Engineer holds ultimate responsibility for a vessel's entire mechanical and electrical systems, combining deep technical expertise with genuine leadership of the engine department. This rank is consistently among the highest-demand positions across virtually every vessel type, given how directly engine reliability affects a vessel's entire operational schedule.",
    salaryVesselNote:
      "LNG and LPG carriers offer the strongest compensation for Chief Engineers by a meaningful margin, driven by a well-documented global shortage of officers with genuine gas carrier engineering experience.",
  },
  {
    slug: "2nd-engineer",
    salarySlug: "second-engineer",
    rank: "2ND ENGINEER",
    dept: "Engine Department",
    intro:
      "The 2nd Engineer manages day-to-day engine room operations and serves as the most direct pipeline toward Chief Engineer, making this rank a genuine focal point for companies building long-term engineering talent. Strong 2nd Engineers with specialized vessel type experience are consistently sought after well beyond entry-level demand.",
    salaryVesselNote:
      "Chemical tankers and gas carriers offer particularly strong compensation for 2nd Engineers, given the specialized systems knowledge these vessel types require beyond conventional cargo ship engineering.",
  },
  {
    slug: "2nd-officer",
    salarySlug: "second-officer",
    rank: "2ND OFFICER",
    dept: "Deck Department",
    intro:
      "The 2nd Officer typically holds primary responsibility for navigation and voyage planning, working closely under the Chief Officer while building the specific competencies that lead toward more senior deck positions. This rank sees consistent demand across nearly every vessel type and trade route.",
    salaryVesselNote:
      "Tanker and gas carrier segments offer meaningfully stronger compensation for 2nd Officers with relevant certification, reflecting the additional specialized training these vessel types require.",
  },
  {
    slug: "eto",
    salarySlug: "eto",
    rank: "ETO",
    dept: "Engine Department",
    intro:
      "The Electro-Technical Officer manages a vessel's increasingly complex electrical and automation systems — a role that has grown substantially in importance as vessels have become more electronically sophisticated. Companies operating modern, highly automated vessels place particular value on strong ETO candidates.",
    salaryVesselNote:
      "Container vessels and LNG carriers, given their especially complex electrical and automation systems, consistently offer the strongest compensation for experienced ETOs.",
  },
];

export function getRankContextBySlug(slug: string): RankContextEntry | undefined {
  return RANK_CONTEXTS.find((r) => r.slug === slug);
}
