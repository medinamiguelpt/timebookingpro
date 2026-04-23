"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, animate } from "framer-motion"
import { Clock, Globe, CalendarDays, MessageSquare, ShieldCheck, BarChart3 } from "lucide-react"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Globe3D } from "@/components/ui/globe-3d"
import { RevealWords } from "@/components/ui/reveal-words"
import { cn } from "@/lib/utils"

const INTEGRATIONS = [
  { name: "Google Calendar", color: "#4285F4" },
  { name: "Calendly",        color: "#006BFF" },
  { name: "Acuity",          color: "#F04E37" },
  { name: "Outlook",         color: "#0078D4" },
  { name: "Apple Calendar",  color: "#FF3B30" },
]

export function CountUp({ to, prefix = "", suffix = "", duration = 1.8 }: {
  to: number; prefix?: string; suffix?: string; duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  useEffect(() => {
    if (!inView) return
    const el = ref.current
    if (!el) return
    const ctrl = animate(0, to, {
      duration, ease: [0.22, 1, 0.36, 1],
      onUpdate(v) { el.textContent = prefix + Math.round(v) + suffix },
    })
    return () => ctrl.stop()
  }, [inView, to, prefix, suffix, duration])
  return <span ref={ref}>{prefix}0{suffix}</span>
}

type Feature = {
  icon: React.ElementType
  title: string
  body: string
  accent: string
  accentBg: string
  span: "normal" | "wide" | "tall"
  /** Tailwind group-hover class applied to the icon itself (not the container) */
  iconAnim?: string
  stat?: { value: number; prefix?: string; suffix: string; label: string }
  extra?: React.ReactNode
}

const FEATURES: Feature[] = [
  {
    icon: Clock,
    iconAnim: "group-hover:rotate-[20deg]",
    title: "24/7 availability",
    body: "Never sleeps, never takes a break. Your agent answers every call on weekends, nights, and holidays.",
    accent: "#7C3AED",
    accentBg: "rgba(124,58,237,0.08)",
    span: "wide",
    stat: { value: 0, suffix: "", label: "missed calls — ever" },
  },
  {
    icon: MessageSquare,
    iconAnim: "group-hover:-translate-y-1 group-hover:scale-110",
    title: "Natural conversation",
    body: "Powered by advanced voice AI — sounds human, handles complex requests, understands context.",
    accent: "#0EA5E9",
    accentBg: "rgba(14,165,233,0.08)",
    span: "normal",
    stat: { value: 98, suffix: "%", label: "callers think it's human" },
  },
  {
    icon: Globe,
    iconAnim: "group-hover:rotate-[180deg] duration-700",
    title: "Multilingual",
    body: "Greek, English, Spanish, Portuguese, French, German, Arabic — 7 languages, auto-detected per caller.",
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.08)",
    span: "normal",
    extra: (
      <div className="flex justify-center mt-3">
        <Globe3D size={80} />
      </div>
    ),
  },
  {
    icon: CalendarDays,
    iconAnim: "group-hover:-translate-y-1.5 group-hover:scale-105",
    title: "Direct calendar sync",
    body: "Bookings go straight into your calendar in real time. Zero double-bookings, zero manual entry.",
    accent: "#F59E0B",
    accentBg: "rgba(245,158,11,0.08)",
    span: "normal",
    extra: (
      <div className="flex flex-wrap gap-1.5 mt-3">
        {INTEGRATIONS.map(({ name, color }) => (
          <span key={name} className="text-[11px] font-medium rounded-full px-2.5 py-1 border border-border bg-background"
            style={{ color }}>
            {name}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    iconAnim: "group-hover:scale-110 group-hover:rotate-[-8deg]",
    title: "Fully customisable",
    body: "Name, voice, personality — your brand, your agent.",
    accent: "#EC4899",
    accentBg: "rgba(236,72,153,0.08)",
    span: "normal",
  },
  {
    icon: BarChart3,
    iconAnim: "group-hover:-translate-y-1 group-hover:scale-y-110",
    title: "Live dashboard",
    body: "Track calls, bookings, and revenue in real time. Know what your agent is doing, always.",
    accent: "#7C3AED",
    accentBg: "rgba(124,58,237,0.08)",
    span: "wide",
    stat: { value: 34, prefix: "+", suffix: "%", label: "more bookings on average" },
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            Features
          </motion.p>
          <RevealWords
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            delay={0.1}
          >
            Everything your business needs
          </RevealWords>
          <motion.p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}>
            One agent. Zero missed calls. A calendar that fills itself.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {FEATURES.map(({ icon: Icon, title, body, accent, accentBg, span, stat, extra, iconAnim }, i) => (
            <motion.div
              key={title}
              className={cn(span === "wide" && "sm:col-span-2")}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <SpotlightCard className={cn(
                "group relative h-full rounded-2xl border border-border bg-card overflow-hidden",
                "hover:border-[color:var(--accent-color)] hover:shadow-xl transition-all duration-300 cursor-default",
                span === "wide" && "flex flex-col sm:flex-row"
              )}
              style={{ "--accent-color": accent + "60" } as React.CSSProperties}
              >
                {/* Accent glow bg */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse 80% 60% at 0% 0%, ${accentBg}, transparent)` }}
                />

                {/* Content side */}
                <div className={cn("relative p-6 flex flex-col gap-4 z-10", span === "wide" ? "flex-1" : "")}>
                  {/* Icon — container scales, icon has its own unique animation */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: accentBg, border: `1px solid ${accent}30` }}>
                    <div className={cn("transition-transform duration-300 origin-center", iconAnim ?? "")}>
                      <Icon size={20} style={{ color: accent }} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-base mb-1.5">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                    {extra}
                  </div>
                </div>

                {/* Stat side (wide cards) */}
                {span === "wide" && stat && (
                  <div className={cn(
                    "relative z-10 flex flex-col items-center justify-center px-8 py-6 sm:min-w-[180px] border-t sm:border-t-0 sm:border-l border-border/60",
                    "transition-colors duration-300"
                  )}
                  style={{ background: `${accentBg}` }}
                  >
                  <div className="text-center">
                    <p className="text-5xl font-heading font-extrabold leading-none mb-2 tabular-nums"
                      style={{ color: accent }}>
                      <CountUp to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-muted-foreground leading-snug max-w-[140px]">{stat.label}</p>
                  </div>
                  </div>
                )}

                {/* Stat badge (narrow cards) */}
                {span === "normal" && stat && (
                  <div className="absolute bottom-4 right-4 z-10 rounded-xl px-3 py-1.5 text-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: accentBg, border: `1px solid ${accent}30` }}>
                    <p className="text-lg font-heading font-extrabold leading-none" style={{ color: accent }}>
                      <CountUp to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                )}
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
