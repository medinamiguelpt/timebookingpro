"use client"

import { useState, useRef, useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Globe, Check, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

/**
 * Per-locale display metadata. Flag = country whose flag commonly represents
 * the language. Label = short recognizable abbreviation. NativeName = how
 * native speakers write their own language (used in the dropdown to help users
 * find their language regardless of the currently active UI language).
 */
const LOCALE_META: Record<Locale, { flag: string; label: string; nativeName: string }> = {
  "en":     { flag: "🇬🇧", label: "ENG",  nativeName: "English"    },
  "el":     { flag: "🇬🇷", label: "GR",   nativeName: "Ελληνικά"   },
  "es-ES":  { flag: "🇪🇸", label: "ESP",  nativeName: "Español"    },
  "pt-PT":  { flag: "🇵🇹", label: "PORT", nativeName: "Português"  },
  "fr-FR":  { flag: "🇫🇷", label: "FR",   nativeName: "Français"   },
  "de-DE":  { flag: "🇩🇪", label: "DE",   nativeName: "Deutsch"    },
  "ar-SA":  { flag: "🇸🇦", label: "AR",   nativeName: "العربية"    },
}

interface LocaleSwitcherProps {
  /** "compact" = trigger shows globe + label, dropdown opens above on footer use. */
  variant?: "compact" | "navbar"
  className?: string
}

export function LocaleSwitcher({ variant = "navbar", className }: LocaleSwitcherProps) {
  const t = useTranslations("localeSwitcher")
  const currentLocale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click + escape.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const switchTo = (next: Locale) => {
    setOpen(false)
    if (next === currentLocale) return
    // `replace` keeps history clean (no entry for the locale flip), and
    // the typed pathname stays on the same page in the target locale.
    router.replace(pathname, { locale: next })
  }

  const current = LOCALE_META[currentLocale]
  const dropAbove = variant === "compact"

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("ariaLabel")}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 h-9 text-sm font-medium transition-colors",
          "border border-border hover:bg-foreground/5 text-muted-foreground hover:text-foreground"
        )}
      >
        <Globe size={14} aria-hidden />
        <span className="font-semibold tracking-wide">{current.label}</span>
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: dropAbove ? 6 : -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropAbove ? 6 : -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute z-50 min-w-[180px] rounded-xl border border-border bg-background shadow-xl overflow-hidden",
              dropAbove ? "bottom-full mb-2 right-0" : "top-full mt-2 right-0"
            )}
          >
            {routing.locales.map((loc) => {
              const meta = LOCALE_META[loc]
              const active = loc === currentLocale
              return (
                <li key={loc}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => switchTo(loc)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors",
                      active ? "bg-primary/10 text-foreground" : "hover:bg-foreground/5 text-muted-foreground"
                    )}
                  >
                    <span className="text-base leading-none" aria-hidden>{meta.flag}</span>
                    <span className="font-semibold w-12 shrink-0">{meta.label}</span>
                    <span className="text-xs text-muted-foreground/70 truncate">{meta.nativeName}</span>
                    {active && <Check size={14} className="ml-auto text-primary shrink-0" />}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
