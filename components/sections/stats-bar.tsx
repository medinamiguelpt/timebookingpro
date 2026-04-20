"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, animate } from "framer-motion"

const STATS = [
  { to: 500,  prefix: "",  suffix: "+",  label: "businesses onboarded",    color: "#7C3AED", progress: 100 },
  { to: 2,    prefix: "",  suffix: "M+", label: "calls handled",           color: "#0EA5E9", progress: 95 },
  { to: 99,   prefix: "",  suffix: "%",  label: "calls answered instantly", color: "#10B981", progress: 99 },
  { to: 24,   prefix: "<", suffix: "h",  label: "to go live",              color: "#F59E0B", progress: 75 },
]

function StatItem({ to, prefix, suffix, label, color, progress, index }: typeof STATS[0] & { index: number }) {
  const numRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  useEffect(() => {
    if (!inView) return
    const numEl = numRef.current
    const barEl = barRef.current
    if (!numEl) return

    const ctrl = animate(0, to, {
      duration: 2,
      delay: index * 0.12,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) { numEl.textContent = prefix + Math.round(v) + suffix },
    })

    if (barEl) {
      animate(0, progress, {
        duration: 1.6,
        delay: 0.3 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
        onUpdate(v) { barEl.style.width = `${v}%` },
      })
    }

    return () => ctrl.stop()
  }, [inView, to, prefix, suffix, index, progress])

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center gap-3"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ring + number */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="3"
            className="text-border" />
          <motion.circle
            cx="50" cy="50" r="44" fill="none" strokeWidth="3"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
            initial={{ strokeDashoffset: `${2 * Math.PI * 44}` }}
            whileInView={{ strokeDashoffset: `${2 * Math.PI * 44 * (1 - progress / 100)}` }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, delay: 0.3 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        <div className="relative z-10 text-center">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold leading-none tabular-nums" style={{ color }}>
            <span ref={numRef}>{prefix}0{suffix}</span>
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-tight max-w-[110px]">{label}</p>

      {/* Bar */}
      <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
        <div ref={barRef} className="h-full rounded-full" style={{ width: "0%", background: color }} />
      </div>
    </motion.div>
  )
}

export function StatsBar() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent pointer-events-none" />
      <div className="absolute inset-0 border-y border-primary/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
