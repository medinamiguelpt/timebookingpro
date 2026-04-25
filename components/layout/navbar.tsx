"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { Sun, Moon, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/logo"
import { LocaleSwitcher } from "@/components/ui/locale-switcher"
import { cn } from "@/lib/utils"

const NAV_LINK_KEYS = [
  { key: "howItWorks", href: "#how-it-works", sectionId: "how-it-works" },
  { key: "features",   href: "#features",     sectionId: "features" },
  { key: "pricing",    href: "#pricing",      sectionId: "pricing" },
] as const

export function Navbar() {
  const t = useTranslations("navbar")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    setMounted(true)

    // Always start at top — disable browser scroll restoration on refresh
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"
    window.scrollTo(0, 0)

    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", onScroll, { passive: true })

    // Observe each anchor section
    const sectionIds = NAV_LINK_KEYS.map((l) => l.sectionId).filter(Boolean) as string[]

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    )

    const tryObserve = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observerRef.current?.observe(el)
      })
    }

    // Sections may not be mounted immediately (template transition)
    tryObserve()
    const t = setTimeout(tryObserve, 300)

    return () => {
      window.removeEventListener("scroll", onScroll)
      observerRef.current?.disconnect()
      clearTimeout(t)
    }
  }, [])

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 pointer-events-none">
      <div
        className={cn(
          "transition-all duration-500 pointer-events-auto",
          scrolled
            ? "mx-3 sm:mx-6 lg:mx-auto lg:max-w-5xl mt-2 rounded-2xl bg-background/75 backdrop-blur-xl border border-border/60 shadow-xl shadow-black/8"
            : "bg-transparent"
        )}
      >
      <nav className={cn(
        "px-4 sm:px-5 flex items-center justify-between transition-all duration-300",
        scrolled ? "h-14" : "h-16 max-w-6xl mx-auto px-4 sm:px-6"
      )}>
        {/* Logo */}
        <Link href="/" aria-label={t("homeAriaLabel")} className="flex items-center">
          <Logo iconSize={32} />
        </Link>

        {/* Desktop nav links — pill-style background on hover, no movement */}
        <ul className="hidden md:flex items-center gap-2">
          {NAV_LINK_KEYS.map((link) => {
            const isActive = link.sectionId ? activeSection === link.sectionId : false
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium px-3 py-1.5 rounded-md",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  {t(link.key)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LocaleSwitcher variant="navbar" />
          </div>

          <motion.button
            onClick={toggleTheme}
            aria-label={t("toggleTheme")}
            className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors overflow-hidden"
            whileTap={{ scale: 0.88 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mounted && theme === "dark" ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                >
                  <Sun size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                >
                  <Moon size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("toggleMenu")}
            className="md:hidden p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={cn(
              "md:hidden bg-background/95 backdrop-blur-xl overflow-hidden pointer-events-auto",
              scrolled
                ? "mx-3 sm:mx-6 lg:mx-auto lg:max-w-5xl rounded-b-2xl border-x border-b border-border/60 shadow-xl shadow-black/8"
                : "border-t border-border"
            )}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINK_KEYS.map((link, i) => {
                const isActive = link.sectionId ? activeSection === link.sectionId : false
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {t(link.key)}
                    </a>
                  </motion.li>
                )
              })}
              <motion.li
                className="pt-2 px-3"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINK_KEYS.length * 0.06 }}
              >
                <LocaleSwitcher variant="navbar" />
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
