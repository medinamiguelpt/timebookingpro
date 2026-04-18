"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, CheckCircle, ArrowRight } from "lucide-react"

type State = "idle" | "loading" | "success" | "error"

export function DemoModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [business, setBusiness] = useState("")
  const [state, setState] = useState<State>("idle")

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("open-demo-modal", handler)
    return () => window.removeEventListener("open-demo-modal", handler)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return
    setState("loading")
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, business }),
      })
      setState(res.ok ? "success" : "error")
    } catch {
      setState("error")
    }
  }

  const close = () => {
    setOpen(false)
    setState("idle")
    setName("")
    setEmail("")
    setBusiness("")
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
            <motion.div
              className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header gradient */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary-soft to-primary" />

              {/* Close */}
              <button
                onClick={close}
                className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="p-7">
                {state === "success" ? (
                  <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <CheckCircle size={28} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-lg font-heading font-bold text-foreground">You&apos;re booked!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        We&apos;ll email you a calendar invite within the hour.
                      </p>
                    </div>
                    <button
                      onClick={close}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Calendar size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-foreground">Book a free 20-min demo</p>
                        <p className="text-xs text-muted-foreground">We&apos;ll show you the agent live on your number</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                          Your name *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Jane Smith"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl px-4 h-11 bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                          Work email *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="jane@yourbusiness.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl px-4 h-11 bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                          Business name
                        </label>
                        <input
                          type="text"
                          placeholder="My Barbershop"
                          value={business}
                          onChange={(e) => setBusiness(e.target.value)}
                          className="w-full rounded-xl px-4 h-11 bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      {state === "error" && (
                        <p className="text-xs text-red-500">Something went wrong — try again or email us.</p>
                      )}

                      <button
                        type="submit"
                        disabled={state === "loading"}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-full h-12 text-sm shadow-lg shadow-primary/25 transition-colors mt-1"
                      >
                        {state === "loading" ? "Booking…" : "Request your demo"}
                        {state !== "loading" && <ArrowRight size={16} />}
                      </button>

                      <p className="text-center text-xs text-muted-foreground">
                        Free · No obligation · Usually within 2 hours
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export function openDemoModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-demo-modal"))
  }
}
