"use client"

import { useRef, useEffect, useMemo, useState } from "react"
import { motion, animate, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useInView } from "framer-motion"
import { useTranslations } from "next-intl"
// useMotionValue + useSpring kept for hero blob parallax
import { CheckCircle, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Particles } from "@/components/ui/particles"
import { TiltCard } from "@/components/ui/tilt-card"

function TypewriterText() {
  const t = useTranslations("hero")
  const fullText = t("typewriter")
  const [displayed, setDisplayed] = useState("")
  // Caret persists for 2s after typing finishes — terminal "waiting for input" feel
  const [showCaret, setShowCaret] = useState(true)

  useEffect(() => {
    let i = 0
    let fadeTimer: ReturnType<typeof setTimeout>
    const id = setInterval(() => {
      i++
      setDisplayed(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(id)
        fadeTimer = setTimeout(() => setShowCaret(false), 2000)
      }
    }, 18)
    return () => { clearInterval(id); clearTimeout(fadeTimer) }
  }, [fullText])

  return (
    <span>
      {displayed}
      {showCaret && <span className="inline-block w-0.5 h-4 bg-primary/70 ms-0.5 animate-pulse align-middle" />}
    </span>
  )
}

function LiveWaveform() {
  const bars = [0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.45]
  return (
    <span className="inline-flex items-center gap-[2px] h-3 ms-1">
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

function LiveStat({ initialValue, delay = 0.6, incrementMin = 1, incrementMax = 3, intervalMs = 5000, inView = true }: {
  initialValue: number
  delay?: number
  incrementMin?: number
  incrementMax?: number
  intervalMs?: number
  inView?: boolean
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const currentRef = useRef(initialValue)
  // Two-phase: skeleton → number. Split into two effects so ref is mounted before count-up reads it.
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!inView || started) return
    setStarted(true)
  }, [inView, started])

  useEffect(() => {
    if (!started) return
    const el = ref.current
    if (!el) return
    let ticker: ReturnType<typeof setInterval>
    let controls: ReturnType<typeof animate>
    const mountTimer = setTimeout(() => {
      controls = animate(0, initialValue, {
        duration: 1.6, ease: [0.22, 1, 0.36, 1],
        onUpdate(v) { el.textContent = String(Math.round(v)) },
      })
      ticker = setInterval(() => {
        const increment = Math.floor(Math.random() * (incrementMax - incrementMin + 1)) + incrementMin
        const prev = currentRef.current
        currentRef.current = prev + increment
        animate(prev, currentRef.current, {
          duration: 0.8, ease: [0.22, 1, 0.36, 1],
          onUpdate(v) { if (el) el.textContent = String(Math.round(v)) },
        })
      }, intervalMs)
    }, delay * 1000)
    return () => { clearTimeout(mountTimer); controls?.stop(); clearInterval(ticker) }
  }, [started, initialValue, delay, incrementMin, incrementMax, intervalMs])

  if (!started) return <div className="h-7 w-10 rounded-md bg-primary/20 animate-pulse" aria-hidden />
  return <p ref={ref} className="text-2xl font-bold font-heading text-primary">0</p>
}

function LiveRevenue({ initialValue, delay = 0.8, intervalMs = 7000, inView = true }: {
  initialValue: number
  delay?: number
  intervalMs?: number
  inView?: boolean
}) {
  const displayRef = useRef<HTMLParagraphElement>(null)
  const currentRef = useRef(initialValue)
  const [started, setStarted] = useState(false)
  const [delta, setDelta] = useState<{ amount: string; id: number } | null>(null)

  useEffect(() => {
    if (!inView || started) return
    setStarted(true)
  }, [inView, started])

  useEffect(() => {
    if (!started) return
    let ticker: ReturnType<typeof setInterval>
    const mountTimer = setTimeout(() => {
      ticker = setInterval(() => {
        const increment = Math.floor(Math.random() * 60) + 30
        const prev = currentRef.current
        currentRef.current = prev + increment
        const el = displayRef.current
        if (!el) return
        // Flash a +€X delta badge above the number
        setDelta({ amount: `+€${increment}`, id: Date.now() })
        setTimeout(() => setDelta(null), 1200)
        animate(prev, currentRef.current, {
          duration: 0.9, ease: [0.22, 1, 0.36, 1],
          onUpdate(v) { if (el) el.textContent = "€" + Math.round(v).toLocaleString("en-US") },
        })
      }, intervalMs)
    }, delay * 1000)
    return () => { clearTimeout(mountTimer); clearInterval(ticker) }
  }, [started, delay, intervalMs])

  if (!started) return <div className="h-6 w-20 rounded-md bg-gold/20 animate-pulse" aria-hidden />
  return (
    <div className="relative">
      <AnimatePresence>
        {delta && (
          // Float the delta ABOVE the whole badge so it doesn't collide with
          // the "Revenue booked" label. It rises up and fades out into empty
          // space above the mockup card — classic stock-ticker feel.
          <motion.span
            key={delta.id}
            className="absolute -top-12 end-0 text-[11px] font-bold text-gold pointer-events-none whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {delta.amount}
          </motion.span>
        )}
      </AnimatePresence>
      <p ref={displayRef} className="text-xl font-bold font-heading text-gold">
        €{initialValue.toLocaleString("en-US")}
      </p>
    </div>
  )
}

function CallTimer({ inView }: { inView: boolean }) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [inView])
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
  const ss = String(seconds % 60).padStart(2, "0")
  return <span className="tabular-nums">{mm}:{ss}</span>
}

// iMessage-style "typing" dots — 3 dots bouncing in sequence
function TypingDots({ dark = false }: { dark?: boolean }) {
  const color = dark ? "bg-white/70" : "bg-muted-foreground/50"
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.span
          key={i}
          className={`block w-1.5 h-1.5 rounded-full ${color}`}
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay }}
        />
      ))}
    </span>
  )
}

// User/agent ordering is fixed (left/right/left); only the texts come from translations.
const BUBBLE_SIDES = ["left", "right", "left"] as const

// Each bubble shows typing dots first, then the message — staggered like a real conversation
function ChatSequence({ inView }: { inView: boolean }) {
  const tHero = useTranslations("hero")
  const bubbleTexts = tHero.raw("chat.bubbles") as string[]
  const bubbles = BUBBLE_SIDES.map((side, i) => ({ side, text: bubbleTexts[i] }))

  const [stage, setStage] = useState(-1) // -1 = not started, 0/2/4 = typing, 1/3/5 = bubble shown
  useEffect(() => {
    if (!inView) return
    const timers: ReturnType<typeof setTimeout>[] = []
    let t = 600
    bubbles.forEach((_, i) => {
      timers.push(setTimeout(() => setStage(i * 2), t))     // show typing dots
      t += 500 + i * 100
      timers.push(setTimeout(() => setStage(i * 2 + 1), t)) // replace with bubble
      t += 900
    })
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <div className="space-y-2.5 min-h-[140px]">
      {bubbles.map(({ side, text }, i) => {
        const typingStage = i * 2
        const bubbleStage = i * 2 + 1
        const showTyping = stage === typingStage
        const showBubble = stage >= bubbleStage
        if (!showTyping && !showBubble) return null

        const isLeft = side === "left"
        const base   = "rounded-2xl px-3.5 py-2.5 text-sm max-w-[85%]"
        const corner = isLeft ? "rounded-ss-sm" : "rounded-se-sm ms-auto"
        const fill   = isLeft ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={`${base} ${corner} ${fill}`}
          >
            {showBubble ? text : <TypingDots dark={!isLeft} />}
          </motion.div>
        )
      })}
    </div>
  )
}

function HeroMockup() {
  const t = useTranslations("hero.mockup")
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={containerRef}
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
            <span className="text-sm font-semibold text-foreground">{t("agentLive")}</span>
            <LiveWaveform />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            <Phone size={11} />
            <CallTimer inView={inView} />
          </div>
        </div>

        <ChatSequence inView={inView} />

        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">
          <CheckCircle size={15} className="text-green-500 shrink-0" />
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {t("bookingConfirmed")}
          </span>
        </div>
      </div>

      <motion.div
        className="absolute -top-4 -end-4 lg:-end-8 bg-card border border-border rounded-xl shadow-lg px-4 py-2.5 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
      >
        <p className="text-[11px] text-muted-foreground">{t("callsHandledLabel")}</p>
        <LiveStat initialValue={47} delay={0.8} incrementMin={1} incrementMax={3} intervalMs={5000} inView={inView} />
      </motion.div>

      <motion.div
        // Moved to bottom-right so it doesn't cover the "Booking confirmed" banner
        className="absolute -bottom-4 -end-4 lg:-end-8 bg-card border border-border rounded-xl shadow-lg px-4 py-2.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <p className="text-[11px] text-muted-foreground">{t("revenueBookedLabel")}</p>
        <LiveRevenue initialValue={1240} delay={1.2} intervalMs={7000} inView={inView} />
      </motion.div>
    </motion.div>
  )
}

function HeadlineReveal({ plain, highlight }: { plain: string; highlight: string }) {
  const words = useMemo(() => plain.split(" "), [plain])
  return (
    // leading-[1.15] gives descenders (y, p, g, j) room to breathe without overflow clipping
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold leading-[1.15] tracking-tight text-balance">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.05 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
      <span className="inline-block text-shimmer">{highlight}</span>
    </h1>
  )
}


export function Hero({ variant = "a" }: { variant?: "a" | "b" }) {
  const t = useTranslations("hero")
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const glowY = useTransform(scrollY, [0, 600], [0, 120])
  const glowOpacity = useTransform(scrollY, [0, 400], [1, 0])

  // Scroll indicator: appears after hero animations settle, hides when user scrolls
  const [showIndicator, setShowIndicator] = useState(false)
  const [scrolledDown, setScrolledDown] = useState(false)

  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)
  const mouseX = useSpring(rawMouseX, { stiffness: 40, damping: 20 })
  const mouseY = useSpring(rawMouseY, { stiffness: 40, damping: 20 })

  const blob1X = useTransform(mouseX, [-1, 1], [-18, 18])
  const blob1Y = useTransform(mouseY, [-1, 1], [-14, 14])
  const blob2X = useTransform(mouseX, [-1, 1], [12, -12])
  const blob2Y = useTransform(mouseY, [-1, 1], [10, -10])
  const mockupX = useTransform(mouseX, [-1, 1], [-6, 6])
  const mockupY = useTransform(mouseY, [-1, 1], [-4, 4])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      rawMouseX.set(x)
      rawMouseY.set(y)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [rawMouseX, rawMouseY])

  useEffect(() => {
    // Show indicator after hero animations settle (PageIntro + hero reveals ≈ 1.8s total)
    const showTimer = setTimeout(() => setShowIndicator(true), 1800)
    // Hide permanently once user starts scrolling
    const onScroll = () => {
      if (window.scrollY > 60) setScrolledDown(true)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    // Also hide on touch swipe (touchstart fires before scroll event on mobile)
    window.addEventListener("touchstart", onScroll, { passive: true })
    return () => {
      clearTimeout(showTimer)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("touchstart", onScroll)
    }
  }, [])

  const headline = {
    plain:     t(`headlines.${variant}.plain`),
    highlight: t(`headlines.${variant}.highlight`),
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Mesh gradient blobs — hue-shift + parallax */}
      <div className="absolute inset-0 -z-10 overflow-hidden hue-shift" aria-hidden>
        <motion.div style={{ x: blob1X, y: blob1Y }} className="mesh-blob-1 absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/15 blur-[100px]" />
        <motion.div style={{ x: blob2X, y: blob2Y }} className="mesh-blob-2 absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px]" />
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
              className="w-fit"
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              // Stiff spring + low damping = slight overshoot → "pop" character
              transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.05 }}
            >
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/5 text-primary font-medium px-4 py-1.5 rounded-full text-sm w-fit"
              >
                {t("badge")}
              </Badge>
            </motion.div>

            {/* Staggered word reveal headline */}
            <HeadlineReveal plain={headline.plain} highlight={headline.highlight} />

            <motion.p
              className="text-lg text-muted-foreground leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <TypewriterText />
            </motion.p>

            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              {t("finePrint")}
            </motion.p>
          </div>

          {/* Right — Mockup with parallax + blur-in entrance */}
          <motion.div
            className="lg:ps-8"
            style={{ x: mockupX, y: mockupY }}
            initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard maxTilt={8} scale={1.015}>
              <HeroMockup />
            </TiltCard>
          </motion.div>
        </div>

        {/* Scroll indicator — fades in after animations, out on first scroll */}
        <div className="flex justify-center pt-10 pb-0">
          <AnimatePresence>
            {showIndicator && !scrolledDown && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-2 select-none"
                aria-hidden
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/45">
                  {t("scrollIndicator")}
                </span>
                {/* Mouse-wheel icon */}
                <div className="w-[18px] h-[28px] rounded-full border border-muted-foreground/25 flex items-start justify-center pt-[5px]">
                  <motion.div
                    className="w-[3px] h-[5px] rounded-full bg-muted-foreground/50"
                    animate={{ y: [0, 9, 0], opacity: [1, 0.15, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
