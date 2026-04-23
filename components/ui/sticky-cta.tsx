"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export function StickyCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-4 sm:mx-6 lg:mx-auto lg:max-w-5xl mb-6 rounded-2xl overflow-hidden"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-r from-primary/60 via-violet-400/60 to-primary/60 animate-shimmer bg-[length:200%_100%]" aria-hidden />

      {/* Background */}
      <div className="relative rounded-[calc(1rem-1px)] bg-gradient-to-br from-[#0D0714] via-[#130921] to-[#0D0714] px-6 sm:px-10 py-7 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Purple glow blob */}
        <div className="absolute left-0 top-0 w-64 h-full rounded-2xl bg-primary/10 blur-3xl pointer-events-none" aria-hidden />
        <div className="absolute right-0 bottom-0 w-48 h-full rounded-2xl bg-violet-500/8 blur-3xl pointer-events-none" aria-hidden />

        {/* Left: copy */}
        <div className="relative text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Agents available now</span>
          </div>
          <p className="text-white font-heading font-extrabold text-xl sm:text-2xl leading-tight tracking-tight">
            Stop losing bookings to voicemail.
          </p>
          <p className="text-white/50 text-sm mt-1">Live in under 24 hours. No credit card required.</p>
        </div>

        {/* Right: CTA button */}
        <motion.a
          href="#get-started"
          data-ripple
          className="relative shrink-0 group flex items-center gap-2.5 bg-primary text-white font-semibold rounded-full px-7 py-3.5 text-sm overflow-hidden shadow-xl shadow-primary/40"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          {/* Shimmer sweep */}
          <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden />

          <Sparkles size={15} className="shrink-0" />
          Get your agent
          <ArrowRight size={15} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
        </motion.a>
      </div>
    </motion.div>
  )
}
