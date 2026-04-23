"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"

const FOCUSABLE = [
  "a[href]", "button:not([disabled])", "input:not([disabled])",
  "select:not([disabled])", "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ")

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const dragControls = useDragControls()
  const scrollRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    prevFocusRef.current = document.activeElement as HTMLElement

    // Move focus inside the sheet after entrance animation settles
    const focusTimer = setTimeout(() => {
      const first = sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      first?.focus()
    }, 120)

    // Focus trap — keep Tab/Shift+Tab within the sheet
    const trapFocus = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return }
      if (e.key !== "Tab") return
      const focusable = Array.from(sheetRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      if (!focusable.length) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }

    document.addEventListener("keydown", trapFocus)
    return () => {
      clearTimeout(focusTimer)
      document.body.style.overflow = prev
      document.removeEventListener("keydown", trapFocus)
      prevFocusRef.current?.focus() // return focus to trigger element
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Details"}
            className="fixed inset-x-0 bottom-0 z-[201] bg-background rounded-t-3xl shadow-2xl flex flex-col"
            style={{
              maxHeight: "85dvh",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 38 }}
            // Only draggable via the handle (dragListener:false lets content scroll freely)
            // dragSnapToOrigin springs back when released without triggering close
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.4 }}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              // Close on large drag OR fast fling (velocity > 500px/s)
              if (info.offset.y > 80 || info.velocity.y > 500) onClose()
            }}
          >
            {/* Drag handle — the ONLY drag start point */}
            <div
              className="flex-shrink-0 flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 rounded-full bg-muted-foreground/25" />
            </div>

            {title && (
              <div className="flex-shrink-0 px-6 pb-4 border-b border-border">
                <p className="font-heading font-bold text-lg">{title}</p>
              </div>
            )}

            {/* Scrollable content — touch-pan-y allows vertical scroll without triggering drag */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 touch-pan-y"
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
