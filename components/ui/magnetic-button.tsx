"use client"

import { useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  strength?: number
  as?: "button" | "a"
  href?: string
}

export function MagneticButton({ children, className, strength = 0.3, as: Tag = "button", href, ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = (e.clientX - centerX) * strength
    const dy = (e.clientY - centerY) * strength
    el.style.transform = `translate(${dx}px, ${dy}px)`
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = "translate(0, 0)"
  }, [])

  const commonProps = {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: cn("magnetic", className),
  }

  if (Tag === "a") {
    return (
      <a {...commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>} href={href}>
        {children}
      </a>
    )
  }

  return (
    <button {...commonProps} {...props}>
      {children}
    </button>
  )
}
