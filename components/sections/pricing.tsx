"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const PLANS = [
  {
    name: "Starter",
    monthly: 49,
    annual: 39,
    description: "Perfect for solo operators and small shops.",
    perks: [
      "1 AI voice agent",
      "Up to 200 calls/month",
      "Calendar sync",
      "Booking confirmations",
      "Email support",
    ],
    cta: "Get started",
    popular: false,
    franchise: false,
  },
  {
    name: "Growth",
    monthly: 99,
    annual: 79,
    description: "For growing businesses with higher call volume.",
    perks: [
      "1 AI voice agent",
      "Up to 600 calls/month",
      "Multi-staff scheduling",
      "Multilingual support",
      "Priority support",
      "Analytics dashboard",
    ],
    cta: "Get started",
    popular: true,
    franchise: false,
  },
  {
    name: "Pro",
    monthly: 199,
    annual: 159,
    description: "For multi-location or high-volume businesses.",
    perks: [
      "Up to 3 AI voice agents",
      "Unlimited calls",
      "Custom agent voice & persona",
      "CRM integrations",
      "Dedicated onboarding",
      "SLA support",
    ],
    cta: "Contact us",
    popular: false,
    franchise: false,
  },
  {
    name: "Franchise",
    monthly: 499,
    annual: 399,
    description: "For chains, franchises, and multi-location groups.",
    perks: [
      "Up to 10 AI voice agents",
      "Unlimited calls across all locations",
      "Centralised multi-location dashboard",
      "White-label agent voice & branding",
      "Custom CRM & POS integrations",
      "Dedicated account manager",
      "99.9% SLA guarantee",
    ],
    cta: "Contact us",
    popular: false,
    franchise: true,
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Pricing
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Simple, honest pricing
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            No hidden fees. No long-term contracts. Cancel any time.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            className="mt-8 inline-flex items-center gap-3 bg-muted rounded-full p-1"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <button
              onClick={() => setAnnual(false)}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                !annual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                annual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="text-[10px] font-bold bg-green-500/15 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                −20%
              </span>
            </button>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {PLANS.map(({ name, monthly, annual: annualPrice, description, perks, cta, popular, franchise }, i) => {
            const price = annual ? annualPrice : monthly
            const originalPrice = monthly

            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
              <SpotlightCard
                className={`relative rounded-2xl border p-7 flex flex-col gap-6 transition-shadow duration-300 ${
                  popular
                    ? "border-primary/60 bg-gradient-to-b from-primary/10 to-primary/5 shadow-2xl shadow-primary/20 ring-1 ring-primary/20"
                    : franchise
                    ? "border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-amber-500/5 hover:shadow-md hover:shadow-amber-500/10"
                    : "border-border bg-card hover:shadow-md hover:shadow-primary/8"
                }`}
              >
                {popular && (
                  <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-semibold px-5 py-1.5 rounded-full text-xs shadow-lg shadow-primary/30">
                    Most popular
                  </Badge>
                )}
                {franchise && (
                  <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-semibold px-5 py-1.5 rounded-full text-xs shadow-lg shadow-amber-500/30">
                    Multi-location
                  </Badge>
                )}

                <div>
                  <p className="font-heading font-bold text-lg mb-1">{name}</p>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>

                <div className="flex items-end gap-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={price}
                      className="text-4xl font-heading font-extrabold"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      ${price}
                    </motion.span>
                  </AnimatePresence>
                  <div className="flex flex-col mb-1">
                    <span className="text-muted-foreground text-sm">/mo</span>
                    {annual && (
                      <span className="text-xs text-muted-foreground line-through">${originalPrice}</span>
                    )}
                  </div>
                  {annual && (
                    <span className="mb-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                      Save ${(originalPrice - annualPrice) * 12}/yr
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle size={15} className="text-primary mt-0.5 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  render={<a href={(name === "Pro" || name === "Franchise") ? "/demo" : `/api/checkout?plan=${name.toLowerCase()}&billing=${annual ? "annual" : "monthly"}`} />}
                  nativeButton={false}
                  className={`rounded-full font-semibold h-11 ${
                    popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                      : franchise
                      ? "bg-amber-500 hover:bg-amber-500/90 text-white shadow-lg shadow-amber-500/25"
                      : "bg-transparent border-2 border-border hover:border-primary/40 hover:bg-primary/5 text-foreground transition-colors"
                  }`}
                >
                  {cta}
                </Button>
              </SpotlightCard>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          className="text-center text-sm text-muted-foreground mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {annual ? "Billed annually · " : ""}All plans include a 14-day free trial · No credit card required
        </motion.p>
      </div>
    </section>
  )
}
