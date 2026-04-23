"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function PageIntro() {
  const [show, setShow] = useState(true)
  const [fast, setFast] = useState(false)

  useEffect(() => {
    // Skip animation on repeat visits within the same session
    if (sessionStorage.getItem("tbp-intro")) {
      setFast(true)
      setShow(false)
      return
    }
    // Hold the overlay until hero animations are mostly done (~600ms), then fade
    const t = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem("tbp-intro", "1")
    }, 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9997] bg-background pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fast ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </AnimatePresence>
  )
}
