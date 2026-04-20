"use client"

import { useRef, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
  scale?: number
  glare?: boolean
}

export function TiltCard({
  children,
  className,
  maxTilt = 10,
  scale = 1.02,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const isTouchRef = useRef(false)

  useEffect(() => {
    isTouchRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchRef.current) return
      const card = cardRef.current
      if (!card) return

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)

      rafRef.current = requestAnimationFrame(() => {
        if (!card) return
        const rect = card.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) / (rect.width / 2)
        const dy = (e.clientY - cy) / (rect.height / 2)
        const rotX = -dy * maxTilt
        const rotY = dx * maxTilt

        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale},${scale},${scale})`
        card.style.transition = "transform 0.08s linear"

        if (glare && glareRef.current) {
          const glareX = ((e.clientX - rect.left) / rect.width) * 100
          const glareY = ((e.clientY - rect.top) / rect.height) * 100
          glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
          glareRef.current.style.opacity = "1"
        }
      })
    },
    [maxTilt, scale, glare]
  )

  const handleMouseLeave = useCallback(() => {
    if (isTouchRef.current) return
    const card = cardRef.current
    if (!card) return
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    card.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)"
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`
    if (glare && glareRef.current) {
      glareRef.current.style.opacity = "0"
    }
  }, [glare])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative", className)}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300"
          style={{ zIndex: 2 }}
        />
      )}
    </div>
  )
}
