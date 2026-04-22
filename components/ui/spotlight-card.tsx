"use client"

import { useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function SpotlightCard({ children, className, style }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const updateSpot = useCallback((clientX: number, clientY: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--x", `${((clientX - rect.left) / rect.width) * 100}%`)
    el.style.setProperty("--y", `${((clientY - rect.top) / rect.height) * 100}%`)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    updateSpot(e.clientX, e.clientY)
  }, [updateSpot])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    updateSpot(e.touches[0].clientX, e.touches[0].clientY)
  }, [updateSpot])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={cn("spotlight-card", className)}
      style={style}
    >
      {children}
    </div>
  )
}
