"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, animate } from "framer-motion"

const STATS = [
  { to: 500, prefix: "", suffix: "+", label: "businesses onboarded" },
  { to: 2, prefix: "", suffix: "M+", label: "calls handled" },
  { to: 99, prefix: "", suffix: "%", label: "calls answered instantly" },
  { to: 24, prefix: "<", suffix: "h", label: "to go live" },
]

function CountUp({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  useEffect(() => {
    if (!inView) return
    const el = ref.current
    if (!el) return
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        el.textContent = prefix + Math.round(v) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, to, prefix, suffix])

  return <span ref={ref}>{prefix}0{suffix}</span>
}

export function StatsBar() {
  return (
    <section className="py-16 bg-primary/5 border-y border-primary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map(({ to, prefix, suffix, label }, i) => (
            <motion.div
              key={label}
              className="flex flex-col items-center text-center gap-1"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <p className="text-3xl sm:text-4xl font-heading font-extrabold text-primary">
                <CountUp to={to} prefix={prefix} suffix={suffix} />
              </p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
