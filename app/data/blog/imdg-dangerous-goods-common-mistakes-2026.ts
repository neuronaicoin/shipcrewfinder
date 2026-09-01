import type { BlogPost } from "./types";

const post: BlogPost = {
  slug: "imdg-dangerous-goods-common-mistakes-2026",
  title: "IMDG Code: The Dangerous Goods Mistakes That Actually Cause Incidents (2026)",
  description:
    "Classification errors, segregation table misreads, and documentation gaps — the specific IMDG Code mistakes behind most dangerous goods incidents at sea, and how to avoid them.",
  category: "Deck Operations",
  author: "Maritime industry professional",
  date: "2026-09-04",
  readingMinutes: 10,
  excerpt:
    "Dangerous goods incidents at sea rarely come from a single obviously bad decision. They come from small classification and segregation mistakes that compound quietly until they don't.",
  keywords: [
    "IMDG code common mistakes",
    "dangerous goods segregation rules",
    "IMDG classification errors",
    "dangerous goods declaration mistakes",
    "IMDG segregation table guide",
    "how to avoid dangerous goods incidents shipping",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Container stack aboard a ship, representing dangerous goods stowage under the IMDG Code",
  intro: [
    "Dangerous goods incidents at sea very rarely trace back to a single, obviously reckless decision. Investigation after investigation instead finds a chain of smaller mistakes — a classification taken at face value from a shipper's paperwork, a segregation requirement misread from a dense table under time pressure, a declaration that didn't quite match what was actually loaded — that individually looked minor and collectively created the conditions for a serious incident.",
    "The IMDG Code itself is not the problem. It is a detailed, well-structured system precisely because dangerous goods incidents at sea have historically been serious enough to justify that level of detail. The problem is that its complexity rewards careful, unhurried application and punishes shortcuts severely — and cargo operations rarely offer unhurried conditions.",
    "Here are the specific mistakes that recur across dangerous goods incident investigations, and what actually prevents them.",
  ],
  sections: [
    {
      heading: "Trusting the shipper's classification without independent verification",
      paragraphs: [
        "The single most consistent factor across dangerous goods incidents is a classification accepted from the shipper's declaration without independent cross-check against the Code itself. Shippers make classification errors — sometimes through genuine misunderstanding of a borderline substance, occasionally through commercial pressure to under-declare a class that carries stricter (and more expensive) handling requirements.",
        "A ship's obligation does not end at receiving a declaration; verifying the declared UN number, proper shipping name, class and packing group against the IMDG Code's own dangerous goods list is a genuine check, not a formality, and it is the single step most consistently skipped under normal cargo operation time pressure.",
      ],
    },
    {
      heading: "Segregation table misreads: the interaction that matters, not just the class",
      paragraphs: [
        "The IMDG segregation table specifies required separation not by hazard class alone, but by the specific interaction between two classes — 'away from', 'separated from', 'separated by a complete compartment or hold from', and stricter categories still, each meaning something specifically different and specifically checkable, not interchangeable levels of general caution.",
        "The recurring error is applying a general sense of 'these should probably be kept apart' rather than the table's specific, mandated separation for that exact class pairing — which on a fully loaded containership with dozens of dangerous goods bookings across multiple classes is a genuinely complex planning exercise, not a quick visual check.",
      ],
    },
    {
      heading: "Packing group confusion: it changes requirements, not just risk level",
      paragraphs: [
        "Packing groups I, II and III indicate the degree of danger within a hazard class, and they are frequently treated as a rough severity indicator rather than what they actually are: a classification that changes specific packaging, quantity limitation, and in some cases segregation requirements. Two substances in the same hazard class but different packing groups can carry meaningfully different handling requirements, not just a different risk label.",
      ],
    },
    {
      heading: "Marine pollutant status: often missed because it sits outside the primary hazard class",
      paragraphs: [
        "A substance can carry marine pollutant status as an additional classification independent of, and sometimes easy to overlook alongside, its primary hazard class — meaning a shipment correctly classified and segregated for its primary hazard can still be mishandled from a marine pollutant standpoint if that separate designation isn't independently checked and factored into stowage and, where relevant, MARPOL Annex III documentation.",
      ],
    },
    {
      heading: "Documentation gaps: the dangerous goods manifest versus what's actually stowed",
      paragraphs: [
        "A ship's dangerous goods manifest must accurately reflect what is actually on board, in the actual stowage location — and discrepancies between the manifest and physical reality are a recurring finding, usually arising from late bookings, last-minute stowage changes, or container substitutions that update the physical plan without a corresponding update to the manifest reaching the right person before departure.",
        "This is precisely the kind of gap that turns catastrophic in an emergency: firefighting and emergency response planning in the event of an incident depends entirely on the manifest accurately showing what's where, and a manifest that's technically complete but doesn't match physical reality removes the exact information an emergency response most needs.",
      ],
    },
    {
      heading: "Stowage away from ignition sources and incompatible cargo: the check that gets rushed",
      paragraphs: [
        "IMDG stowage requirements account for proximity not just to other dangerous goods, but to ignition sources, accommodation, and temperature-sensitive areas of the ship — requirements that are straightforward individually but easy to deprioritise under the time pressure of a full cargo operation with a sailing schedule to meet.",
        "The practical failure mode here is rarely ignorance of the requirement; it is the stowage plan being finalised under enough time pressure that the dangerous goods-specific checks get a final pass rather than the same careful review they'd receive with more time available.",
      ],
    },
    {
      heading: "The discipline that actually prevents incidents",
      paragraphs: [
        "Every mistake covered here shares the same underlying cause: complexity meeting time pressure. The Code itself is detailed enough to handle almost any genuine dangerous goods scenario correctly — the incidents happen when that detail gets compressed into a faster check than it was designed to withstand.",
        "The IMDG / Dangerous Goods reference in ShipCrewFinder's free Crew Toolkit is built around exactly the checks covered here — classification verification, segregation requirements, and packing group implications — organised for the kind of quick, accurate reference that cargo operations under real time pressure actually need.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the most common cause of dangerous goods incidents at sea?",
      answer:
        "A chain of small mistakes rather than a single reckless decision — most consistently, accepting a shipper's classification without independent verification against the IMDG Code, followed by segregation table misreads under time pressure.",
    },
    {
      question: "What does the IMDG segregation table actually specify?",
      answer:
        "Required separation between specific hazard class pairings, using defined categories — 'away from', 'separated from', 'separated by a complete compartment or hold from', and stricter still — each meaning a specifically different, checkable requirement, not a general degree of caution.",
    },
    {
      question: "Does packing group only indicate risk severity?",
      answer:
        "No. Packing groups I, II and III change specific packaging, quantity limitation, and in some cases segregation requirements — two substances in the same class but different packing groups can have meaningfully different handling requirements, not just different risk labels.",
    },
    {
      question: "Why does the dangerous goods manifest matter so much in an emergency?",
      answer:
        "Emergency and firefighting response planning depends entirely on the manifest accurately reflecting what's on board and where. A manifest that's technically complete but doesn't match physical stowage — often from late bookings or unrecorded container substitutions — removes exactly the information an emergency response needs most.",
    },
    {
      question: "Is marine pollutant status the same as a substance's primary hazard class?",
      answer:
        "No — it's an additional, independent classification that can apply alongside a primary hazard class, and it's commonly overlooked because it sits outside the primary class check most crews default to.",
    },
  ],
};

export default post;
