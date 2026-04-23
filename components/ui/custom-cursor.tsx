"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

const INTERACTIVE = "a,button,[role='button'],label,input,select,textarea,[data-cursor-hover]"

export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const ringX = useSpring(mouseX, { stiffness: 200, damping: 25, mass: 0.5 })
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 25, mass: 0.5 })

  useEffect(() => {
    // Touch / coarse-pointer devices keep their native cursor
    if (window.matchMedia("(pointer: coarse)").matches) return
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    document.documentElement.classList.add("custom-cursor")

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)
    }

    const onOver = (e: MouseEvent) => {
      setHovering(!!(e.target as HTMLElement).closest(INTERACTIVE))
    }

    document.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseover", onOver)
    document.addEventListener("mouseleave", () => setVisible(false))
    document.addEventListener("mouseenter", () => setVisible(true))

    return () => {
      document.documentElement.classList.remove("custom-cursor")
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* Dot — snaps directly to cursor */}
      <motion.div
        aria-hidden
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999, x: mouseX, y: mouseY }}
      >
        <div
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            width: hovering ? 0 : 7,
            height: hovering ? 0 : 7,
            borderRadius: "50%",
            backgroundColor: "var(--primary)",
            opacity: visible ? 1 : 0,
            transition: "width 0.15s ease, height 0.15s ease, opacity 0.2s ease",
          }}
        />
      </motion.div>

      {/* Ring — follows with spring lag, expands on hover */}
      <motion.div
        aria-hidden
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999, x: ringX, y: ringY }}
      >
        <div
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            width: hovering ? 44 : 30,
            height: hovering ? 44 : 30,
            borderRadius: "50%",
            border: "1.5px solid",
            borderColor: "color-mix(in srgb, var(--primary) 65%, transparent)",
            backgroundColor: hovering ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "transparent",
            opacity: visible ? 0.85 : 0,
            transition: [
              "width 0.22s cubic-bezier(0.22,1,0.36,1)",
              "height 0.22s cubic-bezier(0.22,1,0.36,1)",
              "background-color 0.22s ease",
              "opacity 0.2s ease",
            ].join(", "),
          }}
        />
      </motion.div>
    </>
  )
}
