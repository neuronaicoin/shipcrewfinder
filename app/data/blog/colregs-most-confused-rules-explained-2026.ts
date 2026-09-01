import type { BlogPost } from "./types";

const post: BlogPost = {
  slug: "colregs-most-confused-rules-explained-2026",
  title: "COLREGs: The 10 Rules Officers Actually Get Wrong (2026)",
  description:
    "Stand-on versus give-way confusion, overtaking versus crossing disputes, and the sound signal mistakes that show up again and again — the COLREGs rules officers genuinely mix up, explained clearly.",
  category: "Deck Operations",
  author: "Maritime industry professional",
  date: "2026-09-02",
  readingMinutes: 10,
  excerpt:
    "Every officer has passed a COLREGs exam. A smaller number could correctly resolve the ten situations that cause the most real-world confusion on the bridge.",
  keywords: [
    "COLREGs rules explained",
    "stand-on vessel give-way vessel confusion",
    "COLREGs overtaking vs crossing rule",
    "COLREGs sound signals guide",
    "narrow channel rule COLREGs",
    "COLREGs common mistakes officers",
  ],
  heroImage:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Ship's bridge at night, representing collision avoidance decisions governed by COLREGs",
  intro: [
    "Every deck officer passes a COLREGs examination on the way to their certificate, and the vast majority genuinely know the rule numbers when asked directly. The confusion that actually causes close-quarters situations rarely comes from not knowing a rule exists — it comes from applying the right rule to the wrong read of a developing situation, under real time pressure, with a target that doesn't behave the way the textbook example assumed it would.",
    "The rules themselves have not changed in decades. What experienced officers develop, and what genuinely separates confident rule application from textbook memorisation, is the judgement to correctly classify a situation in the first ninety seconds — because misclassifying a crossing situation as an overtaking one, or the reverse, changes which vessel is obligated to act, and by how much.",
    "Here are the ten situations that generate the most genuine confusion, explained the way they actually play out on a bridge.",
  ],
  sections: [
    {
      heading: "1. Overtaking versus crossing: the angle that decides everything",
      paragraphs: [
        "Rule 13 defines overtaking specifically as approaching from more than 22.5 degrees abaft another vessel's beam — and critically, once a vessel is classified as overtaking, it remains the give-way vessel for the entire encounter, even if the relative bearing later shifts to something that would look like a crossing situation if the encounter were starting fresh.",
        "The mistake that recurs most is reclassifying an encounter partway through based on how it currently looks, rather than how it began. An overtaking situation that started at 30 degrees abaft the beam stays an overtaking situation under Rule 13 even if the geometry later shifts — the classification is locked in at the point it was first correctly identified, not continuously reassessed.",
      ],
    },
    {
      heading: "2. Stand-on does not mean unconditional right of way",
      paragraphs: [
        "Rule 17 requires the stand-on vessel to maintain course and speed — but it also requires that vessel to take action, including at close range departing from that requirement, the moment it becomes apparent the give-way vessel is not taking appropriate action. Stand-on status is not permission to hold course regardless of what the other vessel does.",
        "The confusion here is almost always a timing failure, not a rule misunderstanding: officers who correctly know Rule 17 in principle sometimes wait too long to conclude the give-way vessel isn't acting, because they're reluctant to depart from a rule they were taught to follow strictly. The rule itself builds in that judgement call — it does not reward rigid adherence past the point of genuine risk.",
      ],
    },
    {
      heading: "3. Narrow channel rules override the standard crossing rules",
      paragraphs: [
        "Rule 9 in a narrow channel or fairway effectively supersedes the standard give-way hierarchy from Rules 13-15 for vessels navigating within it: every vessel must keep to the starboard side, and a vessel constrained by draft has specific priority consideration that doesn't exist in open water. Applying open-water crossing logic inside a narrow channel is a genuine, recurring error.",
        "The specific confusion that shows up most: a vessel crossing a narrow channel, rather than navigating along it, is still bound by Rule 9's requirement not to impede vessels that can only navigate safely within the channel — a different, stricter obligation than the standard crossing rule would impose in open water.",
      ],
    },
    {
      heading: "4. Restricted visibility rules apply the moment visibility restricts, not when fog is declared",
      paragraphs: [
        "Rule 19 governs conduct in restricted visibility, and it applies based on actual visibility conditions, not a formal fog declaration or a specific visibility threshold announced over the radio. A vessel that continues operating under Rule 19 sound signal and speed requirements only after someone formally calls fog, rather than from the moment visibility actually becomes restricted, is applying the rule too late.",
        "The rule also does not use the stand-on/give-way framework at all in restricted visibility — every vessel must take avoiding action based on radar and other information available, which is a meaningfully different obligation than the sighted-vessel rules many officers default to reasoning from under pressure.",
      ],
    },
    {
      heading: "5. Sound signals: single, prolonged, and the difference that matters",
      paragraphs: [
        "Short and prolonged blasts are precisely defined by duration, not by feel — a short blast is about one second, a prolonged blast four to six seconds — and the specific combinations under Rule 34 mean genuinely different things: one short blast signals a course alteration to starboard, two signals to port, three signals astern propulsion, and five or more short blasts signal doubt or danger, not simply emphasis.",
        "The recurring error is treating the five-or-more signal as an aggressive or emphatic version of the danger, rather than its specific, defined meaning: that the signalling vessel does not understand the other's intentions or doubts sufficient action is being taken to avoid collision — a precise message, not a general alarm.",
      ],
    },
    {
      heading: "6. Vessels constrained by draft versus vessels restricted in ability to manoeuvre",
      paragraphs: [
        "These are two distinct categories under the Rules, and conflating them is a common error. A vessel constrained by her draft (Rule 3(h)) is limited specifically by available water depth relative to draft. A vessel restricted in her ability to manoeuvre (Rule 3(g)) is limited by the nature of her work — dredging, towing, cable laying — regardless of water depth. They carry different signal requirements and different priority considerations, and treating them as interchangeable misapplies both.",
      ],
    },
    {
      heading: "7. Head-on situations: the narrow definition officers widen incorrectly",
      paragraphs: [
        "Rule 14's head-on situation applies specifically to vessels meeting on reciprocal or nearly reciprocal courses, seeing the other ahead or nearly ahead — a narrower definition than officers sometimes apply in practice, particularly at night when a vessel slightly off the reciprocal course can visually present as head-on. Misclassifying a fine crossing situation as head-on leads to an incorrect port-to-port alteration when a different rule should actually govern.",
      ],
    },
    {
      heading: "8. Fishing vessels: what the lights actually permit",
      paragraphs: [
        "A vessel engaged in fishing has specific priority under the Rules, but that priority is tied specifically to gear that restricts manoeuvrability — trawling, purse seining, and similar — not to fishing activity in general. A vessel using gear that doesn't meaningfully restrict manoeuvrability does not carry the same priority regardless of what activity is technically taking place, a distinction that's easy to miss from a distance where gear type isn't clearly visible.",
      ],
    },
    {
      heading: "9. Traffic separation schemes: crossing at right angles isn't optional detail",
      paragraphs: [
        "Rule 10 requires a vessel crossing a traffic separation scheme to do so as nearly as practicable at right angles to the general traffic flow — not simply to cross somewhere convenient. This is a specific, checkable requirement, and vessels that cross at a shallow angle to save distance or time are in breach of the rule even without a close-quarters situation resulting from it.",
      ],
    },
    {
      heading: "10. Action to avoid collision must be positive, and early",
      paragraphs: [
        "Rule 8's requirement that any action taken to avoid collision be positive, made in ample time, and large enough to be readily apparent to the other vessel is frequently satisfied technically but not in spirit — a small, gradual course adjustment made early is compliant with the letter but can fail the actual purpose of the rule, which is removing ambiguity about intent for the other vessel observing it.",
      ],
    },
  ],
  faqs: [
    {
      question: "How is an overtaking situation classified under COLREGs?",
      answer:
        "Rule 13 defines overtaking as approaching from more than 22.5 degrees abaft another vessel's beam. Once classified as overtaking, that vessel remains the give-way vessel for the entire encounter, even if the geometry later shifts.",
    },
    {
      question: "Does the stand-on vessel always have to maintain course and speed?",
      answer:
        "No. Rule 17 requires it in principle, but also requires the stand-on vessel to take action — including departing from course and speed at close range — the moment it becomes apparent the give-way vessel isn't taking appropriate action.",
    },
    {
      question: "What does five or more short blasts mean under COLREGs?",
      answer:
        "Under Rule 34, five or more short and rapid blasts signal doubt about the other vessel's intentions or that insufficient action is being taken to avoid collision — a specific, defined message, not a general emphasis signal.",
    },
    {
      question: "How is a vessel constrained by draft different from one restricted in ability to manoeuvre?",
      answer:
        "A vessel constrained by draft (Rule 3(h)) is limited by water depth relative to her draft. A vessel restricted in ability to manoeuvre (Rule 3(g)) is limited by the nature of her work — dredging, towing, cable laying — regardless of depth. They carry different signals and priority considerations.",
    },
    {
      question: "Do narrow channel rules replace the standard crossing rules?",
      answer:
        "Within a narrow channel or fairway, Rule 9 effectively overrides the standard Rules 13-15 hierarchy — every vessel keeps to starboard, and vessels constrained by draft receive specific priority that doesn't apply in open water.",
    },
    {
      question: "Is there a quick reference for COLREGs on board?",
      answer:
        "The COLREGs Quick Reference tool in ShipCrewFinder's free Crew Toolkit covers the rules, sound signals and light configurations in one place for fast reference.",
    },
  ],
};

export default post;
