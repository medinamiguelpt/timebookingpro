"use client"

import { useState, useRef, useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Globe, Check, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

/**
 * Per-locale display metadata.
 *  flag        — emoji used to derive the Twemoji SVG codepoints
 *  label       — short abbreviation, kept for accessibility (alt text, aria-label)
 *  nativeName  — how speakers write their own language; shown in dropdown
 *
 * Apple's emoji set is proprietary so we serve Twitter/jdecked Twemoji
 * SVGs from jsDelivr. Twemoji's flag style is the common 'looks like
 * Apple/Google but works on Windows too' choice (used by Discord, GitHub,
 * WhatsApp Web, etc.). The native OS emoji renderer wouldn't ship UK / Greek
 * / Saudi flags consistently on Windows browsers — Twemoji fixes that.
 */
const LOCALE_META: Record<Locale, { flag: string; label: string; nativeName: string }> = {
  "en":     { flag: "🇬🇧", label: "English",    nativeName: "English"    },
  "el":     { flag: "🇬🇷", label: "Greek",      nativeName: "Ελληνικά"   },
  "es-ES":  { flag: "🇪🇸", label: "Spanish",    nativeName: "Español"    },
  "pt-PT":  { flag: "🇵🇹", label: "Portuguese", nativeName: "Português"  },
  "fr-FR":  { flag: "🇫🇷", label: "French",     nativeName: "Français"   },
  "de-DE":  { flag: "🇩🇪", label: "German",     nativeName: "Deutsch"    },
  "ar-SA":  { flag: "🇸🇦", label: "Arabic",     nativeName: "العربية"    },
}

/** Convert a flag emoji (e.g. "🇬🇧") to a hyphenated hex codepoint string ("1f1ec-1f1e7"). */
function emojiCodepoints(emoji: string): string {
  return [...emoji]
    .map(c => c.codePointAt(0)?.toString(16))
    .filter(Boolean)
    .join("-")
}

/**
 * Twemoji SVG via jsDelivr. Pinned to v15.1.0 so a future upstream rename
 * doesn't silently break flag rendering. Each file is ~1-2 KB and gets
 * cached aggressively by jsDelivr's edge.
 */
function twemojiUrl(emoji: string): string {
  return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${emojiCodepoints(emoji)}.svg`
}

function FlagImage({ emoji, alt, size = 18 }: { emoji: string; alt: string; size?: number }) {
  // 4:3 is close to the canonical flag aspect ratio across most countries.
  const height = Math.round((size * 3) / 4)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={twemojiUrl(emoji)}
      alt={alt}
      width={size}
      height={height}
      loading="lazy"
      decoding="async"
      className="inline-block rounded-[2px] shrink-0 ring-1 ring-black/5"
      style={{ width: size, height }}
    />
  )
}

interface LocaleSwitcherProps {
  /** "compact" = dropdown opens above (used in footer). "navbar" drops down. */
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
          "inline-flex items-center gap-2 rounded-full px-3 h-9 text-sm font-medium transition-colors",
          "border border-border hover:bg-foreground/5 text-muted-foreground hover:text-foreground"
        )}
      >
        <Globe size={14} aria-hidden />
        <FlagImage emoji={current.flag} alt={current.label} size={20} />
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
              dropAbove ? "bottom-full mb-2 end-0" : "top-full mt-2 end-0"
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
                      "w-full flex items-center gap-3 px-3 py-2 text-sm text-start transition-colors",
                      active ? "bg-primary/10 text-foreground" : "hover:bg-foreground/5 text-muted-foreground"
                    )}
                  >
                    <FlagImage emoji={meta.flag} alt={meta.label} size={20} />
                    <span className="truncate">{meta.nativeName}</span>
                    {active && <Check size={14} className="ms-auto text-primary shrink-0" />}
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
