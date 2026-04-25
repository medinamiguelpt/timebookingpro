"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { X } from "lucide-react"

type Shortcut = { keys: string[]; label: string; action: () => void }

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function KeyboardShortcuts() {
  const t = useTranslations("keyboardShortcuts")
  const [open, setOpen] = useState(false)
  const [prefix, setPrefix] = useState<string | null>(null)

  const shortcuts: Shortcut[] = [
    { keys: ["G", "H"], label: t("items.jumpToTop"),        action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { keys: ["G", "W"], label: t("items.jumpToHowItWorks"), action: () => scrollToId("how-it-works") },
    { keys: ["G", "F"], label: t("items.jumpToFeatures"),   action: () => scrollToId("features") },
    { keys: ["G", "P"], label: t("items.jumpToPricing"),    action: () => scrollToId("pricing") },
    { keys: ["G", "C"], label: t("items.jumpToGetStarted"), action: () => scrollToId("get-started") },
    { keys: ["?"],      label: t("items.toggleMenu"),       action: () => setOpen(o => !o) },
    { keys: ["Esc"],    label: t("items.closeMenu"),        action: () => setOpen(false) },
  ]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in an input/textarea/contenteditable
      const target = e.target as HTMLElement
      if (target.matches("input, textarea, select, [contenteditable=true]")) return

      // Toggle with "?"
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); setOpen(o => !o); return }
      if (e.key === "Escape") { setOpen(false); setPrefix(null); return }

      // Chord: "g" then a section letter
      const k = e.key.toLowerCase()
      if (prefix === "g") {
        const map: Record<string, string | null> = {
          h: null,              // top
          w: "how-it-works",
          f: "features",
          p: "pricing",
          c: "get-started",
        }
        if (k in map) {
          e.preventDefault()
          const id = map[k]
          if (id === null) window.scrollTo({ top: 0, behavior: "smooth" })
          else scrollToId(id)
        }
        setPrefix(null)
        return
      }
      if (k === "g" && !e.ctrlKey && !e.metaKey) {
        setPrefix("g")
        setTimeout(() => setPrefix(p => (p === "g" ? null : p)), 1200) // chord timeout
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [prefix])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            className="fixed left-1/2 top-1/2 z-[251] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: "-40%" }}
            animate={{ opacity: 1, scale: 1,   y: "-50%" }}
            exit={{    opacity: 0, scale: 0.92, y: "-40%" }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <p className="font-heading font-bold text-sm">{t("heading")}</p>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("closeAriaLabel")}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <ul className="p-5 space-y-2.5">
              {shortcuts.map((s, i) => (
                <li key={i} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k, j) => (
                      <kbd key={j} className="min-w-[26px] h-6 px-1.5 inline-flex items-center justify-center rounded-md bg-muted border border-border text-[11px] font-mono font-semibold text-foreground">
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <div className="px-5 py-3 text-[11px] text-muted-foreground/70 border-t border-border">
              {t.rich("tip", {
                kbd: (chunks) => (
                  <kbd className="inline-flex items-center justify-center px-1 rounded bg-muted border border-border font-mono font-semibold">{chunks}</kbd>
                ),
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
