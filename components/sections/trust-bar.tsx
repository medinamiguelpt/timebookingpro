"use client"

import { motion } from "framer-motion"

const BUSINESSES = [
  "The Barber Studio",
  "Elite Cuts",
  "Luxe Salon",
  "Apex Barbershop",
  "Bloom Beauty",
  "Iron Fade",
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted/30 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
          Trusted by independent businesses
        </p>

        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

          <motion.ul
            className="flex gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[...BUSINESSES, ...BUSINESSES].map((name, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 shrink-0 text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">{name}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
