import type { BlogPost } from "./types";

const post: BlogPost = {
  slug: "eca-seca-fuel-changeover-procedure-guide-2026",
  title: "ECA/SECA Fuel Changeover Procedure: When and How to Switch Fuel Correctly (2026 Guide)",
  description:
    "The fuel changeover procedure for entering an ECA or SECA — timing it before the boundary, logging it correctly, and the mistakes that turn a routine switch into a PSC finding.",
  category: "Engine Room",
  author: "Maritime industry professional",
  date: "2026-09-21",
  readingMinutes: 9,
  excerpt:
    "Switching fuel too late, or without the right log entries, turns a routine ECA/SECA changeover into a compliance finding. The timing, the procedure, and the record-keeping that actually holds up.",
  keywords: [
    "ECA SECA fuel changeover procedure",
    "how to switch to low sulphur fuel",
    "fuel oil changeover checklist",
    "MARPOL Annex VI Regulation 14",
    "when to start fuel changeover before ECA",
    "fuel changeover log record book entry",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Engine room fuel system piping used for ECA/SECA fuel changeover procedures",
  intro: [
    "The sulphur limit itself is not the part that catches ships out. Every engineer knows an ECA or SECA requires fuel at 0.10% sulphur or below, against the global cap outside those zones. What catches ships out is the changeover itself — started too late, logged incompletely, or run without accounting for how long it actually takes to purge a fuel system of the higher-sulphur fuel it was running on.",
    "MARPOL Annex VI, Regulation 14 sets the limit. It does not do the timing calculation for you, and it is the timing — not the limit — that turns a routine, planned changeover into either a non-event or a Port State Control finding with the ship's own log as the evidence against it.",
  ],
  sections: [
    {
      heading: "Which zones require it, and what changes going in",
      paragraphs: [
        "The Baltic Sea, North Sea (including the English Channel), the Mediterranean Sea (SECA since May 2025), the North American ECA and the US Caribbean ECA all require compliant fuel — 0.10% sulphur or below — for the duration of the transit, not just while alongside. A vessel running on higher-sulphur fuel outside these zones has to be fully on compliant fuel by the time it crosses the boundary, which means the changeover has to start well before the boundary, not at it.",
        "Knowing which zones a route actually passes through is the first step, and it belongs in the voyage plan, not something worked out once the ship is already approaching the line.",
      ],
      links: [
        { text: "Check which ECA/SECA zones your route crosses", href: "/vessel-tracker" },
      ],
    },
    {
      heading: "Timing the changeover: working backward from the boundary",
      paragraphs: [
        "A fuel system does not switch instantly — the higher-sulphur fuel already in the service tank, piping and engine has to be run down and replaced with compliant fuel, and that takes a calculable amount of time based on the system's volume and consumption rate at the current load. The changeover has to start early enough that this purge is fully complete, with a margin, by the time the ship reaches the zone boundary — not begin at the boundary itself.",
        "In practice this means calculating a changeover start point back from the boundary using the ship's speed, distance to the boundary, and the fuel system's own purge time at current consumption — the same kind of distance-and-speed calculation a voyage plan already produces, just applied to a point before the boundary rather than the destination.",
      ],
    },
    {
      heading: "The procedure itself",
      paragraphs: [
        "Engine room notification comes first — the changeover needs to be a planned event, not something started reactively as the boundary approaches. The changeover is then run gradually: compliant fuel is introduced and higher-sulphur fuel is run down together for a period, rather than switched instantly, partly to avoid a sudden change in fuel properties (viscosity, lubricity) upsetting the fuel system, and partly because a instant switch usually is not physically how the system works.",
        "Throughout the changeover, tank soundings, start and completion times, and the vessel's position at each are recorded — this is the record that actually matters if a Port State Control inspection or an emissions compliance check asks for evidence of when the ship became compliant relative to when it crossed into the zone.",
      ],
    },
    {
      heading: "Where changeovers actually go wrong",
      paragraphs: [
        "The most common finding is not a ship that never switched — it is a ship that switched too late relative to the boundary, so that for some period after entering the zone it was still burning down non-compliant fuel. The second most common is a changeover that happened but was not logged with the detail (start time, completion time, position, tank soundings) that lets anyone verify it after the fact.",
        "A less obvious failure mode is a route that changes after the changeover was planned — a diversion, a weather routing decision, a schedule change — without anyone recalculating whether the original changeover timing still holds for the new track and boundary crossing point.",
      ],
      links: [
        { text: "Recalculate a route and its ECA crossing after a diversion", href: "/vessel-tracker" },
      ],
    },
    {
      heading: "Planning the changeover into the voyage, not around it",
      paragraphs: [
        "The changeover works best as part of the voyage plan itself, not a separate calculation done later by whoever happens to notice the boundary approaching. Once a route's ECA/SECA crossings are known at the planning stage, the changeover start point can be marked on the plan the same way a course alteration or a pilot boarding point is — a position and a time, worked backward from the boundary using the ship's own fuel system purge time.",
        "ShipCrewFinder's Voyage Planner flags which ECA/SECA zones a calculated sea route passes through, so the crossing point is known from the moment the route is planned — before the ship is close enough that the changeover becomes a reactive decision rather than a planned one.",
      ],
      links: [
        { text: "Plan a voyage and see its ECA/SECA crossings", href: "/vessel-tracker" },
        { text: "How CII and EEXI tie into fuel and route planning", href: "/blog/cii-eexi-explained-carbon-intensity-guide-2026" },
      ],
    },
  ],
  faqs: [
    {
      question: "What is the sulphur limit inside an ECA or SECA?",
      answer:
        "0.10% sulphur content or below, for the entire duration of the transit through the zone — a stricter limit than the global sulphur cap that applies outside these zones under MARPOL Annex VI.",
    },
    {
      question: "When should the fuel changeover start before entering an ECA?",
      answer:
        "Early enough that the fuel system — service tank, piping and engine — is fully purged of higher-sulphur fuel by the time the ship crosses the boundary, not at the boundary itself. The exact start point is calculated backward from the boundary using the ship's speed, distance remaining, and the fuel system's own purge time at current consumption.",
    },
    {
      question: "What has to be logged during a fuel changeover?",
      answer:
        "Start and completion times of the changeover, the vessel's position at each, and tank soundings — the record that lets a Port State Control inspection or compliance check verify when the ship actually became compliant relative to when it entered the zone.",
    },
    {
      question: "Why is a fuel changeover done gradually instead of instantly?",
      answer:
        "Running the two fuel grades down together over a period, rather than switching instantly, avoids a sudden change in fuel properties such as viscosity and lubricity upsetting the fuel system — and reflects how the system's own tank and piping volume works in practice.",
    },
    {
      question: "What's the most common mistake in ECA/SECA fuel changeovers?",
      answer:
        "Starting the changeover too late relative to the zone boundary, so the vessel is still burning down non-compliant fuel for some period after actually entering the zone — usually caused by treating the changeover as a reactive decision rather than something calculated and planned in advance.",
    },
    {
      question: "How do I know which ECA/SECA zones my route passes through?",
      answer:
        "ShipCrewFinder's Voyage Planner calculates the sea-only route between any two ports and flags which ECA/SECA zones it crosses, so the changeover can be planned at the same time as the rest of the voyage rather than worked out separately once the ship is already close to a boundary.",
    },
  ],
};

export default post;
