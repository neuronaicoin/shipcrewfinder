import type { BlogPost } from "./types";

const post: BlogPost = {
  slug: "how-to-plan-a-ship-voyage-route-eta-fuel-calculator-guide-2026",
  title: "How to Plan a Ship's Voyage: Route, ETA, Fuel and ROB Calculation Explained (2026 Guide)",
  description:
    "The full voyage planning method: sea route distance, ETA, fuel burn and ROB calculation explained step by step, the way Masters and Officers use it.",
  category: "Deck Operations",
  author: "Maritime industry professional",
  date: "2026-09-21",
  readingMinutes: 11,
  excerpt:
    "Distance, ETA, fuel burn and ROB at arrival — the voyage planning method behind every passage plan, explained the way Masters and watchkeeping officers actually use it, from appraisal to monitoring.",
  keywords: [
    "how to plan a ship voyage",
    "voyage planning steps for seafarers",
    "how to calculate ship ETA distance and speed",
    "fuel consumption calculator for ships",
    "ROB remaining on board calculation",
    "sea route distance between two ports",
    "ECA SECA zones voyage planning",
    "passage planning appraisal planning execution monitoring",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Ship's bridge chart table used for voyage and passage planning",
  intro: [
    "A voyage plan is not a formality signed off before departure and forgotten. It is the working document a bridge team actually uses — the one that turns a departure port, an arrival port and a set of numbers on paper into a defensible answer to three questions someone will always ask: how far, how long, and how much fuel. Get any of the three wrong by a meaningful margin and the consequences are not abstract — a missed berth window, a chartered vessel arriving hours late against a laytime clause, or a ship burning into its safety margin somewhere without a bunkering option nearby.",
    "The method behind a sound voyage plan has not changed in principle since SOLAS Chapter V, Regulation 34 formalised it: appraisal, planning, execution, monitoring — the four stages every certificated deck officer studies for an oral exam and then, if the plan is done properly, actually uses. What has changed is how much of the arithmetic can be removed from the process without removing the officer's judgement from it.",
    "This is that method, in the order it is actually worked through, followed by the calculations — distance, ETA, fuel burn and ROB at arrival — that turn the plan into numbers a Master, an operator or a charterer can rely on.",
  ],
  sections: [
    {
      heading: "The four-stage framework: appraisal, planning, execution, monitoring",
      paragraphs: [
        "Appraisal comes first: gathering everything relevant to the intended passage — charts and their corrections, sailing directions, tidal information, weather routeing guidance, known hazards, and the ship's own particulars (draft, air draft, manoeuvring characteristics). A plan built before the appraisal is complete is a plan built on assumptions.",
        "Planning turns that information into a track: the route from berth to berth, marked with course alterations, clearance distances from hazards, positions where speed or heading must change, and contingency options if the plan cannot be followed exactly. This is also where the numbers this guide focuses on get worked out — distance, ETA and fuel.",
        "Execution is sailing the plan as written, and monitoring is the ongoing check that the vessel's actual position matches the intended track — the stage most likely to catch an error made during planning before it becomes a real problem.",
      ],
    },
    {
      heading: "Step 1: sea distance — why great circle and rhumb line aren't the whole answer",
      paragraphs: [
        "The distance figure a voyage plan is built on is rarely a straight line on a Mercator chart. A rhumb line (constant compass heading) is simple to steer but usually longer than necessary on an ocean crossing; a great circle is the shortest theoretical path between two points on a sphere but frequently crosses land, ice limits, or routes a prudent Master would not choose regardless of distance saved.",
        "In practice, the distance used for planning is neither of these in isolation — it is a sea-only route that follows the great circle where open ocean allows it, deviates around landmasses and known routing restrictions, and passes through the canals and straits actually used by commercial traffic (Suez, Panama, Gibraltar, Malacca, and the rest). This is the figure that matters for fuel and ETA, and it is the one worth getting from an actual routing calculation rather than a chart-ruler estimate.",
      ],
      links: [
        { text: "Plan a real sea-only route between any two ports", href: "/vessel-tracker" },
      ],
    },
    {
      heading: "Step 2: ETA — distance, speed, and the margin most plans forget",
      paragraphs: [
        "ETA itself is simple arithmetic: distance in nautical miles divided by speed in knots gives duration in hours. The part that is not simple is choosing which speed to use. Service speed in calm water and the speed a vessel actually makes against weather, current and a fouled hull over a multi-week passage are rarely the same number, which is why a sound plan adds a sea margin — commonly in the range of a few percent of total distance, more on a route with known adverse currents or a seasonal weather pattern — rather than presenting a single optimistic ETA as fact.",
        "This matters most where ETA has a contractual consequence: a laytime clause, a berth booking, a connecting charter. An ETA presented without a margin is a number that looks precise and is quietly unreliable.",
      ],
    },
    {
      heading: "Step 3: fuel burn — daily consumption over the whole voyage",
      paragraphs: [
        "Once duration is known, fuel burn follows directly: daily consumption at the planned speed, multiplied by voyage duration in days. Daily consumption itself is not a single number for most vessels — main engine consumption at sea speed, auxiliary/generator consumption, and port consumption during any calls along the route are typically tracked separately, often against different fuel grades (VLSFO, HSFO, LSMGO) depending on the vessel's fuel strategy and whichever emission control areas the route passes through.",
        "The total figure that actually matters operationally is not just tonnes burned — it is what that leaves in the tanks. ROB (remaining on board) at departure, minus total fuel burned over the voyage, gives ROB at arrival. A plan that shows a positive fuel burn number but never carries it through to an ROB-at-arrival figure is missing the check that actually prevents running short.",
      ],
    },
    {
      heading: "Step 4: ECA and SECA zones change the calculation, not just the compliance box",
      paragraphs: [
        "Emission and sulphur control areas — the Baltic and North Sea SECAs, the Mediterranean SECA, the North American and US Caribbean ECAs among them — require a lower-sulphur fuel while transiting, which for a vessel running on HSFO outside those zones means a fuel changeover, tracked separately in the log, and often a different consumption profile for the fuel used inside the zone. A voyage plan that only calculates total distance without flagging which portion of the route falls inside an ECA is incomplete for any vessel not already running exclusively on compliant fuel.",
        "This is also where planning and compliance intersect with cost: bunker price differentials between fuel grades mean the zones a route passes through are not just a regulatory detail, they are a real line item in the voyage's total fuel cost.",
      ],
      links: [
        { text: "How CII and EEXI actually affect voyage planning", href: "/blog/cii-eexi-explained-carbon-intensity-guide-2026" },
      ],
    },
    {
      heading: "Where voyage plans actually go wrong",
      paragraphs: [
        "In practice, few voyage plans are wrong because of a single dramatic miscalculation. They are wrong because of the same handful of small gaps, repeated: a distance figure taken from a straight-line chart measurement rather than an actual sea route, an ETA with no sea margin presented as a firm date, a fuel calculation that stops at total tonnes burned instead of carrying through to ROB at arrival, or a route that crosses a SECA without anyone flagging the fuel changeover in advance.",
        "None of these require better judgement to avoid — they require the arithmetic to be done completely, every time, which is exactly the part manual calculation under time pressure is worst at.",
      ],
    },
    {
      heading: "Doing the calculation without the manual risk",
      paragraphs: [
        "ShipCrewFinder's Voyage Planner runs the sea-only route between any two ports worldwide — not a straight line, an actual maritime route through the canals and straits real traffic uses — and calculates distance, ETA at the entered speed, total fuel burned from a daily consumption figure, and ROB at arrival if a departure ROB is entered. Ports the route passes through are checked against known ECA/SECA zones, and live wind and sea-state conditions can be checked at any point along the route or at either port.",
        "The route itself is not fixed: any point along the calculated line can be dragged to route the passage through a specific waypoint, and the plan can be saved and reloaded rather than recalculated from scratch on the next voyage.",
      ],
      links: [
        { text: "Try the Voyage Planner — free, no login required", href: "/vessel-tracker" },
        { text: "Draft Survey Calculator Pro — the other side of a cargo voyage", href: "/blog/draft-survey-calculation-complete-guide-2026" },
      ],
    },
  ],
  faqs: [
    {
      question: "What are the 4 stages of voyage planning?",
      answer:
        "SOLAS Chapter V, Regulation 34 sets out four stages: appraisal (gathering charts, weather, hazards and vessel particulars), planning (turning that information into a marked route with distances, course alterations and contingencies), execution (sailing the plan as written), and monitoring (continuously checking actual position against the intended track).",
    },
    {
      question: "How do you calculate a ship's ETA?",
      answer:
        "Divide the sea route distance in nautical miles by the planned speed in knots to get duration in hours. A sound plan adds a sea margin — a few percent of total distance, more on routes with known adverse current or seasonal weather — rather than presenting the calm-water speed result as a firm ETA.",
    },
    {
      question: "How is fuel consumption calculated for a voyage?",
      answer:
        "Daily fuel consumption at the planned speed is multiplied by the voyage duration in days to give total fuel burned. Subtracting that from ROB (remaining on board) at departure gives ROB at arrival — the figure that actually confirms whether the fuel carried is sufficient, not just the total tonnes burned.",
    },
    {
      question: "What does ROB mean in shipping?",
      answer:
        "ROB stands for Remaining On Board — the quantity of fuel (or other consumable) left in the vessel's tanks at a given point. ROB at arrival is calculated as ROB at departure minus total consumption over the voyage, and is tracked separately for each fuel grade the vessel carries.",
    },
    {
      question: "Why isn't a great circle route always the shortest usable distance?",
      answer:
        "A great circle is the shortest theoretical path between two points on a sphere, but it frequently crosses land, ice limits or areas a prudent route would avoid. The distance actually used for voyage planning is a sea-only route that follows the great circle where open ocean allows it and deviates around landmasses and through the canals and straits real traffic uses.",
    },
    {
      question: "Is there a free tool to calculate route distance, ETA and fuel for a voyage?",
      answer:
        "ShipCrewFinder's Voyage Planner calculates a real sea-only route between any two ports, along with distance, ETA at the entered speed, total fuel burned and ROB at arrival, plus ECA/SECA zone and live weather information — free, with no login required.",
    },
  ],
};

export default post;
