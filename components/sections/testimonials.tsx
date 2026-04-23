"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { RevealWords } from "@/components/ui/reveal-words"
import { Star, ChevronLeft, ChevronRight, Play, X } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Carlos M.",
    role: "Owner · The Barber Studio",
    quote:
      "I used to lose 3–4 bookings every weekend. Now my calendar fills itself. TimeBookingPro paid for itself in the first week.",
    stars: 5,
    initials: "CM",
    color: "from-violet-500/15 to-purple-500/5",
    accent: "#7C3AED",
    hasVideo: true,
    videoLabel: "Watch Carlos's story",
  },
  {
    name: "Sophie L.",
    role: "Owner · Bloom Beauty Salon",
    quote:
      "My customers love that someone always answers, even at midnight. The agent sounds completely natural — no one realises it's AI.",
    stars: 5,
    initials: "SL",
    color: "from-pink-500/15 to-rose-500/5",
    accent: "#EC4899",
    hasVideo: true,
    videoLabel: "Watch Sophie's story",
  },
  {
    name: "Jordan A.",
    role: "Manager · Apex Barbershop",
    quote:
      "Setup was done in a day and the team was incredibly helpful. It just works. I wish I'd done this sooner.",
    stars: 5,
    initials: "JA",
    color: "from-blue-500/15 to-cyan-500/5",
    accent: "#3B82F6",
    hasVideo: false,
    videoLabel: "",
  },
  {
    name: "Maria R.",
    role: "Owner · Glow Aesthetics",
    quote:
      "We went from 60% call answer rate to 100% overnight. The agent books, confirms, and even handles reschedules. It's like hiring a full-time receptionist for a fraction of the cost.",
    stars: 5,
    initials: "MR",
    color: "from-emerald-500/15 to-teal-500/5",
    accent: "#10B981",
    hasVideo: false,
    videoLabel: "",
  },
  {
    name: "Tyler K.",
    role: "Owner · FadeKing Barbershop",
    quote:
      "I was sceptical about AI but honestly the voice is incredible. Three clients asked who my new receptionist was.",
    stars: 5,
    initials: "TK",
    color: "from-amber-500/15 to-orange-500/5",
    accent: "#F59E0B",
    hasVideo: false,
    videoLabel: "",
  },
  {
    name: "Priya S.",
    role: "Manager · Velvet Touch Spa",
    quote:
      "Revenue is up 22% since we started. That's real money. Clients book at 2am now — bookings we'd have completely missed before.",
    stars: 5,
    initials: "PS",
    color: "from-indigo-500/15 to-violet-500/5",
    accent: "#6366F1",
    hasVideo: false,
    videoLabel: "",
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-gold text-gold" />
      ))}
    </div>
  )
}

function VideoModal({ name, onClose }: { name: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Play size={28} className="text-primary ml-1" />
            </div>
            <div className="text-center px-6">
              <p className="font-heading font-bold text-foreground">{name}&apos;s story</p>
              <p className="text-sm text-muted-foreground mt-1">Video coming soon — we&apos;re recording customer stories this month.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function TestimonialCard({
  name, role, quote, stars, initials, color, hasVideo, videoLabel, onPlayVideo, position, reducedMotion,
}: typeof TESTIMONIALS[0] & { onPlayVideo: () => void; position: "center" | "left" | "right" | "hidden"; reducedMotion: boolean | null }) {
  const isCenter = position === "center"
  const isHidden = position === "hidden"

  // Full 3D coverflow when motion is OK; simple opacity/scale crossfade when reduced
  const rotateY    = reducedMotion ? 0           : position === "left" ? -28 : position === "right" ? 28 : 0
  const scale      = reducedMotion ? (isCenter ? 1 : 0.94)  : isCenter ? 1 : 0.82
  const opacity    = isHidden ? 0 : isCenter ? 1 : reducedMotion ? 0.45 : 0.55
  const z          = isCenter ? 10 : 0
  const translateX = reducedMotion ? "0%" : position === "left" ? "-14%" : position === "right" ? "14%" : "0%"

  // Subtle content parallax on mouse hover — desktop/center card only
  // Touch events don't fire onMouseMove so this is naturally mobile-safe
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 150, damping: 20 })
  const sy = useSpring(my, { stiffness: 150, damping: 20 })

  useEffect(() => {
    if (!isCenter) { mx.set(0); my.set(0) }
  }, [isCenter, mx, my])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCenter) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 10)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 8)
  }

  return (
    <motion.div
      animate={{ rotateY, scale, opacity, translateX, zIndex: z }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      className={`absolute top-0 w-full max-w-sm ${isCenter ? "cursor-default" : "cursor-pointer"}`}
    >
      <div
        className={`group relative rounded-2xl border border-border bg-card flex flex-col gap-4 h-full overflow-hidden ${isCenter ? "shadow-2xl shadow-black/10" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mx.set(0); my.set(0) }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none`} />
        <motion.div
          style={{ x: sx, y: sy }}
          className="relative p-6 flex flex-col gap-4 h-full min-h-[220px]"
        >
          <Stars count={stars} />
          <p className="text-sm text-foreground leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {initials}
              </div>
              {hasVideo && isCenter && (
                <motion.button
                  onClick={onPlayVideo}
                  className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  whileTap={{ scale: 0.9 }}
                  aria-label={videoLabel}
                >
                  <Play size={12} className="text-white ml-0.5" />
                </motion.button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground truncate">{role}</p>
            </div>
            {hasVideo && isCenter && (
              <button
                onClick={onPlayVideo}
                className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <Play size={11} className="ml-0.5" />
                Watch
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Mobile card with tap-to-expand long quotes
function MobileTestimonialCard({
  testimonial, onPlayVideo,
}: { testimonial: typeof TESTIMONIALS[0]; onPlayVideo: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const t = testimonial
  // Long quotes benefit from expansion; short ones (~70 chars) won't need it
  const isLong = t.quote.length > 100

  return (
    <div className="group relative rounded-2xl border border-border bg-card flex flex-col gap-4 overflow-hidden shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-40 pointer-events-none`} />
      <div className="relative p-6 flex flex-col gap-4">
        <Stars count={t.stars} />
        <div>
          <motion.p
            className="text-sm text-foreground leading-relaxed overflow-hidden"
            animate={{ maxHeight: expanded ? 400 : 88 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            &ldquo;{t.quote}&rdquo;
          </motion.p>
          {isLong && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="mt-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {t.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
          </div>
          {t.hasVideo && (
            <button
              onClick={onPlayVideo}
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-primary"
            >
              <Play size={11} className="ml-0.5" />
              Watch
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function getPosition(cardIndex: number, activeIndex: number, total: number): "center" | "left" | "right" | "hidden" {
  const diff = ((cardIndex - activeIndex) % total + total) % total
  if (diff === 0) return "center"
  if (diff === 1) return "right"
  if (diff === total - 1) return "left"
  return "hidden"
}

export function Testimonials() {
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [videoFor, setVideoFor] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dragStartX = useRef(0)
  const total = TESTIMONIALS.length

  const next = useCallback(() => setActive((p) => (p + 1) % total), [total])
  const prev = useCallback(() => setActive((p) => (p - 1 + total) % total), [total])

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(next, 4500)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [paused, next])

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX
  }

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX
    const diff = dragStartX.current - endX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
  }

  return (
    <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 bg-muted/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Testimonials
          </motion.p>
          <RevealWords
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            delay={0.1}
          >
            Real businesses, real results
          </RevealWords>
        </div>

        {/* 3D Coverflow — desktop */}
        <div
          className="hidden md:block"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <div
            className="relative mx-auto flex items-center justify-center"
            // Remove 3D perspective when user prefers reduced motion
            style={reducedMotion ? { height: 380 } : { perspective: "1200px", height: 380 }}
          >
            {TESTIMONIALS.map((t, i) => {
              const pos = getPosition(i, active, total)
              return (
                <TestimonialCard
                  key={t.name}
                  {...t}
                  position={pos}
                  reducedMotion={reducedMotion}
                  onPlayVideo={() => setVideoFor(t.name)}
                />
              )
            })}
          </div>
        </div>

        {/* Mobile: single card swipe with tap-to-expand quote */}
        <div
          className="md:hidden"
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: reducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reducedMotion ? 0 : -20 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.3 }}
            >
              <MobileTestimonialCard
                testimonial={TESTIMONIALS[active]}
                onPlayVideo={() => setVideoFor(TESTIMONIALS[active].name)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="p-3 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-1">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="p-2 flex items-center justify-center"
              >
                <span className={`block rounded-full transition-all duration-300 ${
                  i === active ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-primary/40"
                }`} />
              </button>
            ))}
          </div>
          <button
            onClick={next}
            className="p-3 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {videoFor && <VideoModal name={videoFor} onClose={() => setVideoFor(null)} />}
    </section>
  )
}
