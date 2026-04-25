"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { TrendingUp } from "lucide-react"
import { SUBSCRIPTION_TIERS } from "@/lib/pricing"

// Each tier's monthly minute bucket converted to an approximate call cap,
// assuming ~1.1 min per booking call (matches the brief's self-select profiles:
// Light ~3 calls/day · Standard ~8 · Busy ~15 · Heavy ~30+).
// Sourced from lib/pricing.ts so future price/minute changes flow through here.
const AVG_MIN_PER_CALL = 1.1

const PLANS = SUBSCRIPTION_TIERS.map(tier => ({
  id: tier.id,
  name: tier.name,
  price: tier.monthly,
  maxCalls: Math.floor(tier.minutesPerMonth / AVG_MIN_PER_CALL),
}))

function formatCurrency(n: number) {
  return n >= 1000
    ? "€" + (n / 1000).toFixed(1).replace(/\.0$/, "") + "k"
    : "€" + Math.round(n)
}

export function Calculator({ headline = "See what missed calls cost you" }: { headline?: string }) {
  const t = useTranslations("calculator")
  const [dailyCalls, setDailyCalls]     = useState(20)
  const [bookingValue, setBookingValue] = useState(22)
  const [missRate, setMissRate]         = useState(30)

  const stats = useMemo(() => {
    const monthlyCalls = dailyCalls * 30
    const missedPerMonth = Math.round(monthlyCalls * (missRate / 100))
    const lostRevenue = missedPerMonth * bookingValue
    const recommended = PLANS.find((p) => monthlyCalls <= p.maxCalls) ?? PLANS[PLANS.length - 1]
    const roi = recommended.price > 0 ? Math.round(lostRevenue / recommended.price) : 0
    return { monthlyCalls, missedPerMonth, lostRevenue, recommended, roi }
  }, [dailyCalls, bookingValue, missRate])

  return (
    <section className="pt-0 pb-24 sm:pb-32 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h2
            key={headline}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {headline}
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {t("subheadline")}
          </motion.p>
        </div>

        <motion.div
          className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {/* Sliders */}
            <div className="p-7 space-y-8">
              {[
                {
                  label: t("sliderDailyCalls"),
                  value: dailyCalls,
                  min: 5, max: 100, step: 5,
                  display: t("callsPerDay", { n: dailyCalls }),
                  onChange: setDailyCalls,
                },
                {
                  label: t("sliderBookingValue"),
                  value: bookingValue,
                  min: 5, max: 150, step: 5,
                  display: `€${bookingValue}`,
                  onChange: setBookingValue,
                },
                {
                  label: t("sliderMissRate"),
                  value: missRate,
                  min: 10, max: 80, step: 5,
                  display: `${missRate}%`,
                  onChange: setMissRate,
                },
              ].map(({ label, value, min, max, step, display, onChange }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-foreground">{label}</label>
                    <span className="text-sm font-bold text-primary">{display}</span>
                  </div>
                  <input
                    type="range"
                    min={min} max={max} step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-primary/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-muted-foreground">{min}</span>
                    <span className="text-[11px] text-muted-foreground">{max}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="p-7 flex flex-col gap-5 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t("monthlyCallsLabel"),     value: stats.monthlyCalls.toLocaleString("en-US")    },
                  { label: t("missedPerMonthLabel"),   value: stats.missedPerMonth.toLocaleString("en-US")  },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-border bg-card/80 p-3.5 text-center">
                    <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
                    <p className="text-xl font-heading font-extrabold text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              {/* Lost revenue highlight */}
              <div className="rounded-xl border border-destructive/20 bg-red-500/5 p-4 text-center">
                <p className="text-xs font-semibold text-muted-foreground mb-1">{t("revenueLostLabel")}</p>
                <motion.p
                  key={stats.lostRevenue}
                  className="text-4xl font-heading font-extrabold text-destructive"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {formatCurrency(stats.lostRevenue)}
                </motion.p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("missedDetail", { missed: stats.missedPerMonth, bookingValue })}
                </p>
              </div>

              {/* Plan recommendation */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp size={18} className="text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary mb-0.5">{t("recommendedPlanLabel")}</p>
                    <p className="text-sm font-heading font-bold text-foreground">
                      {t("planLine", { name: stats.recommended.name, price: stats.recommended.price })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.rich("roiLine", {
                        roi: stats.roi,
                        recovered: formatCurrency(stats.lostRevenue - stats.recommended.price),
                        bold: (chunks) => <span className="font-semibold text-primary">{chunks}</span>,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
