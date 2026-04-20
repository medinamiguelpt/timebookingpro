"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

interface ParticlesProps {
  className?: string
  count?: number
  color?: string
  maxRadius?: number
  speed?: number
  connected?: boolean
  connectionDistance?: number
}

export function Particles({
  className = "",
  count,
  color = "147,51,234",
  maxRadius = 2,
  speed = 0.4,
  connected = true,
  connectionDistance = 120,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const reducedMotion = useRef(false)

  const initParticles = useCallback((width: number, height: number, n: number) => {
    const arr: Particle[] = []
    for (let i = 0; i < n; i++) {
      arr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: Math.random() * maxRadius + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }
    return arr
  }, [speed, maxRadius])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reducedMotion.current) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const getCount = () => {
      const w = window.innerWidth
      if (count !== undefined) return count
      if (w < 640) return 20
      if (w < 1024) return 35
      return 55
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.offsetWidth
      canvas.height = parent.offsetHeight
      particlesRef.current = initParticles(canvas.width, canvas.height, getCount())
    }

    resize()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const draw = () => {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const pts = particlesRef.current
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},${p.opacity})`
        ctx.fill()

        if (connected) {
          for (let j = i + 1; j < pts.length; j++) {
            const q = pts[j]
            const dist = Math.hypot(p.x - q.x, p.y - q.y)
            if (dist < connectionDistance) {
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(q.x, q.y)
              ctx.strokeStyle = `rgba(${color},${0.08 * (1 - dist / connectionDistance)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [color, connected, connectionDistance, count, initParticles])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden
    />
  )
}
