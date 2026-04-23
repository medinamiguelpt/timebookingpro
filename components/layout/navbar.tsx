"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { MagneticWrap } from "@/components/ui/magnetic-wrap"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "How it Works", href: "#how-it-works", sectionId: "how-it-works" },
  { label: "Features",     href: "#features",     sectionId: "features" },
  { label: "Pricing",      href: "#pricing",       sectionId: "pricing" },
]

export function Navbar() {
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
    const sectionIds = NAV_LINKS.map((l) => l.sectionId).filter(Boolean) as string[]

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
        <a href="/" aria-label="TimeBookingPro home" className="flex items-center">
          <Logo iconSize={32} />
        </a>

        {/* Desktop nav links — subtle magnetic pull on hover */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = link.sectionId ? activeSection === link.sectionId : false
            return (
              <li key={link.href}>
                <MagneticWrap pull={0.18} stiffness={380} damping={28}>
                  <a
                    href={link.href}
                    className={cn(
                      "relative text-sm font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </MagneticWrap>
              </li>
            )
          })}
        </ul>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={toggleTheme}
            aria-label="Toggle theme"
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

          <a
            href="#get-started"
            data-ripple
            className="shimmer-btn hidden md:inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-5 h-9 text-sm transition-colors"
          >
            Get Started
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
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
              {NAV_LINKS.map((link, i) => {
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
                      {link.label}
                    </a>
                  </motion.li>
                )
              })}
              <motion.li
                className="pt-2"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06 }}
              >
                <Button
                  render={<a href="#get-started" onClick={() => setMobileOpen(false)} />}
                  nativeButton={false}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
                >
                  Get Started
                </Button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
