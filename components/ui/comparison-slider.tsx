"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { GripVertical } from "lucide-react"

interface ComparisonSliderProps {
  before: React.ReactNode
  after: React.ReactNode
  beforeLabel?: string
  afterLabel?: string
  initialPosition?: number
}

export function ComparisonSlider({
  before,
  after,
  beforeLabel = "Without",
  afterLabel = "With CalBliss",
  initialPosition = 50,
}: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(initialPosition)
  const dragging = useRef(false)

  const clamp = (v: number) => Math.max(5, Math.min(95, v))

  const updateFromClient = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    e.preventDefault()
  }, [])

  const onTouchStart = useCallback(() => {
    dragging.current = true
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      updateFromClient(e.clientX)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return
      updateFromClient(e.touches[0].clientX)
    }
    const onUp = () => { dragging.current = false }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onUp)
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", onUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onUp)
    }
  }, [updateFromClient])

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden border border-border select-none touch-none"
      style={{ cursor: "col-resize" }}
    >
      {/* After (full width, clipped by position) */}
      <div className="w-full">
        {after}
      </div>

      {/* Before (overlaid, width = position%) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {before}
      </div>

      {/* Divider line */}
      <div
        className="absolute inset-y-0 w-px bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center cursor-col-resize z-10 border border-white/80"
        style={{ left: `${position}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
      >
        <GripVertical size={16} className="text-gray-600" />
      </motion.div>

      {/* Labels */}
      <div
        className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none"
        style={{ opacity: position > 20 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {beforeLabel}
      </div>
      <div
        className="absolute top-3 right-3 bg-primary/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none"
        style={{ opacity: position < 80 ? 1 : 0, transition: "opacity 0.2s" }}
      >
        {afterLabel}
      </div>
    </div>
  )
}
