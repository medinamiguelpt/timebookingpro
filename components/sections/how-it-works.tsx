"use client"

import { motion, useInView } from "framer-motion"
import { useRef, type ElementType } from "react"
import { PhoneCall, Settings2, CalendarCheck, Mic, Zap, Bell } from "lucide-react"

const STEPS = [
  {
    icon: Settings2,
    title: "We set up your agent",
    body: "Tell us your business name, hours, and services. We build and train your personal AI agent in under 24 hours.",
  },
  {
    icon: PhoneCall,
    title: "It answers every call",
    body: "Your agent picks up instantly — day, night, and weekends. It speaks naturally, understands your customers, and handles any booking request.",
  },
  {
    icon: CalendarCheck,
    title: "Your calendar fills up",
    body: "Bookings land directly in your calendar. You get a notification, your customer gets a confirmation. Zero effort on your part.",
  },
]

const FLOW_NODES = [
  {
    Icon: PhoneCall,
    label: "Customer calls",
    sub: "Any number · Any hour",
  },
  {
    Icon: Mic,
    label: "Agent answers",
    sub: "Voice AI · < 1 second",
  },
  {
    Icon: Zap,
    label: "Booking processed",
    sub: "Intent understood",
  },
  {
    Icon: CalendarCheck,
    label: "Slot confirmed",
    sub: "Calendar synced live",
  },
  {
    Icon: Bell,
    label: "Both notified",
    sub: "SMS · Email",
  },
]

const CONNECTOR_LABELS = ["Voice call", "Conversation", "Booking data", "Confirmation"]

function FlowNode({ Icon, label, sub, index }: { Icon: ElementType; label: string; sub: string; index: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 z-10 shrink-0"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.12 }}
    >
      <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center">
        <Icon size={18} className="text-primary md:hidden" />
        <Icon size={22} className="text-primary hidden md:block" />
      </div>
      <div className="text-center max-w-[80px] md:max-w-[100px]">
        <p className="text-[10px] md:text-xs font-semibold text-foreground leading-snug">{label}</p>
        <p className="hidden md:block text-[11px] text-muted-foreground mt-0.5 leading-snug">{sub}</p>
      </div>
    </motion.div>
  )
}

function FlowConnector({ label, delay, index }: { label: string; delay: number; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      className="flex-1 flex flex-col items-center gap-1.5 min-w-0"
      style={{ marginBottom: "3.5rem" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: delay }}
    >
      {/* Label above */}
      <span className="text-[10px] font-medium text-muted-foreground/70 tracking-wide whitespace-nowrap">
        {label}
      </span>

      {/* Animated line track */}
      <div className="relative w-full flex items-center overflow-hidden" style={{ height: 16 }}>
        {/* Dashed static line */}
        <div
          className="w-full"
          style={{
            height: 1,
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--color-border) 0, var(--color-border) 5px, transparent 5px, transparent 11px)",
          }}
        />

        {/* Arrow tip */}
        <svg
          className="absolute right-0 shrink-0"
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
        >
          <path d="M1 1l6 3-6 3" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Traveling dot 1 */}
        {inView && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_var(--color-primary)]"
            style={{
              animation: `travelDot 1.8s linear infinite ${delay}s`,
            }}
          />
        )}
        {/* Traveling dot 2 */}
        {inView && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/60"
            style={{
              animation: `travelDot 1.8s linear infinite ${delay + 0.9}s`,
            }}
          />
        )}
      </div>
    </motion.div>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <style>{`
        @keyframes travelDot {
          0%   { left: -8px; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: calc(100% + 8px); opacity: 0; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            How it works
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Up and running in 24 hours
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            No complicated setup. No technical knowledge required. We handle everything.
          </motion.p>
        </div>

        {/* 3-step cards */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[calc(16.667%+1rem)] right-[calc(16.667%+1rem)] h-px bg-border" />

          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              className="relative flex flex-col items-center text-center gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/15 border border-primary/30 shadow-md shadow-primary/10 flex items-center justify-center">
                <Icon size={28} className="text-primary" />
                <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Technical flow diagram ── */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10">
            Under the hood — simplified
          </p>

          {/* Desktop flow */}
          <div className="hidden md:flex items-end gap-0 w-full overflow-hidden">
            {FLOW_NODES.map((node, i) => (
              <>
                <FlowNode key={node.label} {...node} index={i} />
                {i < FLOW_NODES.length - 1 && (
                  <FlowConnector
                    key={`conn-${i}`}
                    label={CONNECTOR_LABELS[i]}
                    delay={i * 0.15}
                    index={i}
                  />
                )}
              </>
            ))}
          </div>

          {/* Mobile flow — vertical */}
          <div className="flex md:hidden flex-col items-center gap-0">
            {FLOW_NODES.map((node, i) => (
              <div key={node.label} className="flex flex-col items-center">
                <FlowNode {...node} index={i} />
                {i < FLOW_NODES.length - 1 && (
                  <div className="flex flex-col items-center gap-1 my-1">
                    <span className="text-[10px] text-muted-foreground/70">{CONNECTOR_LABELS[i]}</span>
                    <div className="relative flex flex-col items-center overflow-hidden" style={{ height: 32, width: 16 }}>
                      <div className="w-px flex-1 bg-border" />
                      <div
                        className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary"
                        style={{ animation: `travelDotV 1.8s linear infinite ${i * 0.15}s` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
