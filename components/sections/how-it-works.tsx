"use client"

import { useRef, useState, Fragment, type ElementType } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent, useInView } from "framer-motion"
import { PhoneCall, Settings2, CalendarCheck, Mic, Zap, Bell } from "lucide-react"

const STEPS = [
  {
    icon: Settings2,
    step: "01",
    title: "We set up your agent",
    body: "Tell us your business name, hours, and services. We build and train your personal AI agent in under 24 hours.",
    accent: "#7C3AED",
  },
  {
    icon: PhoneCall,
    step: "02",
    title: "It answers every call",
    body: "Your agent picks up instantly — day, night, and weekends. It speaks naturally, understands your customers, and handles any booking request.",
    accent: "#0EA5E9",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Your calendar fills up",
    body: "Bookings land directly in your calendar. You get a notification, your customer gets a confirmation. Zero effort on your part.",
    accent: "#10B981",
  },
]

const FLOW_NODES = [
  { Icon: PhoneCall,    label: "Customer calls",     sub: "Any number · Any hour" },
  { Icon: Mic,          label: "Agent answers",       sub: "Voice AI · < 1 second" },
  { Icon: Zap,          label: "Booking processed",   sub: "Intent understood" },
  { Icon: CalendarCheck,label: "Slot confirmed",      sub: "Calendar synced live" },
  { Icon: Bell,         label: "Both notified",       sub: "SMS · Email" },
]

const CONNECTOR_LABELS = ["Voice call", "Conversation", "Booking data", "Confirmation"]

const VISUAL_PANELS = [
  {
    accent: "#7C3AED",
    icon: "⚙️",
    title: "Agent configured",
    lines: ["Business name ✓", "Hours set ✓", "Services: Haircut, Shave, Beard Trim... ✓", "Voice & language selected ✓"],
  },
  {
    accent: "#0EA5E9",
    icon: "📞",
    title: "Call in progress",
    lines: ["Caller: 'Hi, I'd like a haircut + beard'", "Agent: 'Of course! I have...'", "3 PM slot available ✓", "Language detected: EN ✓"],
  },
  {
    accent: "#10B981",
    icon: "📅",
    title: "Booking confirmed",
    lines: ["Service: Haircut + Beard — €22 ✓", "Calendar: Updated ✓", "SMS sent to customer ✓", "Notification sent to you ✓"],
  },
]

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

function FlowConnector({ label, delay }: { label: string; delay: number }) {
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
      transition={{ duration: 0.3, delay }}
    >
      <span className="text-[10px] font-medium text-muted-foreground/70 tracking-wide whitespace-nowrap">
        {label}
      </span>
      <div className="relative w-full flex items-center overflow-hidden" style={{ height: 16 }}>
        <div
          className="w-full"
          style={{
            height: 1,
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--color-border) 0, var(--color-border) 5px, transparent 5px, transparent 11px)",
          }}
        />
        <svg className="absolute right-0 shrink-0" width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 1l6 3-6 3" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {inView && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_var(--color-primary)]"
            style={{ animation: `travelDot 1.8s linear infinite ${delay}s` }}
          />
        )}
        {inView && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/60"
            style={{ animation: `travelDot 1.8s linear infinite ${delay + 0.9}s` }}
          />
        )}
      </div>
    </motion.div>
  )
}

function ScrollySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.1", "end 0.9"],
  })

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.33) setActiveStep(0)
    else if (v < 0.66) setActiveStep(1)
    else setActiveStep(2)
  })

  return (
    <div ref={sectionRef} className="grid md:grid-cols-2 gap-10 md:gap-16 items-start min-h-[70vh]">
      {/* Left: steps with progress indicator */}
      <div className="sticky top-32 self-start">
        <div className="relative">
          <div className="absolute left-7 top-8 bottom-8 w-px bg-border" />
          <motion.div
            className="absolute left-7 top-8 w-px bg-primary origin-top"
            style={{ height: progressHeight, maxHeight: "calc(100% - 4rem)" }}
          />
          <div className="space-y-12">
            {STEPS.map(({ icon: Icon, step, title, body, accent }, i) => {
              const isActive = i === activeStep
              const isPast = i < activeStep
              return (
                <motion.div
                  key={title}
                  animate={{
                    opacity: isActive ? 1 : isPast ? 0.45 : 0.2,
                    scale: isActive ? 1 : 0.97,
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-5"
                >
                  <div className="relative shrink-0">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500"
                      style={{
                        background: isActive ? `${accent}20` : "var(--color-muted)",
                        border: `1px solid ${isActive ? accent + "40" : "var(--color-border)"}`,
                        boxShadow: isActive ? `0 0 24px ${accent}20` : "none",
                      }}
                    >
                      <Icon size={24} style={{ color: isActive ? accent : "var(--color-muted-foreground)" }} />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all duration-500"
                      style={{
                        background: isActive ? accent : "var(--color-border)",
                        color: isActive ? "white" : "var(--color-muted-foreground)",
                      }}
                    >
                      {step}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3
                      className="text-xl sm:text-2xl font-heading font-bold mb-2 transition-colors duration-500"
                      style={{ color: isActive ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}
                    >
                      {title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-sm">{body}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right: visual panel */}
      <div className="sticky top-32 self-start">
        <div className="relative" style={{ minHeight: 240 }}>
          {VISUAL_PANELS.map((panel, i) => (
            <motion.div
              key={i}
              animate={{ opacity: i === activeStep ? 1 : 0, y: i === activeStep ? 0 : 16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 rounded-2xl border bg-card p-6 flex flex-col gap-4 pointer-events-none"
              style={{ borderColor: `${panel.accent}30` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${panel.accent}15` }}
                >
                  {panel.icon}
                </div>
                <p className="font-heading font-bold text-base" style={{ color: panel.accent }}>
                  {panel.title}
                </p>
              </div>
              <ul className="space-y-2">
                {panel.lines.map((line, j) => (
                  <motion.li
                    key={j}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                    initial={{ opacity: 0, x: -8 }}
                    animate={i === activeStep ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                    transition={{ delay: j * 0.08, duration: 0.3 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: panel.accent }} />
                    {line}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 overflow-hidden">
      <style>{`
        @keyframes travelDot {
          0%   { left: -8px; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: calc(100% + 8px); opacity: 0; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
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

        {/* Scrollytelling — desktop */}
        <div className="hidden md:block">
          <ScrollySection />
        </div>

        {/* Mobile: simple stacked cards */}
        <div className="md:hidden grid gap-8">
          {STEPS.map(({ icon: Icon, step, title, body, accent }, i) => (
            <motion.div
              key={title}
              className="relative flex flex-col items-center text-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
              >
                <Icon size={26} style={{ color: accent }} />
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: accent }}
                >
                  {step}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical flow diagram */}
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
          <div className="hidden md:flex items-end gap-0 w-full overflow-hidden">
            {FLOW_NODES.map((node, i) => (
              <Fragment key={node.label}>
                <FlowNode {...node} index={i} />
                {i < FLOW_NODES.length - 1 && (
                  <FlowConnector label={CONNECTOR_LABELS[i]} delay={i * 0.15} />
                )}
              </Fragment>
            ))}
          </div>
          <div className="flex md:hidden flex-col items-center gap-0">
            {FLOW_NODES.map((node, i) => (
              <div key={node.label} className="flex flex-col items-center">
                <FlowNode {...node} index={i} />
                {i < FLOW_NODES.length - 1 && (
                  <div className="flex flex-col items-center gap-1 my-1">
                    <span className="text-[10px] text-muted-foreground/70">{CONNECTOR_LABELS[i]}</span>
                    <div className="relative flex flex-col items-center overflow-hidden" style={{ height: 32, width: 16 }}>
                      <div className="w-px flex-1 bg-border" />
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
