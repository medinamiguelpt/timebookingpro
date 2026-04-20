"use client"

import { motion } from "framer-motion"

const BUSINESSES = [
  { name: "The Barber Studio",    rating: 5, city: "Miami" },
  { name: "Elite Cuts",           rating: 5, city: "Atlanta" },
  { name: "Luxe Salon",           rating: 5, city: "LA" },
  { name: "Apex Barbershop",      rating: 5, city: "Chicago" },
  { name: "Bloom Beauty",         rating: 5, city: "NYC" },
  { name: "Iron Fade",            rating: 5, city: "Houston" },
  { name: "Prestige Grooming",    rating: 5, city: "Dallas" },
  { name: "The Cut Collective",   rating: 5, city: "Phoenix" },
]

const AVATARS = ["JD", "MR", "SK", "AL", "PB", "TC", "IM", "RF"]

function Stars() {
  return (
    <span className="flex gap-[2px]">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

export function TrustBar() {
  const items = [...BUSINESSES, ...BUSINESSES]

  return (
    <section className="border-y border-border bg-muted/30 py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-7">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted by independent businesses — rated 5 stars
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.ul
          className="flex gap-4 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {items.map(({ name, city }, i) => (
            <li
              key={i}
              className="flex items-center gap-3 shrink-0 bg-card border border-border rounded-full pl-1.5 pr-4 py-1.5"
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                {AVATARS[i % AVATARS.length]}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <Stars />
                </div>
                <span className="text-xs font-semibold text-foreground whitespace-nowrap leading-tight">{name}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{city}</span>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
