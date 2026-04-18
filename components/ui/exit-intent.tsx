"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, CheckCircle, ArrowRight } from "lucide-react"

const STORAGE_KEY = "calbliss-exit-shown"

export function ExitIntent() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "success">("idle")

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return

    let triggered = false
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered) {
        triggered = true
        sessionStorage.setItem(STORAGE_KEY, "1")
        // Small delay so it doesn't flash immediately on accidental mouse-out
        setTimeout(() => setVisible(true), 200)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setVisible(false) }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [visible])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setState("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-intent" }),
      })
      if (res.ok) setState("success")
    } catch {
      setState("idle")
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVisible(false)}
          />

          <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
            <motion.div
              className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
              initial={{ opacity: 0, y: -32, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -32, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top glow */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary via-primary-soft to-primary" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 rounded-full bg-primary/15 blur-2xl -z-10" />

              <button
                onClick={() => setVisible(false)}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="p-7 text-center">
                {state === "success" ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-500" />
                    </div>
                    <p className="font-heading font-bold text-foreground">You&apos;re in!</p>
                    <p className="text-sm text-muted-foreground">Check your inbox — your exclusive offer is on its way.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 mx-auto mb-4">
                      <Zap size={22} className="text-primary" />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                      Wait — exclusive offer
                    </p>
                    <h2 className="text-xl font-heading font-extrabold text-foreground mb-2 leading-tight">
                      Get your first month free
                    </h2>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                      Join the waitlist now and we&apos;ll waive your first month — no credit card needed.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-full px-4 h-11 bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors text-center"
                      />
                      <button
                        type="submit"
                        disabled={state === "loading"}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-full h-11 text-sm shadow-lg shadow-primary/25 transition-colors"
                      >
                        {state === "loading" ? "Saving…" : "Claim free month"}
                        {state !== "loading" && <ArrowRight size={15} />}
                      </button>
                    </form>

                    <button
                      onClick={() => setVisible(false)}
                      className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      No thanks, I don&apos;t want free money
                    </button>
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
