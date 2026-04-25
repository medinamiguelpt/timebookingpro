"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const t = useTranslations("scrollToTop")
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setShow(total > 0 && window.scrollY / total > 0.35)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.75 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={t("ariaLabel")}
          // Stacked above section-sound (bottom-20) and mobile-cta (bottom-0 on mobile)
          className="fixed bottom-32 end-4 sm:end-6 z-40 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-background/85 backdrop-blur-sm border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
        >
          <ArrowUp size={14} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
