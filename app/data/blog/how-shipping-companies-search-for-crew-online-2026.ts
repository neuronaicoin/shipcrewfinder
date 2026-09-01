import type { BlogPost } from "./types";

const post: BlogPost = {
  slug: "how-shipping-companies-search-for-crew-online-2026",
  title: "How Shipping Companies Actually Search for Crew Online (2026)",
  description:
    "Shipping companies filter crew search results by rank, certification status, availability and verified documents first, before ever reading a CV in full — here is exactly what that search process looks like.",
  category: "Careers",
  author: "Maritime industry professional",
  date: "2026-09-08",
  readingMinutes: 9,
  excerpt:
    "A crewing manager searching for a Chief Engineer sees dozens of profiles before reading a single CV in full. Here is what actually determines which ones get opened.",
  keywords: [
    "how do shipping companies find crew",
    "how does crew search work maritime",
    "seafarer profile visibility",
    "how to get noticed by shipping companies",
    "crew search filters shipping companies use",
    "maritime recruiter search process",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1517389776250-b5c4a5a1a8f4?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Crewing manager reviewing candidate profiles on a laptop, representing how shipping companies search for seafarers online",
  intro: [
    "A crewing manager filling a Chief Engineer position rarely reads CVs one at a time from the top of an inbox. They run a filtered search — rank, certification status, availability window, vessel type experience — and the search tool returns a ranked or filtered list before a single document is opened. Understanding that process changes how a seafarer should think about their own profile.",
    "The gap between a profile that gets opened and one that gets scrolled past is rarely about experience quality. It is almost always about whether the profile passes the filters a crewing manager applies first, and whether it gives enough verified, specific information to justify opening it over the next name on the list.",
    "Here is what that search and filtering process actually looks like, and what it means for how a profile should be built.",
  ],
  sections: [
    {
      heading: "The first filter is always rank and certification match — nothing else matters until this passes",
      paragraphs: [
        "Before anything else, crew search tools filter by exact rank and the specific certificates required for that position and vessel type. A profile with the right experience but an incompletely listed certificate — or one that's expired without a clear renewal date shown — is filtered out at this stage, before a crewing manager ever sees the rest of the profile.",
        "This is the single highest-leverage thing a seafarer controls directly: every current certificate, with accurate expiry dates, listed completely. A profile that fails this first filter never reaches the stage where experience, references or personal presentation matter at all.",
      ],
    },
    {
      heading: "The second filter is availability — a strong profile with the wrong dates gets skipped",
      paragraphs: [
        "Crewing managers filling a position with a fixed sign-on date filter out profiles showing unavailability or vague availability during that window. An excellent profile that hasn't been updated with current availability status is functionally invisible for time-sensitive searches, regardless of how strong the underlying experience is.",
        "Keeping availability status current is a small, frequent action that has outsized effect on search visibility — a profile updated within the last few weeks signals active job-seeking in a way an eight-month-old status update does not.",
      ],
    },
    {
      heading: "Verified documents get opened before unverified ones, consistently",
      paragraphs: [
        "When a search returns more matching profiles than a crewing manager has time to review individually — which is the normal case for any well-known rank on a reasonably active platform — verified profiles are opened first as a time-saving default, not as an afterthought. An unverified profile is not rejected outright, but it is deprioritised in exactly the moment that matters: the first pass through a results list.",
        "This is precisely the gap document verification closes. It moves a profile from 'might be worth checking' to 'confirmed accurate,' which is the difference between being opened on the first pass through a search result list and being opened only if the first pass doesn't fill the position.",
      ],
    },
    {
      heading: "Vessel type and trading pattern experience narrows the field further",
      paragraphs: [
        "Beyond rank and certification, crewing managers searching for a specific vessel type — LNG, chemical tanker, offshore support — filter specifically for demonstrated experience on that vessel type, not just the general rank qualification. A Chief Engineer profile that lists general 'bulk carrier' experience when the search is specifically for gas carrier experience is filtered out at this stage even with an otherwise strong CV.",
        "The practical implication: vague vessel type listing ('various cargo vessels') performs worse in search than specific, itemised vessel type and trading pattern history, even when the underlying experience is identical — because the search filter is matching against the specific field, not inferring from general description.",
      ],
    },
    {
      heading: "What actually gets a profile opened once it survives the filters",
      paragraphs: [
        "Once a profile clears rank, certification, availability and vessel type filters, what determines whether it gets opened over the next similarly-qualified name on the list is usually profile completeness — a photo, a clear summary of recent contracts, and specific rather than generic language describing experience. A profile that stops at the minimum required fields, next to one that's genuinely filled out, loses that comparison consistently.",
        "This is the stage where personal presentation genuinely matters, but only after the earlier filters have already been passed — spending significant effort polishing profile language while certificates are incomplete or expired is optimising the wrong stage of the process.",
      ],
    },
    {
      heading: "Building a profile in the order that actually matters",
      paragraphs: [
        "The practical sequence, in the order it actually affects search visibility: complete and current certificates first, accurate availability status second, specific vessel type and trading pattern detail third, and profile presentation quality last — not because presentation doesn't matter, but because none of it is seen if the earlier filters aren't passed.",
        "A complete, verified ShipCrewFinder profile is built around exactly this filtering logic — the fields crewing managers actually search and filter by are the fields the profile prompts for first, rather than a generic CV format that doesn't map to how the search itself works.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the first thing shipping companies filter by when searching for crew?",
      answer:
        "Exact rank and the specific certificates required for the position and vessel type. A profile with incomplete or expired certificate listings is filtered out at this stage before a crewing manager reviews anything else on the profile.",
    },
    {
      question: "Do verified profiles actually get opened more than unverified ones?",
      answer:
        "Yes — when a search returns more matching profiles than can be individually reviewed, verified profiles are opened first as a default time-saving step. Unverified profiles aren't rejected, but they are deprioritised in the first pass through search results.",
    },
    {
      question: "Why does listing specific vessel types matter more than general cargo experience?",
      answer:
        "Crewing managers searching for a specific vessel type filter directly against that field. A profile listing general experience ('various cargo vessels') is filtered out of a search for a specific vessel type like LNG or chemical tankers, even when the underlying experience would qualify.",
    },
    {
      question: "How often should availability status be updated on a crew profile?",
      answer:
        "As frequently as it genuinely changes — a profile updated within the last few weeks signals active job-seeking and passes date-sensitive availability filters, while an outdated status can filter a strong profile out of a time-sensitive search entirely.",
    },
    {
      question: "What makes one qualified profile get opened over another equally qualified one?",
      answer:
        "Once rank, certification, availability and vessel type filters are passed, profile completeness — a photo, specific recent contract summaries, and detailed rather than generic experience descriptions — determines which of several similarly qualified profiles gets opened first.",
    },
  ],
};

export default post;
