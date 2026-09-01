import type { BlogPost } from "./types";

const post: BlogPost = {
  slug: "draft-survey-calculation-complete-guide-2026",
  title: "Draft Survey Calculation Explained: The Complete Step-by-Step Method (2026)",
  description:
    "Mean draft, hog and sag correction, quarter mean, trim correction, density correction — the full quadratic-mean draft survey method explained step by step, with the exact formulas Chief Officers and Masters use to settle cargo quantity.",
  category: "Deck Operations",
  author: "Maritime industry professional",
  date: "2026-08-22",
  readingMinutes: 12,
  excerpt:
    "The formula that settles what a bulk carrier actually loaded or discharged — explained step by step, from draft readings to final cargo figure, the way real surveyors calculate it.",
  keywords: [
    "draft survey calculation formula",
    "how to calculate cargo quantity draft survey",
    "quadratic mean draft formula",
    "draft survey step by step",
    "hog and sag correction draft survey",
    "trim correction draft survey formula",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1587613864411-b8a67c9dea67?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Bulk carrier hull at the waterline, showing draft marks used in draft survey calculation",
  intro: [
    "On a bulk carrier with no load cells and no shore weighbridge, the draft survey is the only method available to answer a question worth real money to everyone involved: how much cargo actually moved. Charterers, shippers, receivers and P&I clubs all treat the figure it produces as the reference number — the one the bill of lading gets checked against, and the one that surfaces first in any cargo claim.",
    "The method itself has not changed in decades: read the drafts, correct them, interpolate against the ship's own hydrostatic particulars, and arrive at a displacement before and after loading. What has changed is how much room for error that process leaves when it is done by hand, under time pressure, on a hydrostatic table with over two hundred rows — which is precisely where most disputed draft surveys actually go wrong.",
    "This is the full method, in the order a Chief Officer or Master actually works through it, including the two corrections most self-taught explanations quietly skip.",
  ],
  sections: [
    {
      heading: "Step 1: read six drafts, not three",
      paragraphs: [
        "A proper draft survey reads the draft at forward, midship and aft, on both port and starboard sides — six readings, not three. Reading only one side and assuming symmetry is a common shortcut that introduces error before the calculation has even started, particularly on a ship with any degree of list.",
        "Each pair (STBD and PORT at the same position) is averaged into a mean draft for that position. This is the raw data every subsequent step is built on, and it is worth the extra few minutes at the rail to get it right — no formula downstream corrects for a misread draft mark.",
      ],
    },
    {
      heading: "Step 2: correct for the distance between draft marks and the perpendiculars",
      paragraphs: [
        "Draft marks are rarely painted exactly at the forward and aft perpendiculars — there is almost always a small offset, measured in metres, that must be corrected for using the ship's own particulars and the observed trim. Skipping this correction is a small error individually, but on a ship with a significant offset it compounds directly into the displacement lookup in Step 4.",
      ],
    },
    {
      heading: "Step 3: hog and sag correction — the step most explanations skip",
      paragraphs: [
        "A ship's hull is not perfectly rigid: under certain loading conditions it flexes very slightly, hogging (bowing upward at midship) or sagging (bowing downward at midship). The corrected midship draft is compared against the mean of the corrected forward and aft drafts — if the midship reading is lower than that mean, the ship is hogging; if higher, sagging.",
        "This is not a rounding-error correction. On a fully loaded bulk carrier it can shift the calculated draft by several centimetres, which at typical bulk carrier tonnes-per-centimetre figures translates directly into tens of tonnes of displacement. Any draft survey explanation that jumps straight from corrected drafts to a mean draft without addressing hog and sag is describing an incomplete method.",
      ],
    },
    {
      heading: "Step 4: the quarter mean draft, and the lookup it drives",
      paragraphs: [
        "The corrected drafts are combined into the quarter mean draft — weighted six parts midship to one part each forward and aft — which is the single figure used to enter the ship's hydrostatic table. From it, displacement, TPC (tonnes per centimetre immersion), MTC (moment to change trim) and LCF (longitudinal centre of flotation) are read or interpolated.",
        "This is also where hand calculation becomes genuinely error-prone: a real hydrostatic table runs to hundreds of rows in fine draft increments, and the quarter mean draft rarely lands exactly on a tabulated value. Interpolating correctly between two rows, under time pressure, with a cargo operation waiting, is the single step most likely to introduce a transcription error into an otherwise sound survey.",
      ],
    },
    {
      heading: "Step 5: first and second trim correction",
      paragraphs: [
        "Displacement read straight from the quarter mean draft assumes the ship is on an even keel, which it almost never is. Two further corrections adjust for trim: a first trim correction using TPC, LCF and the trim itself, and a second trim correction using the rate of change of MTC with draft — a refinement that matters more on ships with a longer LBP and larger trim angles.",
        "Both corrections are applied to the same reference length, the ship's LBP — a detail that is easy to get wrong by substituting the length between draft marks instead, which produces a plausible-looking but incorrect result.",
      ],
    },
    {
      heading: "Step 6: density correction, and the final cargo figure",
      paragraphs: [
        "Displacement tables are built for a reference water density, usually 1.025 t/m³. The actual dock water density, measured on site, is almost always different, and the trim-corrected displacement must be adjusted proportionally to reflect the water the ship is actually floating in.",
        "The result is the corrected displacement — repeated for both the initial survey (before loading or discharging) and the final survey (after). Subtracting known deductible weights (bunkers, fresh water, ballast, other consumables) from each gives the net displacement at each end, and the difference between the two net displacement figures is the cargo quantity: the number that goes on the mate's receipt and gets checked against the bill of lading.",
      ],
    },
    {
      heading: "Where disputed draft surveys actually come from",
      paragraphs: [
        "In practice, disputes rarely trace back to a single dramatic error. They trace back to the accumulation of several small ones: a hydrostatic table interpolation off by one row, a trim correction calculated against the wrong reference length, a hog/sag correction skipped entirely under time pressure. Each is individually small. Together, on a large parcel, they can shift the calculated cargo quantity by an amount worth arguing about.",
        "The fix is not a different method — the quadratic mean draft survey is the industry standard for a reason — it is removing the manual steps where transcription and interpolation errors actually happen.",
      ],
    },
    {
      heading: "Doing the calculation without the manual risk",
      paragraphs: [
        "Draft Survey Calculator Pro on ShipCrewFinder runs this exact method — hog/sag correction, quarter mean, first and second trim correction, density correction — against your own vessel's hydrostatic table, entered once and reused for every future survey. Every intermediate figure is shown, not hidden, so the calculation can be checked line by line, and the final report exports as a clean, signable PDF.",
        "The formula chain was built and verified against a real vessel's certified draft survey worksheet, matched intermediate value by intermediate value to the last decimal — the same standard any surveyor would hold a manual calculation to.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is a draft survey used for?",
      answer:
        "A draft survey calculates the quantity of cargo loaded or discharged on a bulk carrier by comparing the ship's displacement before and after the cargo operation, using draft readings, hydrostatic particulars, and a series of corrections — the standard method when no shore weighbridge or load cell system is available.",
    },
    {
      question: "What is the formula for draft survey calculation?",
      answer:
        "Six draft readings (forward, midship, aft, both sides) are averaged and corrected for the distance from draft marks to the perpendiculars, then checked for hog or sag. The quarter mean draft is used to look up displacement, TPC, MTC and LCF from the hydrostatic table, corrected for trim (first and second correction) and for water density, then adjusted for known deductibles to give net displacement — the difference between initial and final net displacement is the cargo quantity.",
    },
    {
      question: "What is hog and sag correction in a draft survey?",
      answer:
        "It corrects for the hull's slight flex under load: if the corrected midship draft reads lower than the mean of forward and aft, the ship is hogging; if higher, sagging. It is applied before calculating the quarter mean draft and can shift the result by tens of tonnes on a fully loaded bulk carrier.",
    },
    {
      question: "Why do first and second trim corrections both use LBP, not the length between draft marks?",
      answer:
        "Both trim corrections are referenced to the ship's fixed length between perpendiculars (LBP), which is a constant particular of the vessel — not the length between draft marks, which varies with where the marks happen to be painted and is already accounted for in an earlier correction step.",
    },
    {
      question: "Does draft survey calculation work for any bulk carrier?",
      answer:
        "The quadratic mean draft method itself is universal — the same formulas apply to any bulk carrier. What differs is vessel-specific input: each ship's own LBP and hydrostatic table (displacement, TPC, MTC and LCF by draft) must be used for an accurate result.",
    },
    {
      question: "Is there a tool that runs the full draft survey calculation automatically?",
      answer:
        "Draft Survey Calculator Pro on ShipCrewFinder runs the complete quadratic-mean method — hog/sag, trim and density corrections included — against your own vessel's hydrostatic table, with every intermediate figure shown and a signable PDF report exported at the end.",
    },
  ],
};

export default post;
