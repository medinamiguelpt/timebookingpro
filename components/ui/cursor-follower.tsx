"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CursorFollower() {
  const [visible, setVisible] = useState(false)
  const isTouch = useRef(false)

  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)

  const x = useSpring(rawX, { stiffness: 100, damping: 22, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 100, damping: 22, mass: 0.5 })

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(hover: none)").matches) return

    const onMove = (e: MouseEvent) => {
      if (isTouch.current) return
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => { if (!isTouch.current) setVisible(true) }
    const onTouch = () => { isTouch.current = true; setVisible(false) }

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)
    window.addEventListener("touchstart", onTouch, { once: true })

    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
    }
  }, [visible, rawX, rawY])

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{ x, y }}
    >
      <motion.div
        className="w-10 h-10 rounded-full bg-primary/20 blur-md"
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}
