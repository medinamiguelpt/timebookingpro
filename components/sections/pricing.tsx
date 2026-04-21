"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SpotlightCard } from "@/components/ui/spotlight-card"

type CoinParticle = { id: number; x: number; delay: number; emoji: string }
let coinId = 0
const COIN_EMOJIS = ["💰", "🪙", "✨", "💸", "🎉"]

const PLANS = [
  {
    name: "Starter",
    monthly: 79,
    annual: 63,
    description: "Perfect for solo operators and small shops.",
    perks: [
      "200 minutes/month",
    ],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Professional",
    monthly: 149,
    annual: 119,
    description: "For growing barbershops with higher call volume.",
    perks: [
      "500 minutes/month",
    ],
    cta: "Get started",
    popular: true,
  },
  {
    name: "Enterprise",
    monthly: 299,
    annual: 239,
    description: "For multi-location or high-volume businesses.",
    perks: [
      "1,000 minutes/month",
    ],
    cta: "Contact us",
    popular: false,
  },
]

function PricingCard({
  name, price, originalPrice, annualPrice, description, perks, cta, popular, annual,
}: {
  name: string; price: number; originalPrice: number; annualPrice: number; description: string
  perks: string[]; cta: string; popular: boolean; annual: boolean
}) {
  return (
    <SpotlightCard
      className={`relative rounded-2xl border p-7 flex flex-col gap-6 transition-shadow duration-300 ${
        popular
          ? "border-primary/60 bg-gradient-to-b from-primary/10 to-primary/5 shadow-2xl shadow-primary/20 ring-1 ring-primary/20"
          : "border-border bg-card"
      }`}
    >

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
            €{price}
          </motion.span>
        </AnimatePresence>
        <div className="flex flex-col mb-1">
          <span className="text-muted-foreground text-sm">/mo</span>
          {annual && <span className="text-xs text-muted-foreground line-through">€{originalPrice}</span>}
        </div>
        {annual && (
          <span className="mb-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
            Save €{(originalPrice - annualPrice) * 12}/yr
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
        render={<a href={name === "Enterprise" ? "/demo" : `/api/checkout?plan=${name.toLowerCase()}&billing=${annual ? "annual" : "monthly"}`} />}
        nativeButton={false}
        className={`rounded-full font-semibold h-11 ${
          popular
            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
            : "bg-transparent border-2 border-border hover:border-primary/40 hover:bg-primary/5 text-foreground transition-colors"
        }`}
      >
        {cta}
      </Button>
    </SpotlightCard>
  )
}

export function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [coins, setCoins] = useState<CoinParticle[]>([])
  const toggleRef = useRef<HTMLDivElement>(null)

  const spawnCoins = useCallback(() => {
    const count = 5
    const newCoins: CoinParticle[] = Array.from({ length: count }, (_, i) => ({
      id: ++coinId,
      x: (Math.random() - 0.5) * 120,
      delay: i * 0.07,
      emoji: COIN_EMOJIS[Math.floor(Math.random() * COIN_EMOJIS.length)],
    }))
    setCoins((p) => [...p, ...newCoins])
    setTimeout(() => setCoins((p) => p.filter((c) => !newCoins.find((n) => n.id === c.id))), 1800)
  }, [])

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
            ref={toggleRef}
            className="relative mt-8 inline-flex items-center gap-3 bg-muted rounded-full p-1"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {/* Coin particles */}
            <AnimatePresence>
              {coins.map((coin) => (
                <motion.span
                  key={coin.id}
                  className="pointer-events-none absolute text-lg select-none"
                  style={{ left: `calc(50% + ${coin.x}px)`, bottom: "50%" }}
                  initial={{ y: 0, opacity: 1, scale: 0.5 }}
                  animate={{ y: -100, opacity: 0, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, delay: coin.delay, ease: [0.22, 1, 0.36, 1] }}
                >
                  {coin.emoji}
                </motion.span>
              ))}
            </AnimatePresence>

            <button
              onClick={() => setAnnual(false)}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                !annual ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => { setAnnual(true); if (!annual) spawnCoins() }}
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

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map(({ name, monthly, annual: annualPrice, description, perks, cta, popular }, i) => {
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
                <PricingCard
                  name={name}
                  price={price}
                  originalPrice={originalPrice}
                  annualPrice={annualPrice}
                  description={description}
                  perks={perks}
                  cta={cta}
                  popular={popular}
                  annual={annual}
                />
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
          For free trial and testing, <a href="/demo" className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">contact us</a>{annual ? " · Billed annually" : ""}
        </motion.p>
      </div>
    </section>
  )
}
