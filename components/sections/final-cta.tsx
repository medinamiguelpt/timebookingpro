"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle } from "lucide-react"

export function FinalCTA() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [position, setPosition] = useState<number | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setState("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        const data = await res.json()
        setPosition(data.position ?? null)
        setReferralCode(data.referralCode ?? null)
        setState("success")
      } else {
        setState("error")
      }
    } catch {
      setState("error")
    }
  }

  return (
    <section
      id="get-started"
      className="relative py-28 sm:py-36 overflow-hidden bg-[#0D0714]"
    >
      {/* Fade transition from light sections above */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-background/20 to-transparent pointer-events-none z-10" />
      {/* Purple glow */}
      <div className="absolute inset-0 -z-10 bg-purple-glow opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] -z-10 rounded-full bg-primary/20 blur-[100px]" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.p
          className="text-sm font-semibold uppercase tracking-widest text-primary-soft mb-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Get started today
        </motion.p>

        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-[1.1] tracking-tight mb-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Your calendar won&apos;t fill{" "}
          <span className="bg-gradient-to-r from-primary-soft via-white to-primary-soft bg-clip-text text-transparent">
            itself
          </span>
          . Yours will.
        </motion.h2>

        <motion.p
          className="text-lg text-white/60 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Join businesses that never miss a booking. Your AI agent will be live in under 24 hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {state === "success" ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2.5 text-green-400 font-semibold text-lg">
                <CheckCircle size={22} />
                You&apos;re on the list!
              </div>
              {position && (
                <p className="text-white/70 text-sm font-medium">
                  You&apos;re <span className="text-primary-soft font-bold">#{position}</span> in line — we&apos;ll reach out in order.
                </p>
              )}
              {referralCode && (
                <div className="mt-1 text-xs text-white/50 text-center">
                  Share your link to move up:{" "}
                  <button
                    onClick={() => navigator.clipboard.writeText(`https://calbliss.com/r/${referralCode}`)}
                    className="text-primary-soft underline underline-offset-2 hover:text-white transition-colors"
                  >
                    calbliss.com/r/{referralCode}
                  </button>
                </div>
              )}
              <p className="text-white/50 text-sm">Check your email — confirmation is on its way.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 w-full rounded-full px-5 h-13 bg-white/10 border border-white/20 text-white placeholder:text-white/35 text-sm outline-none focus:border-primary-soft/60 transition-colors"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="flex items-center gap-2 whitespace-nowrap bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-full px-7 h-13 text-sm shadow-2xl shadow-primary/40 transition-colors"
              >
                {state === "loading" ? "Sending…" : "Get your agent"}
                {state !== "loading" && <ArrowRight size={16} />}
              </button>
            </form>
          )}
          {state === "error" && (
            <p className="mt-3 text-sm text-red-400">Something went wrong — try again or email us at hello@calbliss.com</p>
          )}
          <p className="mt-4 text-xs text-white/30">No credit card required · Live in 24 h · Unsubscribe any time</p>
        </motion.div>
      </div>
    </section>
  )
}
