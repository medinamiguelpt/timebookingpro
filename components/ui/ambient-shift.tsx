"use client"

import { useEffect } from "react"

// Maps each key section to where the ambient glow should sit on the viewport
const SECTIONS = [
  { id: "hero",          x: "50%", y: "-10%" },
  { id: "how-it-works",  x: "75%", y: "22%"  },
  { id: "features",      x: "25%", y: "44%"  },
  { id: "pricing",       x: "65%", y: "64%"  },
  { id: "get-started",   x: "50%", y: "92%"  },
]

export function AmbientShift() {
  useEffect(() => {
    const root = document.documentElement

    // Set initial position
    root.style.setProperty("--ambient-x", "50%")
    root.style.setProperty("--ambient-y", "-10%")

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const section = SECTIONS.find((s) => s.id === entry.target.id)
          if (section) {
            root.style.setProperty("--ambient-x", section.x)
            root.style.setProperty("--ambient-y", section.y)
          }
        }
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 }
    )

    const t = setTimeout(() => {
      SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) obs.observe(el)
      })
    }, 200)

    return () => {
      obs.disconnect()
      clearTimeout(t)
    }
  }, [])

  return null
}
