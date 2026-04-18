"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Play, X } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Carlos M.",
    role: "Owner · The Barber Studio",
    quote:
      "I used to lose 3–4 bookings every weekend. Now my calendar fills itself. CalBliss paid for itself in the first week.",
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

          {/* Video placeholder */}
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
  name, role, quote, stars, initials, color, hasVideo, videoLabel, onPlayVideo,
}: typeof TESTIMONIALS[0] & { onPlayVideo: () => void }) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card flex flex-col gap-4 h-full overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none`} />

      <div className="relative p-6 flex flex-col gap-4 h-full">
        <Stars count={stars} />
        <p className="text-sm text-foreground leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          {/* Avatar — with play button overlay on hover */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {initials}
            </div>
            {hasVideo && (
              <motion.button
                onClick={onPlayVideo}
                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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

          {hasVideo && (
            <button
              onClick={onPlayVideo}
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors opacity-0 group-hover:opacity-100"
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

export function Testimonials() {
  const [page, setPage] = useState(0)
  const [paused, setPaused] = useState(false)
  const [videoFor, setVideoFor] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalPages = TESTIMONIALS.length
  const visibleCount = 3

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!paused) setPage((p) => (p + 1) % totalPages)
    }, 4500)
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [paused])

  const prev = () => { setPage((p) => (p - 1 + totalPages) % totalPages); startTimer() }
  const next = () => { setPage((p) => (p + 1) % totalPages); startTimer() }

  const visible = Array.from({ length: visibleCount }, (_, i) =>
    TESTIMONIALS[(page + i) % totalPages]
  )

  return (
    <section className="py-24 sm:py-32 bg-muted/30 overflow-hidden">
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
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Real businesses, real results
          </motion.h2>
        </div>

        {/* Desktop carousel grid */}
        <div
          className="hidden md:grid md:grid-cols-3 gap-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {visible.map((t, i) => (
            <motion.div
              key={`${page}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
            >
              <TestimonialCard {...t} onPlayVideo={() => setVideoFor(t.name)} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <TestimonialCard
              {...TESTIMONIALS[page]}
              onPlayVideo={() => TESTIMONIALS[page].hasVideo && setVideoFor(TESTIMONIALS[page].name)}
            />
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="p-2.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i); startTimer() }}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === page ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="p-2.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Video modal */}
      {videoFor && <VideoModal name={videoFor} onClose={() => setVideoFor(null)} />}
    </section>
  )
}
