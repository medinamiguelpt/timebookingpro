"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { motion } from "framer-motion"
import { ArrowRight, Gift, CheckCircle } from "lucide-react"

export default function ReferralPage() {
  const { code } = useParams<{ code: string }>()
  const [email, setEmail]   = useState("")
  const [state, setState]   = useState<"idle" | "loading" | "success">("idle")
  const [position, setPosition] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setState("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "referral", ref: code }),
      })
      const data = await res.json()
      if (res.ok) {
        setPosition(data.position)
        setState("success")
      } else {
        setState("idle")
      }
    } catch {
      setState("idle")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/"><Logo iconSize={28} /></Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <motion.div
          className="relative max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {state === "success" ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-heading font-extrabold">You&apos;re on the list!</h1>
              {position && (
                <p className="text-primary font-semibold">You&apos;re #{position} in line.</p>
              )}
              <p className="text-muted-foreground text-sm leading-relaxed">
                Check your email — your confirmation and referral link are on their way.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline mt-2"
              >
                Explore TimeBookingPro <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              {/* Gift icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <Gift size={28} className="text-primary" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                You&apos;ve been invited
              </p>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight leading-tight mb-4">
                Your first month is free
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                A TimeBookingPro customer referred you — which means you jump the queue and your first month is on us. Join the waitlist below.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full px-5 h-12 bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors text-center"
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-full h-12 text-sm shadow-lg shadow-primary/25 transition-colors"
                >
                  {state === "loading" ? "Joining…" : "Claim my free month"}
                  {state !== "loading" && <ArrowRight size={16} />}
                </button>
              </form>

              <p className="mt-4 text-xs text-muted-foreground">No credit card · Live in 24 h · Cancel any time</p>
            </>
          )}
        </motion.div>
      </main>
    </div>
  )
}
