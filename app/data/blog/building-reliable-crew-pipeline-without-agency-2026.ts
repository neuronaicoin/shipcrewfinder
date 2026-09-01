import type { BlogPost } from "./types";

const post: BlogPost = {
  slug: "building-reliable-crew-pipeline-without-agency-2026",
  title: "Building a Reliable Crew Pipeline Without an Agency (2026)",
  description:
    "How fleets successfully move crewing in-house — the search infrastructure, verification process and candidate relationship management that replaces what an agency otherwise provides.",
  category: "Crewing",
  author: "Maritime industry professional",
  date: "2026-09-15",
  readingMinutes: 9,
  excerpt:
    "Moving crewing in-house isn't just cancelling the agency relationship — it's deliberately replacing three specific functions an agency was handling, or the pipeline breaks down within a few hiring cycles.",
  keywords: [
    "build crew pipeline without agency",
    "in-house crewing department setup",
    "how to source ship crew directly",
    "direct crew hiring strategy shipping company",
    "reduce dependency on crewing agencies",
    "maritime talent pipeline strategy",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Crewing department team reviewing candidate profiles, representing a fleet building an in-house crew pipeline",
  intro: [
    "Fleets that move crewing away from agency dependence and toward direct sourcing successfully tend to do one thing consistently: they treat it as replacing three specific functions — candidate sourcing reach, credential verification, and ongoing candidate relationship management — rather than simply cancelling an agency contract and expecting an equivalent pipeline to appear on its own.",
    "Fleets that attempt the same transition without deliberately replacing all three functions tend to see the pipeline degrade within a few hiring cycles — not because direct hiring doesn't work, but because one of the three functions an agency was quietly handling goes unreplaced and the gap shows up as slower fills, weaker candidate quality, or verification gaps that surface after sign-on.",
    "Here is what actually needs to be built to replace each function, and the sequence that tends to work.",
  ],
  sections: [
    {
      heading: "Replacing sourcing reach: where candidates actually come from without an agency's network",
      paragraphs: [
        "An agency's core value is often its existing candidate network — relationships and reach built over years that a fleet moving to direct hiring doesn't have on day one. This gap is closed through a combination of a searchable direct-hire platform with an existing active candidate pool, a fleet's own alumni and referral network from current and former crew, and — for genuinely specialised or scarce ranks — accepting that sourcing reach may take longer to build than it takes for common ranks.",
        "The realistic expectation: sourcing reach for common ranks on a platform with an active existing candidate base can match or exceed agency reach relatively quickly, while genuinely scarce specialisations may take longer to build a comparable pipeline for, which is worth planning around rather than discovering under time pressure on a specific hard-to-fill position.",
      ],
    },
    {
      heading: "Replacing verification: this cannot be skipped, and needs an explicit process",
      paragraphs: [
        "Agencies vary considerably in how much genuine credential verification they perform versus document collection — but moving away from an agency means a fleet needs an explicit, defined verification process of its own, not an assumption that direct-sourced candidates are somehow equally trustworthy by default without the same checking an agency relationship implied.",
        "This is the function most likely to be under-replaced in a rushed transition, precisely because it's the least visible when working correctly and the most consequential when it fails — a verification gap doesn't show up as a slow hire, it shows up as a competence gap discovered at sea, considerably later and at higher cost.",
      ],
    },
    {
      heading: "Replacing candidate relationship management: the function that's easiest to underestimate",
      paragraphs: [
        "A good agency maintains ongoing relationships with candidates between placements — checking availability, understanding career goals, keeping a warm pipeline rather than starting from zero for every open position. Fleets moving to direct hiring often replicate the transactional, per-position search well, but under-invest in this ongoing relationship function, which means every new opening starts a fresh search rather than drawing from a maintained, warm candidate relationship.",
        "This is where a platform-based approach with persistent candidate profiles and communication tools genuinely helps — it makes maintaining that ongoing relationship a natural byproduct of using the platform regularly, rather than a separate discipline a crewing department has to build and maintain entirely on its own.",
      ],
    },
    {
      heading: "The transition sequence that tends to work",
      paragraphs: [
        "Fleets that make this transition successfully tend to run agency and direct sourcing in parallel for a defined period — filling some positions directly while maintaining agency relationships for others — rather than cutting over completely on a fixed date. This lets the direct pipeline's actual performance, particularly around verification and time-to-fill, be genuinely tested against real hiring needs before the agency relationship is fully wound down.",
        "The specific metric worth tracking during this parallel period: time-to-fill and candidate quality for directly-sourced positions compared against the same metrics for agency-sourced ones over the same period — a comparison that gives a genuine, fleet-specific answer rather than a general assumption either way.",
      ],
    },
  ],
  faqs: [
    {
      question: "What does moving crewing in-house actually require replacing?",
      answer:
        "Three specific functions an agency typically handles: candidate sourcing reach, credential verification, and ongoing candidate relationship management. Fleets that replace only the sourcing function tend to see the pipeline degrade within a few hiring cycles as the other two gaps show up.",
    },
    {
      question: "How do fleets replace an agency's candidate network without one?",
      answer:
        "Through a combination of a direct-hire platform with an existing active candidate pool, the fleet's own alumni and referral network, and — for scarce specialisations — accepting that comparable sourcing reach may take longer to build than for common ranks.",
    },
    {
      question: "Why is verification the function most often under-replaced?",
      answer:
        "Because it's the least visible when working correctly and doesn't show up as a problem immediately — a verification gap surfaces later, as a competence gap discovered at sea, rather than as an obvious delay during the hiring process itself.",
    },
    {
      question: "What is candidate relationship management, and why does it matter for direct hiring?",
      answer:
        "The ongoing maintenance of candidate relationships between placements — availability, career goals, a warm pipeline rather than starting fresh each time. Fleets moving to direct hiring often under-invest in this, meaning every new opening starts from zero instead of drawing from a maintained relationship.",
    },
    {
      question: "Should a fleet cut over from agency to direct hiring all at once?",
      answer:
        "Running both in parallel for a defined period, filling some positions directly while maintaining agency relationships for others, lets a fleet genuinely test the direct pipeline's time-to-fill and candidate quality before fully winding down the agency relationship.",
    },
  ],
};

export default post;
