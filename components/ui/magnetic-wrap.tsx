"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface MagneticWrapProps {
  children: React.ReactNode
  className?: string
  /** How strongly the element follows the cursor. 0.32 = strong (hero), 0.18 = subtle (nav). */
  pull?: number
  /** Spring stiffness (default 350) */
  stiffness?: number
  /** Spring damping (default 28) */
  damping?: number
}

export function MagneticWrap({
  children,
  className,
  pull = 0.32,
  stiffness = 350,
  damping = 28,
}: MagneticWrapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness, damping })
  const sy = useSpring(y, { stiffness, damping })

  useEffect(() => {
    const update = () => { rectRef.current = ref.current?.getBoundingClientRect() ?? null }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const onMove = (e: React.MouseEvent) => {
    const rect = rectRef.current
    if (!rect) return
    x.set((e.clientX - (rect.left + rect.width  / 2)) * pull)
    y.set((e.clientY - (rect.top  + rect.height / 2)) * pull)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}
