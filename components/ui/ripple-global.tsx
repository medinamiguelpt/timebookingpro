"use client"

import { useEffect } from "react"

// Global ripple handler — add data-ripple to any button/link to get a tap ripple.
// Uses pointerdown (fires for both mouse clicks and touch taps) and injects a
// CSS-animated span directly into the DOM element, then cleans it up after 700ms.
export function RippleGlobal() {
  useEffect(() => {
    const handle = (e: PointerEvent) => {
      const btn = (e.target as HTMLElement).closest("[data-ripple]") as HTMLElement | null
      if (!btn) return

      const rect = btn.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2.5
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top  - size / 2

      const el = document.createElement("span")
      el.setAttribute("aria-hidden", "true")
      el.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        background:rgba(255,255,255,0.22);
        width:${size}px; height:${size}px; left:${x}px; top:${y}px;
        animation:ripple 0.65s cubic-bezier(0.22,1,0.36,1) forwards;
      `
      btn.appendChild(el)
      setTimeout(() => el.remove(), 700)
    }

    document.addEventListener("pointerdown", handle)
    return () => document.removeEventListener("pointerdown", handle)
  }, [])

  return null
}
