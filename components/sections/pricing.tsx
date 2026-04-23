"use client"

import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, ChevronDown, Tag } from "lucide-react"
import { SUBSCRIPTION_TIERS, quote, YEARLY_DISCOUNT, activeHolidayPromo, type BillingCycle } from "@/lib/pricing"
import { CURRENCIES, CURRENCY_ORDER, formatMoney, type CurrencyCode } from "@/lib/currencies"
import { COUNTRIES, COUNTRY_ORDER, isPlausibleVatId, VENDOR_COUNTRY, type CountryCode } from "@/lib/vat"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { RevealWords } from "@/components/ui/reveal-words"

// Map a country code to a sensible default currency
function defaultCurrencyFor(country: CountryCode): CurrencyCode {
  const map: Partial<Record<CountryCode, CurrencyCode>> = {
    GB:"GBP", US:"USD", CA:"CAD", AU:"AUD", JP:"JPY",
    NO:"NOK", SE:"SEK", DK:"DKK", PL:"PLN", AE:"AED", CH:"CHF", NZ:"AUD",
  }
  return map[country] ?? "EUR"
}

export function Pricing({ defaultCountry = "GR" }: { defaultCountry?: CountryCode }) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly")
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(defaultCurrencyFor(defaultCountry))
  const [countryCode, setCountryCode] = useState<CountryCode>(defaultCountry)
  const [isBusiness, setIsBusiness] = useState(false)
  const [vatId, setVatId] = useState("")
  const [sheetIdx, setSheetIdx] = useState<number | null>(null)
  const [pressedTierIdx, setPressedTierIdx] = useState<number | null>(null)
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
  const showVatId = isBusiness && country.eu && countryCode !== VENDOR_COUNTRY
  const vatIdValid = showVatId ? isPlausibleVatId(country, vatId) : false
  const hasValidVatId = showVatId && vatIdValid
  const promo = useMemo(() => activeHolidayPromo(cycle), [cycle])

  const quotes = useMemo(() =>
    SUBSCRIPTION_TIERS.map(tier => quote({ tier, cycle, currencyCode, countryCode, isBusiness, hasValidVatId })),
    [cycle, currencyCode, countryCode, isBusiness, hasValidVatId]
  )

  const yearlyPct = Math.round(YEARLY_DISCOUNT * 100)

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

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

        {/* Controls row */}
        <div className="flex flex-wrap items-end gap-4 mb-6">
          {/* Currency */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Currency</label>
            <div className="relative">
              <select
                value={currencyCode}
                onChange={e => setCurrencyCode(e.target.value as CurrencyCode)}
                className="appearance-none pl-3 pr-8 h-9 rounded-lg border border-border bg-card text-sm text-foreground outline-none focus:border-primary/50 transition-colors cursor-pointer"
                aria-label="Select currency"
              >
                {CURRENCY_ORDER.map(code => {
                  const c = CURRENCIES[code]
                  return <option key={code} value={code}>{c.flag} {c.code} — {c.name}</option>
                })}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Billing country</label>
            <div className="relative">
              <select
                value={countryCode}
                onChange={e => { setCountryCode(e.target.value as CountryCode); setVatId("") }}
                className="appearance-none pl-3 pr-8 h-9 rounded-lg border border-border bg-card text-sm text-foreground outline-none focus:border-primary/50 transition-colors cursor-pointer"
                aria-label="Select billing country"
              >
                {COUNTRY_ORDER.map(code => {
                  const c = COUNTRIES[code]
                  const pct = c.vatRate > 0 ? ` · ${Math.round(c.vatRate*100)}% ${c.taxLabel}` : " · No tax"
                  return <option key={code} value={code}>{c.flag} {c.name}{pct}</option>
                })}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Business checkbox */}
          <label className="flex items-center gap-2 cursor-pointer h-9 text-sm text-foreground select-none">
            <input
              type="checkbox"
              checked={isBusiness}
              onChange={e => { setIsBusiness(e.target.checked); setVatId("") }}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
            Buying for a business
          </label>
        </div>

        {/* VAT ID input */}
        <AnimatePresence>
          {showVatId && (
            <motion.div
              initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
              transition={{ duration:0.25 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex flex-col gap-1 max-w-xs">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  VAT ID (optional — enables reverse charge)
                </label>
                <input
                  type="text"
                  value={vatId}
                  onChange={e => setVatId(e.target.value)}
                  placeholder={country.vatIdExample ?? "e.g. DE123456789"}
                  aria-describedby="vat-explanation"
                  className={`h-9 px-3 rounded-lg border text-sm text-foreground bg-card outline-none transition-colors ${
                    vatId.length > 2
                      ? vatIdValid ? "border-green-500/60 focus:border-green-500" : "border-destructive/60 focus:border-destructive"
                      : "border-border focus:border-primary/50"
                  }`}
                />
                {vatId.length > 2 && !vatIdValid && (
                  <p className="text-xs text-destructive">Invalid format — check your VAT ID</p>
                )}
                <p id="vat-explanation" className="text-xs text-muted-foreground">
                  {quotes[0]?.vat.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Tier cards
            Mobile: CSS scroll-snap carousel (no JS, native momentum, peek shows next card)
            Desktop: standard 3-col grid */}
        <div className="relative">
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 pb-3 md:pb-0">
          {quotes.map((q, index) => {
            const { tier } = q
            const perMinute = q.currency.tierMonthly[tier.id] / tier.minutesPerMonth
            const overagePerMinute = q.currency.overageByTier[tier.id]
            const prev = index > 0 ? SUBSCRIPTION_TIERS[index-1] : null
            const prevPerMinute = prev ? q.currency.tierMonthly[prev.id] / prev.minutesPerMonth : null
            const savingsPct = (prev && prevPerMinute) ? Math.round((1 - perMinute/prevPerMinute)*100) : null
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
                          <span className="text-4xl font-heading font-extrabold">{q.formatted.netEffective}</span>
                          <span className="text-muted-foreground text-sm mb-1.5">/{q.per}</span>
                        </div>

                        {cycle === "yearly" && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {q.formatted.monthlyEquivalent}/mo billed annually
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

                  {/* Tax breakdown */}
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs space-y-1.5">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Net</span>
                      <span>{q.formatted.netEffective}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground"
                      title={q.vat.explanation}
                      aria-describedby={`vat-note-${tier.id}`}>
                      <span>{q.vat.label}</span>
                      <span>{q.vat.reverseCharged ? "—" : q.formatted.vatAmount}</span>
                    </div>
                    <div className="border-t border-border/60 pt-1.5 flex justify-between font-semibold text-foreground">
                      <span>Total due</span>
                      <span>{q.formatted.gross}/{q.per}</span>
                    </div>
                    <p id={`vat-note-${tier.id}`} className="text-muted-foreground/70 text-[10px] leading-snug pt-0.5">
                      {q.vat.explanation}
                    </p>
                  </div>

                  {/* Feature pills */}
                  <ul className="space-y-2 flex-1">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={14} className="text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}

                    {/* Per-minute badge */}
                    <li className="flex items-center gap-2 text-sm">
                      <Tag size={14} className="text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">
                        {formatMoney(perMinute, q.currency)}/min included
                      </span>
                    </li>

                    {/* Overage badge */}
                    <li className="flex items-center gap-2 text-sm">
                      <Tag size={14} className="text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">
                        Overage {formatMoney(overagePerMinute, q.currency)}/min
                      </span>
                    </li>

                    {/* Upgrade value chip */}
                    {savingsPct !== null && savingsPct > 0 && (
                      <li>
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                          -{savingsPct}% /min vs {SUBSCRIPTION_TIERS[index-1].name}
                        </span>
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  <motion.a
                    href={tier.id === "enterprise"
                      ? "/demo"
                      : `/api/checkout?plan=${tier.id}&billing=${cycle === "yearly" ? "annual" : "monthly"}`}
                    className="flex items-center justify-center h-11 rounded-full font-semibold text-sm transition-all relative overflow-hidden group"
                    style={{
                      background: isPopular ? tier.color : "transparent",
                      color: isPopular ? "white" : tier.color,
                      border: `2px solid ${tier.color}`,
                    }}
                    whileTap={{ scale:0.97 }}
                  >
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                    {tier.id === "enterprise" ? "Book a demo" : `Start with ${tier.name}`}
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
            const perMinute = q.currency.tierMonthly[tier.id] / tier.minutesPerMonth
            const overagePerMinute = q.currency.overageByTier[tier.id]
            return (
              <div className="flex flex-col gap-6">
                {/* Price recap */}
                <div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-heading font-extrabold">{q.formatted.netEffective}</span>
                    <span className="text-muted-foreground text-sm mb-1.5">/{q.per}</span>
                  </div>
                  {cycle === "yearly" && (
                    <p className="text-xs text-muted-foreground mt-0.5">{q.formatted.monthlyEquivalent}/mo billed annually</p>
                  )}
                  {cycle === "yearly" && q.annualSavings > 0 && (
                    <span className="inline-block mt-2 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                      Save {q.formatted.annualSavings}/yr
                    </span>
                  )}
                </div>

                {/* Features */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Included</p>
                  <ul className="space-y-3">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <CheckCircle size={15} className="text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-3 text-sm">
                      <Tag size={15} className="text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{formatMoney(perMinute, q.currency)}/min included</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <Tag size={15} className="text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Overage {formatMoney(overagePerMinute, q.currency)}/min</span>
                    </li>
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

                {/* CTA */}
                <a
                  href={tier.id === "enterprise"
                    ? "/demo"
                    : `/api/checkout?plan=${tier.id}&billing=${cycle === "yearly" ? "annual" : "monthly"}`}
                  onClick={() => setSheetIdx(null)}
                  className="flex items-center justify-center h-12 rounded-full font-semibold text-sm"
                  style={{
                    background: isPopular ? tier.color : "transparent",
                    color: isPopular ? "white" : tier.color,
                    border: `2px solid ${tier.color}`,
                  }}
                >
                  {tier.id === "enterprise" ? "Book a demo" : `Start with ${tier.name}`}
                </a>
              </div>
            )
          })()}
        </BottomSheet>

        {/* Fine print */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          {country.flag} Taxes shown for <strong>{country.name}</strong>
          {country.note ? ` — ${country.note}` : ""}.
          {" "}Overage minutes billed at the per-tier rate shown above.
          {" "}All prices exclude applicable taxes unless shown otherwise.
        </p>

      </div>
    </section>
  )
}
