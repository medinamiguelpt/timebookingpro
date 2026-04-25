"use client"

import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { CheckCircle, ChevronDown } from "lucide-react"
import { SUBSCRIPTION_TIERS, FEATURE_KEYS, quote, YEARLY_DISCOUNT, activeHolidayPromo, type BillingCycle, type FeatureKey } from "@/lib/pricing"
import { type CurrencyCode } from "@/lib/currencies"
import { COUNTRIES, COUNTRY_ORDER, type CountryCode } from "@/lib/vat"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { RevealWords } from "@/components/ui/reveal-words"
import { Tooltip } from "@/components/ui/tooltip"

/** Map a tier's minute bucket to the matching tooltip key in messages.pricing.featureTips */
function minutesTipKey(min: number): "minutes100" | "minutes250" | "minutes500" | "minutes1000" {
  if (min >= 1000) return "minutes1000"
  if (min >= 500)  return "minutes500"
  if (min >= 250)  return "minutes250"
  return "minutes100"
}

// Only SE/DK/PL have native price tables; every other EU country falls back to EUR.
const COUNTRY_CURRENCY: Partial<Record<CountryCode, CurrencyCode>> = {
  SE: "SEK", DK: "DKK", PL: "PLN",
}
function currencyForCountry(country: CountryCode): CurrencyCode {
  return COUNTRY_CURRENCY[country] ?? "EUR"
}

const DEFAULT_COUNTRY: CountryCode = "GR"

export function Pricing({ headline = "Simple, transparent pricing" }: { headline?: string }) {
  const t = useTranslations("pricing")
  const [cycle, setCycle] = useState<BillingCycle>("monthly")
  const [countryCode, setCountryCode] = useState<CountryCode>(DEFAULT_COUNTRY)
  const [sheetIdx, setSheetIdx] = useState<number | null>(null)
  const [pressedTierIdx, setPressedTierIdx] = useState<number | null>(null)
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currencyCode = currencyForCountry(countryCode)

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

  // B2B reverse-charge is handled at Stripe Checkout via VIES — not on the landing page.
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
            {t("eyebrow")}
          </motion.p>
          <RevealWords
            key={headline}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            delay={0.1}
          >
            {headline}
          </RevealWords>
          <motion.p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.4, delay:0.2 }}>
            {t("subheadline")}
          </motion.p>
        </div>

        {/* Holiday promo banner — single-row, compact */}
        <AnimatePresence>
          {promo && (
            <motion.div
              key={promo.id}
              initial={{ opacity:0, y:-8 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-6 }}
              transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
              className="mb-6 rounded-xl px-3.5 py-2 flex items-center gap-2.5 border"
              style={{ background:`${promo.color}12`, borderColor:`${promo.color}30` }}
            >
              <span className="text-base shrink-0" aria-hidden>{promo.emoji}</span>
              <p className="flex-1 min-w-0 text-sm leading-snug truncate sm:whitespace-normal sm:truncate-none">
                <span className="font-heading font-bold" style={{ color:promo.color }}>{promo.name}</span>
                <span className="hidden sm:inline text-muted-foreground"> — {promo.tagline}</span>
              </p>
              <span className="shrink-0 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border border-dashed"
                style={{ color:promo.color, borderColor:`${promo.color}50`, background:`${promo.color}08` }}>
                {promo.code}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unified picker — one dropdown, currency implied by country. */}
        <div className="flex flex-col gap-1 mx-auto w-fit mb-6">
          <label
            htmlFor="pricing-country"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center"
          >
            {t("countryLabel")}
          </label>
          <div className="relative">
            <select
              id="pricing-country"
              value={countryCode}
              onChange={e => setCountryCode(e.target.value as CountryCode)}
              className="appearance-none ps-3 pe-9 h-10 rounded-lg border border-border bg-card text-sm text-foreground outline-none focus:border-primary/50 transition-colors cursor-pointer min-w-[220px]"
              aria-label={t("selectCountryAriaLabel")}
            >
              {COUNTRY_ORDER.map(code => {
                const c = COUNTRIES[code]
                return (
                  <option key={code} value={code}>
                    {c.flag} {t(`countries.${code}`)} · {currencyForCountry(code)}
                  </option>
                )
              })}
            </select>
            <ChevronDown size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
                  {c === "monthly" ? t("cycleMonthly") : t("cycleYearly")}
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
                      {t("cycleSavings", { pct: yearlyPct })}
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
            const tierName = t(`tiers.${tier.id}.name`)
            const tierProfile = t(`tiers.${tier.id}.profile`)
            const minutesLine = t("minutesLine", { n: tier.minutesPerMonth.toLocaleString("en-US") })
            const minutesKey = minutesTipKey(tier.minutesPerMonth)
            const showStrike = !!q.promo && q.netPreHoliday !== q.netEffective
            const isPopular = tier.badge === "Most popular"
            // Per-minute savings vs. the previous tier (dashboard shows this chip below the feature list)
            const perMin = tier.monthly / tier.minutesPerMonth
            const prev = index > 0 ? SUBSCRIPTION_TIERS[index - 1] : null
            const prevPerMin = prev ? prev.monthly / prev.minutesPerMonth : null
            const savingsPct = prevPerMin ? Math.round((1 - perMin / prevPerMin) * 100) : 0

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
                      {tier.badge === "Most popular" ? t("badges.mostPopular") : t("badges.bestValue")}
                    </span>
                  </div>
                )}

                <SpotlightCard className={`relative rounded-2xl border p-6 flex flex-col gap-5 h-full transition-shadow duration-300 ${
                  isPopular
                    ? "border-primary/60 bg-gradient-to-b from-primary/10 to-primary/5 shadow-2xl shadow-primary/20 ring-1 ring-primary/20"
                    : "border-border bg-card hover:shadow-xl hover:border-primary/25"
                }`}>

                  {/* Name */}
                  <p className="font-heading font-bold text-lg" style={{ color: tier.color }}>{tierName}</p>

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
                          <span className="text-muted-foreground text-sm mb-1.5">{t("perMonthSuffix")}</span>
                        </div>

                        {cycle === "yearly" && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {t("yearlyBilling", { amount: q.formatted.yearlyTotal })}
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Annual savings chip */}
                    {cycle === "yearly" && q.annualSavings > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                          {t("annualSavingsChip", { amount: q.formatted.annualSavings })}
                        </span>
                        {q.promo && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ color:q.promo.color, background:`${q.promo.color}15` }}>
                            {t("promoChip", { pct: Math.round(q.promo.discount*100), emoji: q.promo.emoji })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tax breakdown — values animate on country/cycle/currency change */}
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs space-y-1.5">
                    {[
                      { label: t("netLabel"), value: q.formatted.netEffective,                         key: `net-${q.formatted.netEffective}` },
                      { label: q.vat.label,    value: q.vat.reverseCharged ? "—" : q.formatted.vatAmount, key: `vat-${q.formatted.vatAmount}-${q.vat.reverseCharged}`, hint: q.vat.explanation, hintId: `vat-note-${tier.id}` },
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
                      <span>{t("totalDueLabel")}</span>
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

                  {/* Feature list — tier-specific minutes line + shared bullets */}
                  <ul className="space-y-2 flex-1">
                    {/* Minutes line (tier-specific tooltip) */}
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-primary shrink-0" />
                      <Tooltip content={t(`featureTips.${minutesKey}`)}>
                        <span className="underline decoration-dotted underline-offset-2 decoration-muted-foreground/40">{minutesLine}</span>
                      </Tooltip>
                    </li>
                    {/* Shared feature bullets */}
                    {FEATURE_KEYS.map((key: FeatureKey) => (
                      <li key={key} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={14} className="text-primary shrink-0" />
                        <Tooltip content={t(`featureTips.${key}`)}>
                          <span className="underline decoration-dotted underline-offset-2 decoration-muted-foreground/40">{t(`features.${key}`)}</span>
                        </Tooltip>
                      </li>
                    ))}
                  </ul>

                  {/* Per-minute savings chip vs. previous tier — matches canonical dashboard */}
                  {savingsPct > 0 && prev && (
                    <span className="inline-flex w-fit items-center text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                      {t("perMinSavings", { pct: savingsPct, prevName: t(`tiers.${prev.id}.name`) })}
                    </span>
                  )}

                  {/* Mobile-only: open bottom sheet with full plan details */}
                  <button
                    onClick={() => setSheetIdx(index)}
                    className="md:hidden w-full pt-1 text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("seeAllPlanDetails")}
                  </button>
                </SpotlightCard>
              </motion.div>
            )
          })}
          </div>
          {/* Right-edge fade — signals there's more to swipe, mobile only */}
          <div className="md:hidden absolute end-0 inset-y-0 w-10 bg-gradient-to-l rtl:bg-gradient-to-r from-background/70 to-transparent pointer-events-none" aria-hidden />
        </div>

        {/* Bottom sheet — mobile plan details */}
        <BottomSheet
          open={sheetIdx !== null}
          onClose={() => setSheetIdx(null)}
          title={sheetIdx !== null ? t("sheetTitle", { name: t(`tiers.${quotes[sheetIdx].tier.id}.name`) }) : undefined}
        >
          {sheetIdx !== null && (() => {
            const q = quotes[sheetIdx]
            const { tier } = q
            const sheetMinutesLine = t("minutesLine", { n: tier.minutesPerMonth.toLocaleString("en-US") })
            return (
              <div className="flex flex-col gap-6">
                {/* Price recap */}
                <div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-heading font-extrabold">
                      {cycle === "yearly" ? q.formatted.monthlyEquivalent : q.formatted.netEffective}
                    </span>
                    <span className="text-muted-foreground text-sm mb-1.5">{t("perMonthSuffix")}</span>
                  </div>
                  {cycle === "yearly" && (
                    <p className="text-xs text-muted-foreground mt-0.5">{t("yearlyBilling", { amount: q.formatted.yearlyTotal })}</p>
                  )}
                  <p className="text-xs text-muted-foreground/80 mt-2">{t(`tiers.${tier.id}.profile`)}</p>
                </div>

                {/* Features — minutes line + shared bullets */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t("includedHeading")}</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm">
                      <CheckCircle size={15} className="text-primary shrink-0" />
                      <span>{sheetMinutesLine}</span>
                    </li>
                    {FEATURE_KEYS.map((key: FeatureKey) => (
                      <li key={key} className="flex items-center gap-3 text-sm">
                        <CheckCircle size={15} className="text-primary shrink-0" />
                        <span>{t(`features.${key}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tax breakdown */}
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t("priceBreakdownHeading")}</p>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("netLabel")}</span><span>{q.formatted.netEffective}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{q.vat.label}</span>
                    <span>{q.vat.reverseCharged ? "—" : q.formatted.vatAmount}</span>
                  </div>
                  <div className="border-t border-border/60 pt-2 flex justify-between font-semibold">
                    <span>{t("totalDueLabel")}</span><span>{q.formatted.gross}/{q.per}</span>
                  </div>
                  <p className="text-muted-foreground/70 text-xs pt-1">{q.vat.explanation}</p>
                </div>

              </div>
            )
          })()}
        </BottomSheet>

        {/* Under-grid microcopy — hard-cap explainer + geo-swapped tax line */}
        <div className="mt-10 max-w-3xl mx-auto text-center space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("microcopyHardCap")}
          </p>
          <p className="text-xs text-muted-foreground/80">
            {t.rich("taxLine", {
              flag: country.flag,
              country: t(`countries.${countryCode}`),
              note: country.note ? t("taxLineNoteSeparator") + country.note : "",
              bold: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

      </div>
    </section>
  )
}
