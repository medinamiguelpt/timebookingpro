"use client"

import { useRef, useEffect, useState } from "react"
import { motion, animate, useScroll, useTransform } from "framer-motion"
import { ArrowRight, CheckCircle, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { openDemoModal } from "@/components/ui/demo-modal"
import { Particles } from "@/components/ui/particles"
import { TiltCard } from "@/components/ui/tilt-card"

function LiveWaveform() {
  const bars = [0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.45]
  return (
    <span className="inline-flex items-center gap-[2px] h-3 ml-1">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-green-500 block"
          style={{ height: "100%" }}
          animate={{ scaleY: [h, 1, h * 0.5, 0.9, h] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        />
      ))}
    </span>
  )
}

function LiveStat({ initialValue, delay = 0.6, incrementMin = 1, incrementMax = 3, intervalMs = 5000 }: {
  initialValue: number
  delay?: number
  incrementMin?: number
  incrementMax?: number
  intervalMs?: number
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const currentRef = useRef(initialValue)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mountTimer = setTimeout(() => {
      const controls = animate(0, initialValue, {
        duration: 1.6,
        ease: [0.22, 1, 0.36, 1],
        onUpdate(v) { el.textContent = String(Math.round(v)) },
      })

      const ticker = setInterval(() => {
        const increment = Math.floor(Math.random() * (incrementMax - incrementMin + 1)) + incrementMin
        const prev = currentRef.current
        currentRef.current = prev + increment
        animate(prev, currentRef.current, {
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          onUpdate(v) { if (el) el.textContent = String(Math.round(v)) },
        })
      }, intervalMs)

      return () => { controls.stop(); clearInterval(ticker) }
    }, delay * 1000)

    return () => clearTimeout(mountTimer)
  }, [initialValue, delay, incrementMin, incrementMax, intervalMs])

  return <p ref={ref} className="text-2xl font-bold font-heading text-primary">0</p>
}

function LiveRevenue({ initialValue, delay = 0.8, intervalMs = 7000 }: {
  initialValue: number
  delay?: number
  intervalMs?: number
}) {
  const displayRef = useRef<HTMLParagraphElement>(null)
  const currentRef = useRef(initialValue)

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      const ticker = setInterval(() => {
        const increment = Math.floor(Math.random() * 60) + 30
        const prev = currentRef.current
        currentRef.current = prev + increment
        const el = displayRef.current
        if (!el) return
        animate(prev, currentRef.current, {
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
          onUpdate(v) { if (el) el.textContent = "$" + Math.round(v).toLocaleString() },
        })
      }, intervalMs)
      return () => clearInterval(ticker)
    }, delay * 1000)

    return () => clearTimeout(mountTimer)
  }, [delay, intervalMs])

  return (
    <p ref={displayRef} className="text-xl font-bold font-heading text-gold">
      ${initialValue.toLocaleString()}
    </p>
  )
}

function HeroMockup() {
  return (
    <motion.div
      className="relative mx-auto max-w-sm lg:max-w-none"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    >
      <div className="absolute -inset-3 rounded-3xl ring-1 ring-primary/15 -z-10" />
      <div className="absolute inset-0 -z-20 rounded-3xl bg-primary/20 blur-3xl scale-90" />

      <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-sm shadow-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-foreground">Max is live</span>
            <LiveWaveform />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            <Phone size={11} />
            Active call
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-foreground max-w-[85%]">
            Hi! I&apos;d like to book a haircut for tomorrow afternoon.
          </div>
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm ml-auto max-w-[85%]">
            Of course! I have 2 PM and 4 PM free tomorrow. Which works best for you?
          </div>
          <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-foreground max-w-[85%]">
            2 PM is perfect, thank you!
          </div>
        </div>

        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
          <CheckCircle size={15} className="text-green-500 shrink-0" />
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Booking confirmed — tomorrow at 2:00 PM
          </span>
        </div>
      </div>

      <motion.div
        className="absolute -top-4 -right-4 lg:-right-8 bg-card border border-border rounded-xl shadow-lg px-4 py-2.5 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
      >
        <p className="text-[11px] text-muted-foreground">Calls handled today</p>
        <LiveStat initialValue={47} delay={0.8} incrementMin={1} incrementMax={3} intervalMs={5000} />
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -left-4 lg:-left-8 bg-card border border-border rounded-xl shadow-lg px-4 py-2.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <p className="text-[11px] text-muted-foreground">Revenue booked</p>
        <LiveRevenue initialValue={1240} delay={1.2} intervalMs={7000} />
      </motion.div>
    </motion.div>
  )
}

const HEADLINES = {
  a: {
    main: (
      <>
        Give your business{" "}
        <span className="text-shimmer">
          its own AI agent
        </span>
      </>
    ),
    cta: "Get your agent",
  },
  b: {
    main: (
      <>
        Stop losing bookings{" "}
        <span className="text-shimmer">
          while you sleep
        </span>
      </>
    ),
    cta: "Start free trial",
  },
}

export function Hero({ variant = "a" }: { variant?: "a" | "b" }) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const glowY = useTransform(scrollY, [0, 600], [0, 120])
  const glowOpacity = useTransform(scrollY, [0, 400], [1, 0])

  const headline = HEADLINES[variant] ?? HEADLINES.a

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Mesh gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="mesh-blob-1 absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/15 blur-[100px]" />
        <div className="mesh-blob-2 absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px]" />
        <div className="mesh-blob-3 absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-violet-500/8 blur-[80px]" />
      </div>
      {/* Particles */}
      <Particles className="-z-10" color="147,51,234" connectionDistance={90} speed={0.25} />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] -z-10 rounded-full bg-primary/8 blur-[140px]"
        style={{ y: glowY, opacity: glowOpacity }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20 sm:pt-36 sm:pb-28 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Copy */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/5 text-primary font-medium px-4 py-1.5 rounded-full text-sm w-fit"
              >
                ✦ AI-powered booking agents
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold leading-[1.1] tracking-tight text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {headline.main}
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              CalBliss creates a custom voice AI that answers calls, handles
              bookings, and fills your calendar — automatically, 24 hours a day.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                size="lg"
                render={<a href="#get-started" onClick={() => {
                  if (typeof window !== "undefined" && (window as Window & { plausible?: (e: string, o?: object) => void }).plausible) {
                    (window as Window & { plausible?: (e: string, o?: object) => void }).plausible?.("hero-cta-click", { props: { variant } })
                  }
                }} />}
                nativeButton={false}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-7 h-12 text-base shadow-lg shadow-primary/25"
              >
                {headline.cta}
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                onClick={() => {
                  if (typeof window !== "undefined" && (window as Window & { plausible?: (e: string, o?: object) => void }).plausible) {
                    (window as Window & { plausible?: (e: string, o?: object) => void }).plausible?.("hero-demo-click", { props: { variant } })
                  }
                  openDemoModal()
                }}
                className="rounded-full px-7 h-12 text-base border-border hover:bg-muted"
              >
                <Calendar size={16} className="mr-2" />
                Book a demo
              </Button>
            </motion.div>

            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              No credit card required · Live in under 24 hours
            </motion.p>
          </div>

          {/* Right — Mockup */}
          <motion.div
            className="lg:pl-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <TiltCard maxTilt={8} scale={1.015}>
              <HeroMockup />
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
