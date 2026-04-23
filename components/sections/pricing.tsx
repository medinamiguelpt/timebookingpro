"use client"

import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, ChevronDown } from "lucide-react"
import { SUBSCRIPTION_TIERS, FEATURES_ON_EVERY_PLAN, quote, YEARLY_DISCOUNT, activeHolidayPromo, type BillingCycle } from "@/lib/pricing"
import { type CurrencyCode } from "@/lib/currencies"
import { COUNTRIES, COUNTRY_ORDER, type CountryCode } from "@/lib/vat"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { RevealWords } from "@/components/ui/reveal-words"
import { Tooltip } from "@/components/ui/tooltip"

// Tooltips for the minutes bullet (tier-specific) and shared bullets
const FEATURE_TIPS: Record<string, string> = {
  "100 min/month":                     "~3 calls per day. Hard cap — voicemail takes over when the bucket is spent.",
  "250 min/month":                     "~8 calls per day. Hard cap — voicemail takes over when the bucket is spent.",
  "500 min/month":                     "~15 calls per day. Hard cap — voicemail takes over when the bucket is spent.",
  "1,000 min/month":                   "~30+ calls per day. Hard cap — voicemail takes over when the bucket is spent.",
  "Bookings synced to your calendar":  "Google, Outlook, Apple, and iCal — real-time two-way sync.",
  "Weekly performance email":          "Every Monday: bookings handled, minutes used, top call hours.",
  "Call recordings on demand":         "Any call from the last 30 days, downloadable as MP3.",
  "All 7 supported languages":         "Greek · English · Spanish · Portuguese · French · German · Arabic. Agent locks to the caller's language on first substantive word.",
}

// Strict country → currency mapping (EU-only scope).
// Only SE/DK/PL have native tables; every other EU country falls back to EUR.
function currencyForCountry(country: CountryCode): CurrencyCode {
  const map: Partial<Record<CountryCode, CurrencyCode>> = {
    SE: "SEK", DK: "DKK", PL: "PLN",
  }
  return map[country] ?? "EUR"
}

// Deterministic defaults per the unified-picker brief — no geo-IP guessing on the pricing page.
const DEFAULT_COUNTRY: CountryCode = "GR"
const DEFAULT_CURRENCY: CurrencyCode = "EUR"

export function Pricing() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly")
  const [countryCode, setCountryCode] = useState<CountryCode>(DEFAULT_COUNTRY)
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(DEFAULT_CURRENCY)
  const [sheetIdx, setSheetIdx] = useState<number | null>(null)
  const [pressedTierIdx, setPressedTierIdx] = useState<number | null>(null)
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Picking a country updates both country and currency in one setState batch
  // (React auto-batches multiple setState calls in an event handler since v18,
  // so the quote re-memoizes exactly once per user interaction).
  const handleCountryChange = (code: CountryCode) => {
    setCountryCode(code)
    setCurrencyCode(currencyForCountry(code))
  }

  const handleTierTouchStart = (idx: number) => () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
    pressTimerRef.current = setTimeout(() => {
      setPressedTierIdx(idx)
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(40)
      setTimeout(() => setPressedTierIdx(null), 600)
    }, 400)
  }
  const handleTierTouchEnd = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
  }

  const country = COUNTRIES[countryCode]
  const promo = useMemo(() => activeHolidayPromo(cycle), [cycle])

  // isBusiness + hasValidVatId are always false at the landing-page level.
  // Stripe Checkout handles VIES lookup and reverse-charge for B2B with a valid VAT ID.
  const quotes = useMemo(() =>
    SUBSCRIPTION_TIERS.map(tier => quote({ tier, cycle, currencyCode, countryCode, isBusiness: false, hasValidVatId: false })),
    [cycle, currencyCode, countryCode]
  )

  const yearlyPct = Math.round(YEARLY_DISCOUNT * 100)

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <motion.p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.4 }}>
            Pricing
          </motion.p>
          <RevealWords
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            delay={0.1}
          >
            Simple, transparent pricing
          </RevealWords>
          <motion.p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.4, delay:0.2 }}>
            No setup fees. No contracts. Cancel any time.
          </motion.p>
        </div>

        {/* Holiday promo banner */}
        <AnimatePresence>
          {promo && (
            <motion.div
              key={promo.id}
              initial={{ opacity:0, y:-12, scale:0.98 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:-8, scale:0.98 }}
              transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
              className="mb-8 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 border"
              style={{ background:`${promo.color}12`, borderColor:`${promo.color}30` }}
            >
              <span className="text-2xl">{promo.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-sm" style={{ color:promo.color }}>{promo.name}</p>
                <p className="text-sm text-muted-foreground">{promo.tagline}</p>
              </div>
              <span className="shrink-0 font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-dashed"
                style={{ color:promo.color, borderColor:`${promo.color}50`, background:`${promo.color}08` }}>
                {promo.code}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unified picker — one dropdown, currency implied by country.
            Matches the canonical dashboard at dashboard-sooty-seven-64.vercel.app/dashboard. */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="pricing-country"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center"
            >
              Country
            </label>
            <div className="relative">
              <select
                id="pricing-country"
                value={countryCode}
                onChange={e => handleCountryChange(e.target.value as CountryCode)}
                className="appearance-none pl-3 pr-9 h-10 rounded-lg border border-border bg-card text-sm text-foreground outline-none focus:border-primary/50 transition-colors cursor-pointer min-w-[220px]"
                aria-label="Select country"
              >
                {COUNTRY_ORDER.map(code => {
                  const c = COUNTRIES[code]
                  const curr = currencyForCountry(code)
                  return (
                    <option key={code} value={code}>
                      {c.flag} {c.name} · {curr}
                    </option>
                  )
                })}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center rounded-full bg-card border border-border p-1">
            {(["monthly","yearly"] as BillingCycle[]).map(c => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`relative px-5 h-8 rounded-full text-sm font-semibold transition-colors ${
                  cycle === c ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Sliding pill — layoutId makes it spring between buttons */}
                {cycle === c && (
                  <motion.span
                    layoutId="pricing-pill"
                    className="absolute inset-0 rounded-full bg-primary shadow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {c === "monthly" ? "Monthly" : "Yearly"}
                  {c === "yearly" && (
                    <motion.span
                      key={cycle === "yearly" ? "y" : "n"}
                      initial={cycle === "yearly" ? { scale: 0.4, opacity: 0 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                        cycle === "yearly" ? "bg-white/20 text-white" : "bg-green-500/15 text-green-600 dark:text-green-400"
                      }`}
                    >
                      -{yearlyPct}%
                    </motion.span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tier cards — 4 hard-cap tiers
            Mobile: CSS scroll-snap carousel (no JS, native momentum, peek shows next card)
            Tablet: 2-col grid · Desktop: 4-col grid */}
        <div className="relative">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 pb-3 md:pb-0">
          {quotes.map((q, index) => {
            const { tier } = q
            const minutesLine = `${tier.minutesPerMonth.toLocaleString("en-US")} min/month`
            const showStrike = !!q.promo && q.netPreHoliday !== q.netEffective
            const isPopular = tier.badge === "Most popular"

            return (
              <motion.div key={tier.id}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ duration:0.45, delay:index*0.1 }}
                whileHover={{ y:-4 }}
                // min-w makes each card take ~82vw on mobile (peek shows next card)
                // snap-center snaps each card to the center of the scroll container
                className={`relative pt-4 min-w-[82vw] sm:min-w-[68vw] md:min-w-0 flex-shrink-0 md:flex-shrink snap-center transition-transform duration-150 ${pressedTierIdx === index ? "scale-[1.03]" : ""}`}
                onTouchStart={handleTierTouchStart(index)}
                onTouchEnd={handleTierTouchEnd}
                onTouchCancel={handleTierTouchEnd}
              >
                {/* Badge — outside SpotlightCard to avoid overflow:hidden clipping */}
                {tier.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <span className="text-xs font-bold px-3 py-1 rounded-full text-white shadow-lg whitespace-nowrap"
                      style={{ background: tier.color }}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <SpotlightCard className={`relative rounded-2xl border p-6 flex flex-col gap-5 h-full transition-shadow duration-300 ${
                  isPopular
                    ? "border-primary/60 bg-gradient-to-b from-primary/10 to-primary/5 shadow-2xl shadow-primary/20 ring-1 ring-primary/20"
                    : "border-border bg-card hover:shadow-xl hover:border-primary/25"
                }`}>

                  {/* Name */}
                  <p className="font-heading font-bold text-lg" style={{ color: tier.color }}>{tier.name}</p>

                  {/* Price */}
                  <div>
                    <AnimatePresence mode="wait">
                      <motion.div key={`${cycle}-${currencyCode}-${countryCode}-${tier.id}`}
                        initial={{ opacity:0, scale:0.88, filter:"blur(4px)" }}
                        animate={{ opacity:1, scale:1, filter:"blur(0px)" }}
                        exit={{ opacity:0, scale:0.88, filter:"blur(4px)" }}
                        transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}>

                        {showStrike && (
                          <p className="text-sm text-muted-foreground line-through mb-0.5">
                            {q.formatted.netPreHoliday}/{q.per}
                          </p>
                        )}

                        <div className="flex items-end gap-1.5">
                          <span className="text-4xl font-heading font-extrabold">
                            {cycle === "yearly" ? q.formatted.monthlyEquivalent : q.formatted.netEffective}
                          </span>
                          <span className="text-muted-foreground text-sm mb-1.5">/mo</span>
                        </div>

                        {cycle === "yearly" && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            billed {q.formatted.yearlyTotal}/yr
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Annual savings chip */}
                    {cycle === "yearly" && q.annualSavings > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                          Save {q.formatted.annualSavings}/yr
                        </span>
                        {q.promo && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ color:q.promo.color, background:`${q.promo.color}15` }}>
                            incl. {Math.round(q.promo.discount*100)}% {q.promo.emoji} sale
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tax breakdown — values animate on country/cycle/currency change */}
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs space-y-1.5">
                    {[
                      { label: "Net",       value: q.formatted.netEffective,                         key: `net-${q.formatted.netEffective}` },
                      { label: q.vat.label, value: q.vat.reverseCharged ? "—" : q.formatted.vatAmount, key: `vat-${q.formatted.vatAmount}-${q.vat.reverseCharged}`, hint: q.vat.explanation, hintId: `vat-note-${tier.id}` },
                    ].map(({ label, value, key, hint, hintId }) => (
                      <div key={label} className="flex justify-between text-muted-foreground" title={hint} aria-describedby={hintId}>
                        <span>{label}</span>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={key}
                            initial={{ opacity:0, scale:0.88, filter:"blur(4px)" }}
                            animate={{ opacity:1, scale:1,    filter:"blur(0px)" }}
                            exit={{    opacity:0, scale:0.88, filter:"blur(4px)" }}
                            transition={{ duration:0.18, ease:[0.22,1,0.36,1] }}
                          >
                            {value}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    ))}
                    <div className="border-t border-border/60 pt-1.5 flex justify-between font-semibold text-foreground">
                      <span>Total due</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`gross-${q.formatted.gross}`}
                          initial={{ opacity:0, scale:0.88, filter:"blur(4px)" }}
                          animate={{ opacity:1, scale:1,    filter:"blur(0px)" }}
                          exit={{    opacity:0, scale:0.88, filter:"blur(4px)" }}
                          transition={{ duration:0.18, ease:[0.22,1,0.36,1] }}
                        >
                          {q.formatted.gross}/{q.per}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <p id={`vat-note-${tier.id}`} className="text-muted-foreground/70 text-[10px] leading-snug pt-0.5">
                      {q.vat.explanation}
                    </p>
                  </div>

                  {/* Feature list — exactly 5 bullets: tier-specific minutes + 4 shared */}
                  <ul className="space-y-2 flex-1">
                    {[minutesLine, ...FEATURES_ON_EVERY_PLAN].map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={14} className="text-primary shrink-0" />
                        {FEATURE_TIPS[f] ? (
                          <Tooltip content={FEATURE_TIPS[f]}>
                            <span className="underline decoration-dotted underline-offset-2 decoration-muted-foreground/40">{f}</span>
                          </Tooltip>
                        ) : (
                          <span>{f}</span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.a
                    // All 4 tiers self-serve via Stripe Checkout — no "Book a demo" special case
                    href={`/api/checkout?plan=${tier.id}&billing=${cycle === "yearly" ? "annual" : "monthly"}`}
                    className="flex items-center justify-center h-11 rounded-full font-semibold text-sm transition-all relative overflow-hidden group"
                    style={{
                      background: isPopular ? tier.color : "transparent",
                      color: isPopular ? "white" : tier.color,
                      border: `2px solid ${tier.color}`,
                    }}
                    whileTap={{ scale:0.97 }}
                  >
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                    {tier.cta}
                  </motion.a>

                  {/* Mobile-only: open bottom sheet with full plan details */}
                  <button
                    onClick={() => setSheetIdx(index)}
                    className="md:hidden w-full pt-1 text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    See all plan details ↑
                  </button>
                </SpotlightCard>
              </motion.div>
            )
          })}
          </div>
          {/* Right-edge fade — signals there's more to swipe, mobile only */}
          <div className="md:hidden absolute right-0 inset-y-0 w-10 bg-gradient-to-l from-background/70 to-transparent pointer-events-none" aria-hidden />
        </div>

        {/* Bottom sheet — mobile plan details */}
        <BottomSheet
          open={sheetIdx !== null}
          onClose={() => setSheetIdx(null)}
          title={sheetIdx !== null ? `${quotes[sheetIdx].tier.name} plan` : undefined}
        >
          {sheetIdx !== null && (() => {
            const q = quotes[sheetIdx]
            const { tier } = q
            const isPopular = tier.badge === "Most popular"
            const minutesLine = `${tier.minutesPerMonth.toLocaleString("en-US")} min/month`
            return (
              <div className="flex flex-col gap-6">
                {/* Price recap */}
                <div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-heading font-extrabold">
                      {cycle === "yearly" ? q.formatted.monthlyEquivalent : q.formatted.netEffective}
                    </span>
                    <span className="text-muted-foreground text-sm mb-1.5">/mo</span>
                  </div>
                  {cycle === "yearly" && (
                    <p className="text-xs text-muted-foreground mt-0.5">billed {q.formatted.yearlyTotal}/yr</p>
                  )}
                  <p className="text-xs text-muted-foreground/80 mt-2">{tier.profile}</p>
                </div>

                {/* Features — minutes line + 4 shared bullets */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Included</p>
                  <ul className="space-y-3">
                    {[minutesLine, ...FEATURES_ON_EVERY_PLAN].map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <CheckCircle size={15} className="text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tax breakdown */}
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Price breakdown</p>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Net</span><span>{q.formatted.netEffective}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{q.vat.label}</span>
                    <span>{q.vat.reverseCharged ? "—" : q.formatted.vatAmount}</span>
                  </div>
                  <div className="border-t border-border/60 pt-2 flex justify-between font-semibold">
                    <span>Total due</span><span>{q.formatted.gross}/{q.per}</span>
                  </div>
                  <p className="text-muted-foreground/70 text-xs pt-1">{q.vat.explanation}</p>
                </div>

                {/* CTA — all tiers self-serve */}
                <a
                  href={`/api/checkout?plan=${tier.id}&billing=${cycle === "yearly" ? "annual" : "monthly"}`}
                  onClick={() => setSheetIdx(null)}
                  className="flex items-center justify-center h-12 rounded-full font-semibold text-sm"
                  style={{
                    background: isPopular ? tier.color : "transparent",
                    color: isPopular ? "white" : tier.color,
                    border: `2px solid ${tier.color}`,
                  }}
                >
                  {tier.cta}
                </a>
              </div>
            )
          })()}
        </BottomSheet>

        {/* Under-grid microcopy — hard-cap explainer + geo-swapped tax line */}
        <div className="mt-10 max-w-3xl mx-auto text-center space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            All plans include bookings synced to your calendar, a weekly performance email,
            call recordings on demand, and all 7 supported languages. Minutes are a hard
            monthly cap — calls route to voicemail once the bucket is spent until the next
            billing cycle or an upgrade. You&apos;ll get email alerts at 75% and 90% of your
            bucket so you&apos;re never surprised.
          </p>
          <p className="text-xs text-muted-foreground/80">
            {country.flag} Taxes shown for <strong>{country.name}</strong>
            {country.note ? ` — ${country.note}` : ""}.
            {" "}Prices shown ex-VAT — tax calculated at checkout.
          </p>
        </div>

      </div>
    </section>
  )
}
