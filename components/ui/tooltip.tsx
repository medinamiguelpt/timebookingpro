"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TooltipProps {
  content: string
  children: React.ReactNode
}

/**
 * Hover/focus tooltip. Works on desktop (hover) and keyboard (focus).
 * Wraps children in an inline span so it can be embedded inside any text.
 */
export function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <span
      className="relative inline-flex cursor-help"
      tabIndex={0}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.span
            role="tooltip"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg shadow-xl whitespace-nowrap max-w-[220px] text-center pointer-events-none z-[500]"
            initial={{ opacity: 0, y: 4, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.94 }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            {content}
            {/* Down-pointing arrow */}
            <span
              className="absolute top-full left-1/2 -translate-x-1/2"
              style={{ borderWidth: "5px 5px 0", borderStyle: "solid", borderColor: "var(--foreground) transparent transparent" }}
              aria-hidden
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
