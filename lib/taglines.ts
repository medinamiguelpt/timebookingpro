/**
 * Section headlines — each section has a pool of 4–8-word taglines.
 * One is picked at render time in app/page.tsx and passed down as a prop.
 *
 * The Final CTA pool uses *…* markers to indicate the word(s) that should
 * render with the gradient-text styling. The first item in each pool matches
 * the original hardcoded heading, so "current behavior" is one of the
 * possible outcomes at ~1/N probability.
 */

export const TAGLINES = {
  howItWorks: [
    "Up and running in 24 hours",
    "Three steps to a fully automated agent",
    "Your agent, live by tomorrow",
    "Setup today, bookings tonight",
    "From signup to live in a day",
  ],
  agentNamer: [
    "Meet your AI teammate",
    "Name your booking specialist",
    "Design your AI receptionist",
    "Your agent, your personality",
  ],
  features: [
    "Everything your business needs",
    "Built to handle every booking",
    "One agent, every tool you need",
    "All the features that matter",
    "Every call handled, every time",
  ],
  beforeAfter: [
    "What changes when you add an agent",
    "The difference, line by line",
    "Your day with an agent",
    "See the side-by-side impact",
    "And these are just a few",
  ],
  forWho: [
    "Built for every booking business",
    "Made for service businesses",
    "Built around your calendar",
    "For barbers, salons, clinics and more",
    "For any shop that takes bookings",
  ],
  pricing: [
    "Simple, transparent pricing",
    "Priced to make sense",
    "Pay for what you use",
    "Flat monthly, no surprises",
    "Start small, scale as you grow",
  ],
  calculator: [
    "See what missed calls cost you",
    "Calculate your booking potential",
    "Run the numbers on your shop",
    "Do the math in seconds",
  ],
  faq: [
    "Frequently asked questions",
    "Answers to common questions",
    "The things people ask first",
    "Good questions, straight answers",
    "Questions we hear the most",
  ],
  finalCta: [
    "Their calendar won't fill *itself*, yours will.",
    "Your agent, live *by tomorrow*",
    "Turn on your *booking machine*",
    "Start with your *own agent*",
    "Give your calendar a *promotion*",
  ],
} as const satisfies Record<string, readonly string[]>

export type SectionKey = keyof typeof TAGLINES

/** Pick a random tagline for a section. Called at server render time per request. */
export function pickTagline(section: SectionKey): string {
  const pool = TAGLINES[section]
  return pool[Math.floor(Math.random() * pool.length)]
}
