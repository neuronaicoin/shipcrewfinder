import type { BlogPost } from "./types";

const post: BlogPost = {
  slug: "cii-eexi-explained-carbon-intensity-guide-2026",
  title: "CII and EEXI Explained: What Every Officer Needs to Know in 2026",
  description:
    "What CII actually measures, how the A-to-E rating is calculated, what EEXI does differently, and what a poor CII rating actually means for a ship, its crew and its charter prospects.",
  category: "Regulations",
  author: "Maritime industry professional",
  date: "2026-08-27",
  readingMinutes: 10,
  excerpt:
    "Two acronyms, two different purposes, and a rating letter that increasingly decides which ships get chartered. Here is what CII and EEXI actually measure — and don't.",
  keywords: [
    "what is CII shipping",
    "CII rating explained",
    "EEXI vs CII difference",
    "how is CII calculated",
    "CII rating A to E meaning",
    "carbon intensity indicator ship",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Cargo ship at sea, representing the vessels rated under IMO's Carbon Intensity Indicator scheme",
  intro: [
    "Two IMO measures now sit at the centre of almost every conversation about a ship's operational future, and a large share of the officers who work under them could not clearly explain the difference between the two if asked. EEXI is a one-time technical certificate. CII is an annual, recalculated operational rating that follows the ship — and increasingly the crew's own fuel and voyage decisions — every single year it trades.",
    "The confusion is not really the crew's fault. Both measures came into force close together, both are expressed in numbers and letters that look similar on paper, and both get discussed in the same breath at almost every safety meeting and charterer call. But they measure genuinely different things, they are calculated differently, and getting a poor result on one says nothing reliable about the other.",
    "Here is what each actually measures, how the CII rating letter is really calculated, and what a poor rating means in practice — for the ship, and for the people running it.",
  ],
  sections: [
    {
      heading: "EEXI: a technical, one-time design check",
      paragraphs: [
        "The Energy Efficiency Existing Ship Index is a technical measure, calculated once, verifying that a ship's design — engine power, hull form, and any energy-saving devices fitted — meets a required efficiency threshold based on ship type and size. It is closer in spirit to a design certificate than an operational one: pass it, and no ongoing annual recalculation is required unless the ship is significantly modified.",
        "A ship that does not meet its required EEXI threshold has real options short of a rebuild — engine power limitation is the most common, technically a software and verified limit on maximum continuous rating rather than a hardware change, and it is now a routine fitment across a large share of the existing world fleet.",
      ],
    },
    {
      heading: "CII: an annual, operational, recalculated rating",
      paragraphs: [
        "The Carbon Intensity Indicator is entirely different in character. It is calculated every single year, using the ship's actual fuel consumption and distance sailed over that specific year — not its design, its actual operation. The same ship, run efficiently one year and inefficiently the next through decisions entirely outside the original design, can move between rating letters year to year.",
        "This is the detail that makes CII, unlike EEXI, something crew genuinely influence in real time: voyage speed, routing, hull and propeller condition, and auxiliary load management all feed directly into the year's actual CII figure, in a way that no crew decision can meaningfully change an EEXI result once the ship is built.",
      ],
    },
    {
      heading: "How the CII rating is actually calculated",
      paragraphs: [
        "CII is calculated as CO2 emitted per capacity-tonne-mile, expressed as an Attained CII figure, then compared against a Required CII reference line that tightens progressively year over year through 2030. The result is converted into a letter rating — A, B, C, D or E — using ship-type-specific boundaries published by IMO, with A representing the most carbon-efficient performance for that ship type and size, E the least.",
        "The reference line becoming stricter each year is the detail most often missed: a ship achieving exactly the same operational efficiency in 2027 as it did in 2024 will still see its rating letter decline over that period, purely because the bar it's measured against keeps moving. Standing still is a slow fail under CII, by design.",
      ],
    },
    {
      heading: "What a D or E rating actually triggers",
      paragraphs: [
        "A ship rated D for three consecutive years, or E for even a single year, is required to submit a corrective action plan as part of its Ship Energy Efficiency Management Plan, setting out how it intends to reach at least a C rating. This is a genuine administrative and operational burden, but it is not, by itself, a trading restriction — a D or E-rated ship can still trade.",
        "The practical consequence that actually bites is commercial rather than regulatory: charterers increasingly screen fleets by CII rating before fixing, and a poor rating on a specific ship can mean it is quietly passed over in favour of a better-rated sister vessel, well before any regulatory consequence is ever triggered.",
      ],
    },
    {
      heading: "Where crew decisions genuinely move the number",
      paragraphs: [
        "Because CII is calculated from actual annual fuel consumption and distance, the operational choices that most directly affect it are the ones officers already influence every voyage: maintaining an efficient service speed rather than sailing fast and waiting at anchor, keeping the hull and propeller in good condition between dry dockings, and managing auxiliary and boiler load rather than running equipment continuously out of habit.",
        "None of these are new practices invented for CII — they are the same efficient-operation habits good engineers and masters have always valued. What has changed is that they now show up in an annual number the whole company, and increasingly the charterer, can see.",
      ],
    },
    {
      heading: "The confusion that costs ships the most",
      paragraphs: [
        "The single most consequential misunderstanding is treating EEXI compliance as though it settles CII too. It does not. A ship can pass EEXI comfortably on the strength of its design and still earn a D or E CII rating through inefficient operation in a given year — and conversely, an older ship with a mediocre EEXI margin can still achieve a strong CII rating through disciplined operation. They are independent measures, and passing one provides no guarantee about the other.",
      ],
    },
    {
      heading: "Checking where a ship actually stands",
      paragraphs: [
        "Understanding the two thresholds in principle is one thing; checking a specific ship's actual attained figure against its required line, for the current year, is the calculation that matters day to day. The free CII Calculator in ShipCrewFinder's Crew Toolkit runs exactly that check — enter the ship's particulars and annual consumption figures and see the attained CII, the required reference line, and the resulting rating letter.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the difference between EEXI and CII?",
      answer:
        "EEXI is a one-time technical design check verifying a ship's engine power and hull efficiency meet a required threshold. CII is an annual operational rating, recalculated every year from actual fuel consumption and distance sailed, and it can change year to year based on how the ship is actually run.",
    },
    {
      question: "How is the CII rating letter calculated?",
      answer:
        "Attained CII (CO2 emitted per capacity-tonne-mile, from actual annual fuel and distance data) is compared against a Required CII reference line that tightens each year through 2030, and converted into a letter — A, B, C, D or E — using ship-type-specific boundaries published by IMO.",
    },
    {
      question: "What happens if a ship gets a D or E CII rating?",
      answer:
        "A D rating for three consecutive years, or an E rating even once, requires a corrective action plan under the ship's Energy Efficiency Management Plan. It is not a trading restriction by itself, but poorly rated ships are increasingly screened out by charterers before fixing.",
    },
    {
      question: "Can crew decisions actually improve a ship's CII rating?",
      answer:
        "Yes — unlike EEXI, which is fixed by design, CII is calculated from actual annual operation. Efficient service speed, hull and propeller condition, and auxiliary load management all feed directly into the year's attained CII figure.",
    },
    {
      question: "Does passing EEXI mean a ship will get a good CII rating?",
      answer:
        "No. The two are independent — a ship can pass EEXI comfortably on design alone and still earn a poor CII rating through inefficient operation in a given year, and vice versa. Passing one provides no guarantee about the other.",
    },
    {
      question: "Is there a free tool to check a ship's CII rating?",
      answer:
        "Yes — the CII Calculator in ShipCrewFinder's free Crew Toolkit calculates attained CII against the current required reference line and shows the resulting rating letter.",
    },
  ],
};

export default post;
