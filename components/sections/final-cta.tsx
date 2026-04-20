"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, MessageSquare, Trophy, Gift } from "lucide-react"
import { VoiceDemo } from "@/components/ui/voice-demo"

const MILESTONES = [
  { count: 1,  reward: "30-day trial", icon: "🎁" },
  { count: 3,  reward: "1 month free", icon: "⭐" },
  { count: 10, reward: "3 months free", icon: "🏆" },
  { count: 25, reward: "25% off forever", icon: "💎" },
]

export function FinalCTA() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [position, setPosition] = useState<number | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [smsState, setSmsState] = useState<"idle" | "loading" | "done">("idle")
  const [leaderboard, setLeaderboard] = useState<{ top: { rank: number; initial: string; referrals: number }[] } | null>(null)

  useEffect(() => {
    fetch("/api/leaderboard").then(r => r.json()).then(setLeaderboard).catch(() => null)
  }, [])

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

  const handleSmsOptin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !email) return
    setSmsState("loading")
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone }),
    })
    setSmsState("done")
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
          className="text-lg text-white/60 mb-6 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Join businesses that never miss a booking. Your AI agent will be live in under 24 hours.
        </motion.p>

        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <VoiceDemo />
        </motion.div>

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

              {/* Milestone progress */}
              {referralCode && (
                <div className="mt-4 w-full max-w-xs">
                  <div className="flex items-center gap-2 text-white/70 text-xs mb-3">
                    <Trophy size={13} className="text-primary-soft" />
                    <span>Refer friends to unlock rewards</span>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {MILESTONES.map(({ count, reward, icon }) => (
                      <div key={count} className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sm">
                          {icon}
                        </div>
                        <p className="text-[9px] text-white/40 text-center leading-tight">{count} ref{count > 1 ? "s" : ""}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(`https://calbliss.com/r/${referralCode}`)}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary-soft text-xs font-semibold rounded-full py-2 transition-colors"
                  >
                    <Gift size={12} /> Copy referral link to share
                  </button>
                </div>
              )}

              {/* Leaderboard teaser */}
              {leaderboard && leaderboard.top.length > 0 && (
                <div className="mt-4 w-full max-w-xs bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Top referrers this month</p>
                  {leaderboard.top.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <span className="text-xs text-white/30 w-4">#{r.rank}</span>
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary-soft font-bold">{r.initial}</div>
                      <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(100, (r.referrals / 15) * 100)}%` }} />
                      </div>
                      <span className="text-[10px] text-white/40">{r.referrals}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* SMS opt-in */}
              {smsState === "done" ? (
                <div className="flex items-center gap-2 text-green-400 text-xs font-semibold mt-1">
                  <CheckCircle size={14} /> SMS updates enabled
                </div>
              ) : (
                <form onSubmit={handleSmsOptin} className="mt-2 flex gap-2 items-center">
                  <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs text-white/50">
                    <MessageSquare size={12} />
                    <span>Get SMS updates?</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="+1 555 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-full px-4 h-8 bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-xs outline-none focus:border-primary-soft/60 transition-colors w-36"
                  />
                  <button
                    type="submit"
                    disabled={smsState === "loading" || !phone}
                    className="bg-white/15 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-semibold rounded-full px-3 h-8 transition-colors whitespace-nowrap"
                  >
                    {smsState === "loading" ? "…" : "Yes please"}
                  </button>
                </form>
              )}
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
