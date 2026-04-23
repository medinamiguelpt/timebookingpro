"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"

const SECTION_IDS = ["how-it-works", "features", "pricing", "get-started"]

export function SectionSound() {
  const [enabled, setEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    setMounted(true)
    if (localStorage.getItem("tbp-sound") === "1") setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const play = () => {
      const ctx = ctxRef.current
      if (!ctx) return
      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === "suspended") ctx.resume().catch(() => {})
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = "sine"
      osc.frequency.setValueAtTime(660, ctx.currentTime)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.06)
    }

    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) play() }) },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    )

    const t = setTimeout(() => {
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id)
        if (el) obs.observe(el)
      })
    }, 200)

    return () => { obs.disconnect(); clearTimeout(t) }
  }, [enabled])

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev
      localStorage.setItem("tbp-sound", next ? "1" : "0")
      // AudioContext must be created inside a user gesture
      if (next && !ctxRef.current) {
        ctxRef.current = new AudioContext()
      }
      return next
    })
  }

  // Don't render during SSR to avoid hydration mismatch
  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Mute section sounds" : "Enable section sounds"}
      title={enabled ? "Mute sounds" : "Enable subtle sounds"}
      className="fixed bottom-20 right-4 sm:right-6 z-40 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
    >
      {enabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
    </button>
  )
}
