/**
 * Section identifiers used to look up randomized headlines from
 * messages.taglines.<section>. Pools live in messages/<locale>.json so each
 * locale has its own per-section variants. The actual random pick happens
 * in app/[locale]/page.tsx at render time using next-intl's getTranslations.
 *
 * Final CTA pool entries use *…* markers around the word(s) that should
 * render with the gradient-text styling — see HighlightedHeadline in
 * components/sections/final-cta.tsx.
 */

export const SECTION_KEYS = [
  "howItWorks",
  "features",
  "beforeAfter",
  "forWho",
  "pricing",
  "finalCta",
] as const

export type SectionKey = (typeof SECTION_KEYS)[number]

/** Pick a random tagline from a pool. */
export function pickFromPool(pool: readonly string[]): string {
  return pool[Math.floor(Math.random() * pool.length)]
}
