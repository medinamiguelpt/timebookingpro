"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, animate } from "framer-motion"
import {
  Clock,
  Globe,
  CalendarDays,
  MessageSquare,
  ShieldCheck,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

const INTEGRATIONS = [
  { name: "Google Calendar", color: "#4285F4", bg: "#EEF4FF" },
  { name: "Calendly",        color: "#006BFF", bg: "#E8F0FF" },
  { name: "Acuity",          color: "#F04E37", bg: "#FEF0EE" },
  { name: "Outlook",         color: "#0078D4", bg: "#E5F2FC" },
  { name: "Apple Calendar",  color: "#FF3B30", bg: "#FFF0EF" },
]

function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
}: {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  useEffect(() => {
    if (!inView) return
    const el = ref.current
    if (!el) return
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        el.textContent = prefix + Math.round(v) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, to, prefix, suffix, duration])

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  )
}

const FEATURES = [
  {
    icon: Clock,
    title: "24/7 availability",
    body: "Your agent never sleeps, never takes a lunch break, and never misses a call — weekends and holidays included.",
    wide: true,
    extra: { to: 0, prefix: "", suffix: "", label: "missed calls — ever" },
  },
  {
    icon: Globe,
    title: "Multilingual support",
    body: "Speaks fluent English, Spanish, Greek, Portuguese, German, and Arabic. Reach every customer in their language.",
    wide: false,
    extra: null,
  },
  {
    icon: CalendarDays,
    title: "Direct calendar sync",
    body: "Bookings go straight into your calendar in real time. No double-booking, no manual entry, no delays.",
    wide: false,
    extra: null,
  },
  {
    icon: MessageSquare,
    title: "Natural conversation",
    body: "Powered by advanced voice AI — sounds human, understands context, and handles complex requests gracefully.",
    wide: true,
    extra: { to: 98, prefix: "", suffix: "%", label: "callers think it's human" },
  },
  {
    icon: ShieldCheck,
    title: "Fully customisable",
    body: "Give your agent a name, a voice, and a personality that matches your brand. Your business, your agent.",
    wide: false,
    extra: null,
  },
  {
    icon: BarChart3,
    title: "Live dashboard",
    body: "Track calls, bookings, and revenue from a clean dashboard. Know exactly what your agent is doing.",
    wide: true,
    extra: { to: 34, prefix: "+", suffix: "%", label: "more bookings on average" },
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Features
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Everything your business needs
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            One agent. Zero missed calls. A calendar that fills itself.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, body, wide, extra }, i) => (
            <motion.div
              key={title}
              className={cn(
                "group relative rounded-2xl border border-border bg-card p-6",
                "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/8 transition-all duration-300 cursor-default",
                wide && "lg:col-span-2"
              )}
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <div className={cn("flex gap-6", wide ? "lg:flex-row lg:items-center" : "flex-col")}>
                <div className={cn("flex flex-col gap-4", wide && "lg:flex-1")}>
                  <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-colors">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base mb-1.5">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </div>
                {wide && extra && (
                  <div className="hidden lg:flex flex-col items-center justify-center bg-primary/8 border border-primary/20 rounded-xl px-8 py-5 shrink-0 text-center min-w-[160px] group-hover:bg-primary/12 transition-colors">
                    <p className="text-4xl font-heading font-extrabold text-primary leading-none">
                      <CountUp to={extra.to} prefix={extra.prefix} suffix={extra.suffix} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 leading-snug max-w-[120px]">
                      {extra.label}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {/* Works with strip */}
        <motion.div
          className="mt-14 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Connects with your calendar
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map(({ name, color, bg }) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  <CalendarDays size={13} style={{ color }} />
                </div>
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
