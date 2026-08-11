// Programmatic SEO: port × rank sayfaları için içerik-zengin liman verisi
// Her port için gerçek, özgün, kısa bağlam metni — kalıp değil

export type PortEntry = {
  slug: string;
  name: string;
  countryCode: string;
  countryName: string;
  blogSlug: string | null; // ilgili crew-change hub yazısı, varsa
  intro: string; // ~80-120 kelime, port'a özel gerçek bağlam
  hiringNote: string; // ~40-60 kelime, o limanda hangi rütbe/gemi tipi talebi daha güçlü
};

export const PORTS: PortEntry[] = [
  {
    slug: "singapore",
    name: "Singapore",
    countryCode: "SG",
    countryName: "Singapore",
    blogSlug: "singapore-crew-change-hub-guide-2026",
    intro:
      "Singapore is the world's busiest crew change hub, sitting directly on the Malacca Strait shipping lane. Companies routing crew changes through Singapore span every vessel type and trade route, making it one of the most active locations globally for both sign-ons and sign-offs across nearly every rank.",
    hiringNote:
      "Given the sheer volume of vessel traffic passing through, demand here spans all ranks and vessel types — container, tanker, and bulk carrier crew changes are all routinely handled through Singapore's established infrastructure.",
  },
  {
    slug: "rotterdam",
    name: "Rotterdam",
    countryCode: "NL",
    countryName: "Netherlands",
    blogSlug: "rotterdam-crew-change-hub-guide-2026",
    intro:
      "Rotterdam has been Europe's largest port by cargo volume for decades, and its crew changes are tied directly to cargo operations rather than dedicated transit stops. Companies operating European trade routes — container, bulk, and energy shipping — regularly source and rotate crew through Rotterdam's extensive terminal network.",
    hiringNote:
      "European shipping companies with vessels regularly calling Rotterdam tend to favor officers with strong documentation habits, given how tightly crew change timing is coupled to actual cargo operations here.",
  },
  {
    slug: "fujairah",
    name: "Fujairah",
    countryCode: "AE",
    countryName: "United Arab Emirates",
    blogSlug: "fujairah-crew-change-hub-guide-2026",
    intro:
      "Fujairah is one of the world's largest bunkering ports, sitting on the Gulf of Oman coast and uniquely avoiding the Strait of Hormuz entirely. This makes it a genuinely strategic crew change point for companies operating Middle East, Indian Ocean, and broader regional trade routes.",
    hiringNote:
      "Tanker and gas carrier companies operating through the Middle East region are particularly active here, given Fujairah's role as a major regional bunkering and logistics hub for these vessel types.",
  },
  {
    slug: "gibraltar",
    name: "Gibraltar",
    countryCode: "GI",
    countryName: "Gibraltar",
    blogSlug: "gibraltar-crew-change-hub-guide-2026",
    intro:
      "Gibraltar sits at the narrowest point of the Strait of Gibraltar, where the Mediterranean meets the Atlantic — a position that's made it one of the busiest bunkering ports in the region. Vessels transiting between the Mediterranean and Atlantic frequently combine a bunkering stop with a crew change here.",
    hiringNote:
      "Companies operating Mediterranean-Atlantic trade routes, across most major vessel types, use Gibraltar as a natural, low-detour point for both fuel and crew logistics.",
  },
  {
    slug: "panama",
    name: "Panama",
    countryCode: "PA",
    countryName: "Panama",
    blogSlug: "panama-canal-crew-change-hub-guide-2026",
    intro:
      "The Panama Canal remains one of the world's most consequential shipping chokepoints, and Panama is separately one of the largest global flag states. Crew changes happen at both Cristóbal (Atlantic side) and Balboa (Pacific side), serving vessels transiting between the Atlantic and Pacific.",
    hiringNote:
      "Container and bulk carrier companies using the canal as part of trans-oceanic routes routinely handle crew changes at either end of the transit, with Balboa generally offering smoother airport connectivity.",
  },
  {
    slug: "suez",
    name: "Suez / Port Said",
    countryCode: "EG",
    countryName: "Egypt",
    blogSlug: "suez-canal-crew-change-hub-guide-2026",
    intro:
      "The Suez Canal has connected the Mediterranean to the Red Sea since 1869, and Port Said has developed genuine crew change infrastructure given the sheer volume of vessels transiting the canal every year. It remains a key logistics point for companies operating Europe-Asia trade routes.",
    hiringNote:
      "Companies with vessels regularly transiting between Europe and Asia via Suez use Port Said as a practical crew change point, particularly for container and bulk carrier rotations.",
  },
  {
    slug: "istanbul",
    name: "Istanbul / Bosphorus",
    countryCode: "TR",
    countryName: "Turkey",
    blogSlug: "turkey-black-sea-shipping-restrictions-drone-attacks-august-2026",
    intro:
      "Istanbul sits directly on the Bosphorus Strait, one of the world's busiest and most navigationally demanding waterways, connecting the Black Sea to the Mediterranean. The city is a natural crew change and logistics point for companies operating Black Sea, Mediterranean, and broader regional trade.",
    hiringNote:
      "Turkish officers in particular have deep familiarity with this specific waterway and region, and companies operating Black Sea and Mediterranean routes frequently prioritize crew with direct regional experience.",
  },
  {
    slug: "piraeus",
    name: "Piraeus",
    countryCode: "GR",
    countryName: "Greece",
    blogSlug: null,
    intro:
      "Piraeus is the largest port in Greece and a central hub for one of the world's most significant shipowning nations — Greek-controlled tonnage represents a substantial share of the global fleet. Companies headquartered in and around Piraeus have long been major employers of foreign officers, given the scale of Greek shipping relative to Greece's own domestic seafarer population.",
    hiringNote:
      "Greek shipowners based around Piraeus are consistently active recruiters across nearly every rank, with particularly strong, longstanding relationships with Turkish, Filipino, and Eastern European officers.",
  },
];

export function getPortBySlug(slug: string): PortEntry | undefined {
  return PORTS.find((p) => p.slug === slug);
}
