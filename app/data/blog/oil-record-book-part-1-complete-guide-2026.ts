import type { BlogPost } from "./types";

const post: BlogPost = {
  slug: "oil-record-book-part-1-complete-guide-2026",
  title: "Oil Record Book Part I: The Complete Guide to Codes, Entries and PSC Deficiencies (2026)",
  description:
    "Every code, every item number, every common PSC deficiency — a complete, practical guide to filling the Oil Record Book Part I correctly under MARPOL Annex I, for Chief Engineers and 2nd Engineers.",
  category: "Engine Room",
  author: "Maritime industry professional",
  date: "2026-08-20",
  readingMinutes: 11,
  excerpt:
    "The Oil Record Book is the single most inspected document in the engine room. Here is every code, every common mistake, and why so many PSC deficiencies trace back to one book.",
  keywords: [
    "oil record book part 1 guide",
    "how to fill oil record book",
    "marpol annex I oil record book codes",
    "oil record book psc deficiency",
    "oil record book code list",
    "chief engineer oil record book",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Ship's engine room control panel, representing the machinery space operations logged in the Oil Record Book",
  intro: [
    "Ask any Chief Engineer which single document causes the most anxiety during a Port State Control inspection, and most will say the same thing before the inspector has even opened it: the Oil Record Book. Not because the operations it records are complicated — sludge disposal, bilge water discharge, bunkering — but because the book itself, MARPOL Annex I's official record of every oil-related operation in the machinery space, punishes inconsistency in a way few other documents do.",
    "A missed signature, a code entered under the wrong letter, a bilge discharge logged without the matching Oil Content Meter reading — none of these are operational failures. The oil was handled correctly. The paperwork was not. And under the Convention, that distinction rarely matters to an inspector: a poorly kept Oil Record Book is treated as evidence that oil is not being handled correctly, whether or not that is true.",
    "This guide covers the full code structure (A through I), the exact item numbers each operation requires, the entries that generate the most PSC deficiencies, and what actually changed in the amendments that most crew have never been formally walked through.",
  ],
  sections: [
    {
      heading: "What the Oil Record Book Part I actually is",
      paragraphs: [
        "Required under MARPOL Annex I, Regulation 17, the Oil Record Book Part I applies to every ship of 400 gross tonnage and above, recording every machinery space operation involving oil: ballasting and cleaning of fuel tanks, disposal of oily residues, discharge of bilge water, bunkering, and any accidental or exceptional discharge.",
        "It is a legal document, not an internal log. Flag State surveyors, Port State Control officers, and — in the event of a pollution incident — investigators and courts all treat entries in the Oil Record Book as evidence. That is the entire reason the coding system exists: a standardised code and item number lets any inspector anywhere in the world read an entry from any ship and understand exactly what operation took place, without needing a narrative explanation.",
      ],
    },
    {
      heading: "The code structure: A through I, in full",
      paragraphs: [
        "Every entry starts with a single letter code identifying the category of operation, followed by an item number identifying the specific detail being recorded within that category. Getting the code right matters as much as getting the numbers right — a correct bunkering figure logged under the wrong code is still a deficiency.",
      ],
    },
    {
      heading: "Codes C through E: sludge, bilge and disposal",
      paragraphs: [
        "Code C covers ballasting or cleaning of fuel oil tanks. Code D covers non-automatic discharge or disposal of bilge water accumulated in machinery spaces — the entry most commonly triggered day to day. Code E covers automatic discharge via the Oily Water Separator, and requires the corresponding Oil Content Meter printout to be retained and cross-referenced.",
        "This is where the majority of real deficiencies originate, because these are also the most frequent entries — a ship making one bilge discharge entry every few days accumulates far more opportunities for a coding or item-number slip than one making a single bunkering entry per port call.",
      ],
    },
    {
      heading: "Codes F through I: filtering equipment, discharges, bunkering and other operations",
      paragraphs: [
        "Code F records the condition of the Oil Filtering Equipment — critically, both when it fails and, separately, when normal operation is restored, each requiring its own full entry rather than a single combined note. Code G covers accidental or exceptional discharges of oil, the category inspectors scrutinise hardest because it is the category most directly tied to actual pollution events.",
        "Code H is bunkering: every fuel or lubricating oil delivery, with the receiving tank, quantity, and grade specified per tank rather than as a single total. Code I is the catch-all for additional operational procedures — general remarks, missed-entry corrections, and voluntary records such as weekly bilge tank inventories, which are not mandatory under the Convention but which experienced Chief Engineers keep anyway, because they demonstrate a pattern of diligence that inspectors read favourably.",
      ],
    },
    {
      heading: "The five deficiencies that come up again and again",
      paragraphs: [
        "Across Port State Control regimes, the same handful of Oil Record Book deficiencies recur with striking consistency. First: entries out of chronological order, or with gaps left for later completion — the book must be completed at the time of the operation, not reconstructed afterward. Second: a code entry with no matching Oil Content Meter record for automatic discharges under Code E.",
        "Third: bunkering entries that total the delivery instead of breaking it down tank by tank, which is technically incomplete even when the total figure is accurate. Fourth: a Code F entry made for equipment failure with no corresponding entry when the equipment was restored — leaving the book showing the filtering system as permanently out of service. Fifth, and most common of all on ships with more than one sludge or bilge tank: a code entered correctly but referencing the wrong tank designation, which on paper describes an operation that never physically happened.",
        "None of these are complicated mistakes. They are all consistency mistakes — the same kind of error that becomes far less likely when the code and item number are generated automatically from the operation you select, rather than recalled from memory under time pressure at the end of a watch.",
      ],
    },
    {
      heading: "Why this book specifically draws PSC attention",
      paragraphs: [
        "Port State Control officers are trained to treat the Oil Record Book as a proxy for the general standard of engine room management. An inspector who finds the book well kept — chronological, correctly coded, consistently signed — frequently extends that presumption of competence to the rest of the inspection. One found poorly kept has the opposite effect, and often triggers a more thorough review of everything else in the machinery space.",
        "This is precisely why an entry that is operationally correct but procedurally sloppy can do more damage to an inspection outcome than the underlying operation deserves. The book is not just a record; on the day of an inspection, it is the first and most detailed impression an inspector forms of how the ship is run.",
      ],
    },
    {
      heading: "Keeping it right, every time",
      paragraphs: [
        "The structural fix for most of these deficiencies is the same one experienced Chief Engineers already use informally: never write a code or item number from memory. Select the operation, let the code and item number follow automatically, and enter only the real, variable details — the quantity, the tank, the time.",
        "That is the exact logic behind Oil Record Book Pro on ShipCrewFinder: pick from all 24 official operations across Codes C through I, and the correct code and item number are generated for you every time, with tank balances tracked automatically so a transfer that would exceed a tank's capacity is flagged before it is ever logged. It exports as a clean, signable PDF, ready to transcribe into the official book or attach as a supporting record.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the Oil Record Book Part I used for?",
      answer:
        "It is the mandatory MARPOL Annex I record of every oil-related operation in a ship's machinery spaces — sludge disposal, bilge water discharge, bunkering, equipment failures, and accidental discharges — required for all ships of 400 gross tonnage and above.",
    },
    {
      question: "What are the Oil Record Book codes, from A to I?",
      answer:
        "Codes A and B cover ballasting and discharge of fuel oil tank washings. Code C covers collection and disposal of oil residues (sludge). Code D is non-automatic bilge water discharge, Code E automatic discharge via the OWS. Code F records filtering equipment condition, Code G accidental discharges, Code H bunkering, and Code I additional procedures and general remarks.",
    },
    {
      question: "What is the most common Oil Record Book PSC deficiency?",
      answer:
        "Entries made out of chronological order or left incomplete for later completion, followed closely by Code E entries missing the corresponding Oil Content Meter record, and Code F entries recording equipment failure with no matching entry when the equipment was restored.",
    },
    {
      question: "Do bunkering entries need to list every tank separately?",
      answer:
        "Yes. Under Code H (item 26.3), each tank that receives fuel must be listed individually with its quantity and the resulting total in that tank — a single combined delivery figure without the per-tank breakdown is considered incomplete.",
    },
    {
      question: "Is there a tool that generates Oil Record Book codes automatically?",
      answer:
        "Oil Record Book Pro on ShipCrewFinder covers all 24 official operations across Codes C through I. You select the operation and the correct code and item number are generated automatically, with tank balances tracked so overcapacity transfers are flagged before they're logged.",
    },
  ],
};

export default post;
