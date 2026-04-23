"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export function MobileCTA() {
  const [show, setShow] = useState(false)
  const [atCTA, setAtCTA] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 420)
      const ctaEl = document.getElementById("get-started")
      if (ctaEl) {
        setAtCTA(ctaEl.getBoundingClientRect().top < window.innerHeight * 0.8)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && !atCTA && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 38 }}
          // md:hidden keeps this strictly mobile — desktop has its own StickyCTA
          className="fixed bottom-0 inset-x-0 md:hidden z-50 bg-background/95 backdrop-blur-md border-t border-border"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">Your AI agent is ready</p>
              <p className="text-xs text-muted-foreground mt-0.5">Live in under 24 hours · No credit card</p>
            </div>
            <a
              href="#get-started"
              data-ripple
              className="shimmer-btn shrink-0 flex items-center gap-1.5 bg-primary text-white font-semibold rounded-full px-4 py-2.5 text-sm shadow-lg shadow-primary/30"
            >
              <Sparkles size={13} className="shrink-0" />
              Get started
              <ArrowRight size={13} className="shrink-0" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
