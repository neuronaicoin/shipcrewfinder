import type { BlogPost } from "./types";

const post: BlogPost = {
  slug: "garbage-record-book-marpol-annex-v-guide-2026",
  title: "Garbage Record Book: The Complete MARPOL Annex V Guide (2026)",
  description:
    "Every garbage category, every code, the special area rules that trip up most crews, and the PSC deficiencies that come from a book most officers treat as an afterthought next to the Oil Record Book.",
  category: "Engine Room",
  author: "Maritime industry professional",
  date: "2026-08-26",
  readingMinutes: 10,
  excerpt:
    "The Oil Record Book gets all the attention at inspection. The Garbage Record Book generates just as many deficiencies — for reasons almost nobody explains properly.",
  keywords: [
    "garbage record book guide",
    "marpol annex v categories",
    "garbage record book codes",
    "how to fill garbage record book",
    "special area garbage disposal rules",
    "garbage management plan ship",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Container ship at sea, representing waste management operations covered by MARPOL Annex V",
  intro: [
    "Ask a Chief Engineer to name the document that causes the most PSC anxiety and almost everyone says the Oil Record Book. Ask a Port State Control officer which record they most often find quietly wrong, and a surprising number will say the Garbage Record Book — not because it is harder to keep, but because it is treated as the less serious of the two, filled in at the end of the watch from memory rather than at the time of the operation.",
    "MARPOL Annex V is not a minor annex. Since the 2013 revision it presumes all garbage discharge into the sea is prohibited unless a specific exception applies, which inverted the entire logic crews had operated under for decades — and a meaningful share of ships still keep the book as though the old, more permissive rules were still in force.",
    "This is the full category structure, the special area rules that generate the most confusion, and the specific entries PSC officers flag most often.",
  ],
  sections: [
    {
      heading: "The category structure: what actually counts as which type of garbage",
      paragraphs: [
        "Annex V splits garbage into categories that must be recorded separately, not lumped together: plastics, food waste, domestic waste, cooking oil, incinerator ash, operational waste, animal carcasses, fishing gear, and — since the most recent amendments — e-waste and cargo residues that are harmful to the marine environment. Each category has its own disposal rules, and several have zero-discharge requirements everywhere, not just in special areas.",
        "The most consequential distinction most crews get wrong is between operational waste and cargo residues. Cargo residue that is classified as harmful to the marine environment is subject to the same near-total discharge prohibition as plastic — a rule that surprises officers used to thinking of cargo hold washings as routine.",
      ],
    },
    {
      heading: "Plastics: the one category with almost no exceptions",
      paragraphs: [
        "Discharge of plastics into the sea has been completely prohibited since Annex V's original 1988 entry into force, and nothing in the subsequent amendments has softened that — it remains the single clearest rule in the entire annex. Every plastic item generated on board, from packaging to synthetic rope, must be retained for shore disposal or, where permitted and equipped, incinerated on board with the resulting ash handled as a separate category.",
        "This sounds simple until a ship's actual waste stream is examined: fishing gear with plastic components, synthetic line offcuts, and packaging mixed with food waste all require separation before disposal, and a crew that treats 'plastic-adjacent' waste casually is the crew most likely to generate a genuine Annex V violation, not just a paperwork deficiency.",
      ],
    },
    {
      heading: "Special areas: where the ordinary rules get stricter still",
      paragraphs: [
        "Annex V designates special areas — the Mediterranean, Baltic, Black Sea, Red Sea, Gulf area, North Sea, Antarctic area, Wider Caribbean and others — where discharge limits for food waste and other categories tighten considerably beyond the standard rules, and where several categories permitted elsewhere are prohibited outright.",
        "The practical failure mode is not ignorance of the special area list — most crews know roughly where they are — it is failing to adjust the garbage record entries to reflect the stricter distance-from-land and processing requirements that apply inside those boundaries, particularly for food waste, which has by far the most complex set of conditional rules of any category.",
      ],
    },
    {
      heading: "Food waste: the category with the most conditional rules",
      paragraphs: [
        "Outside special areas, comminuted or ground food waste may be discharged no less than 3 nautical miles from the nearest land; non-comminuted food waste requires 12 nautical miles. Inside most special areas, comminuted food waste discharge distance extends to 12 nautical miles, and several special areas prohibit any food waste discharge closer than that regardless of processing.",
        "This is the single rule most likely to be recorded incorrectly, because it depends on three variables at once — location, distance, and processing state — and a ship crossing in or out of a special area boundary mid-voyage must adjust its practice at the boundary, not at the next convenient watch change.",
      ],
    },
    {
      heading: "What actually goes wrong at inspection",
      paragraphs: [
        "The deficiencies that recur most often are not exotic. A garbage record entry with no position recorded for an at-sea discharge — a position is required for every discharge entry, exactly as with the Oil Record Book. Entries batched at the end of a multi-day passage instead of logged at the time each discharge or incineration actually occurred. A Garbage Management Plan on board that does not match the categories and procedures actually being followed, which inspectors treat as evidence the crew has not been properly briefed on the plan they are supposed to be using.",
        "The recurring theme across all of these is the same one that drives most Oil Record Book deficiencies too: the book is filled in from memory, after the fact, rather than as each operation happens — and a category or distance recalled slightly wrong looks, on paper, exactly like a genuine violation.",
      ],
    },
    {
      heading: "Incineration: its own set of restrictions",
      paragraphs: [
        "Shipboard incineration of garbage is permitted only in an approved incinerator, and is itself prohibited for certain materials — PCBs, garbage containing more than trace heavy metals, and refined petroleum products containing halogen compounds among them — regardless of location. Incineration in port or at anchor is separately restricted under most port regulations even where it would be permitted at sea, which is a distinction crews transiting frequently between short coastal legs sometimes miss.",
        "Every incineration operation requires its own Garbage Record Book entry — position (if at sea), category and approximate quantity incinerated, and the resulting ash handled and recorded as its own separate category rather than folded into the original garbage type.",
      ],
    },
    {
      heading: "Keeping the record right, the same way as the Oil Record Book",
      paragraphs: [
        "The underlying discipline is identical to the one that keeps an Oil Record Book clean: log the operation as it happens, with the correct category and — where required — position, rather than reconstructing a plausible-sounding entry later from memory. A Garbage Record Book kept with that discipline rarely generates a deficiency on its own; one that isn't, almost always does, sooner or later.",
        "If your ship also handles the Oil Record Book Part I under MARPOL Annex I, Oil Record Book Pro on ShipCrewFinder applies the same at-the-time, no-memory-required approach to that book — pick the operation, and the correct code and item number are generated automatically.",
      ],
    },
  ],
  faqs: [
    {
      question: "What garbage categories does MARPOL Annex V require recording?",
      answer:
        "Plastics, food waste, domestic waste, cooking oil, incinerator ash, operational waste, animal carcasses, fishing gear, and e-waste and harmful cargo residues under the more recent amendments — each recorded as its own category, not combined.",
    },
    {
      question: "Can plastic ever be legally discharged at sea?",
      answer:
        "No. Discharge of all plastics into the sea has been completely prohibited since Annex V's original entry into force, with no exceptions for special areas or distance from land — it must be retained for shore disposal or incinerated on board where equipped.",
    },
    {
      question: "How far from land can food waste be discharged?",
      answer:
        "Outside special areas: at least 3 nautical miles for comminuted or ground food waste, 12 nautical miles for non-comminuted. Inside most special areas the distance for comminuted food waste extends to 12 nautical miles, and several special areas prohibit food waste discharge entirely below that distance.",
    },
    {
      question: "Does every garbage discharge entry require a position?",
      answer:
        "Yes, for any at-sea discharge — the same requirement as most Oil Record Book entries. A missing position on a discharge entry is one of the most common Garbage Record Book deficiencies found during Port State Control inspections.",
    },
    {
      question: "What is the most common Garbage Record Book deficiency?",
      answer:
        "Entries logged in batches after the fact rather than at the time of each operation, missing positions on discharge entries, and a Garbage Management Plan on board that doesn't match the categories and procedures the crew is actually following.",
    },
  ],
};

export default post;
