"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, DollarSign, TrendingUp, Copy, Check, ArrowRight, Gift } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

type Stats = {
  referrals: number
  active: number
  earnings: number
  pending: number
  referralCode: string
  recentReferrals: { email: string; date: string; status: "active" | "trial" | "cancelled" }[]
}

export default function AffiliatePage() {
  const [code, setCode] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "found" | "not-found">("idle")
  const [stats, setStats] = useState<Stats | null>(null)
  const [copied, setCopied] = useState(false)

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setState("loading")
    try {
      const res = await fetch(`/api/affiliate?code=${code.trim().toUpperCase()}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
        setState("found")
      } else {
        setState("not-found")
      }
    } catch {
      setState("not-found")
    }
  }

  const referralUrl = stats ? `https://timebookingpro.com/r/${stats.referralCode}` : ""

  const copy = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/"><Logo iconSize={28} /></Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Gift size={14} />
            Affiliate Programme
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-4">
            Earn 30% recurring commission
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-base">
            Refer businesses to TimeBookingPro and earn 30% of their monthly subscription for as long as they stay — forever.
          </p>
        </div>

        {/* How it works */}
        <div className="grid sm:grid-cols-3 gap-5 mb-14">
          {[
            { icon: Users, title: "Share your link", desc: "Every waitlist signup gets a unique referral link automatically." },
            { icon: TrendingUp, title: "They convert", desc: "When someone you referred becomes a paying customer, you start earning." },
            { icon: DollarSign, title: "Get paid monthly", desc: "Commissions are paid on the 1st of each month via Stripe or bank transfer." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Icon size={18} className="text-primary" />
              </div>
              <p className="font-semibold mb-1.5">{title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Commission tiers */}
        <div className="bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-7 mb-14">
          <p className="font-heading font-bold text-lg mb-5">Commission tiers</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { tier: "Starter", rate: "20%", condition: "1–5 active referrals" },
              { tier: "Partner", rate: "25%", condition: "6–19 active referrals" },
              { tier: "Elite", rate: "30%", condition: "20+ active referrals" },
            ].map(({ tier, rate, condition }) => (
              <div key={tier} className="bg-card rounded-xl p-4 text-center border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{tier}</p>
                <p className="text-3xl font-heading font-extrabold text-primary mb-1">{rate}</p>
                <p className="text-xs text-muted-foreground">{condition}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Commissions apply to recurring monthly payments. Annual plans pay commission monthly, prorated.
          </p>
        </div>

        {/* Lookup */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <p className="font-heading font-bold text-xl mb-2">Check your stats</p>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your referral code (from your signup confirmation email) to view your dashboard.
          </p>

          {state !== "found" ? (
            <form onSubmit={lookup} className="flex gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Your code (e.g. AB12CD)"
                maxLength={6}
                className="flex-1 rounded-full px-5 h-11 bg-background border border-border text-sm outline-none focus:border-primary/50 transition-colors font-mono tracking-widest uppercase"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="flex items-center gap-2 bg-primary text-white rounded-full px-6 h-11 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors whitespace-nowrap"
              >
                {state === "loading" ? "Looking up…" : <>View stats <ArrowRight size={14} /></>}
              </button>
            </form>
          ) : null}

          {state === "not-found" && (
            <p className="mt-3 text-sm text-red-500">
              Code not found. Check your confirmation email or{" "}
              <a href="mailto:hello@timebookingpro.com" className="underline">contact us</a>.
            </p>
          )}

          {state === "found" && stats && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total referrals", value: stats.referrals },
                  { label: "Active customers", value: stats.active },
                  { label: "Lifetime earnings", value: `$${stats.earnings}` },
                  { label: "Pending payout", value: `$${stats.pending}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/40 rounded-xl p-4 text-center">
                    <p className="text-2xl font-heading font-extrabold mb-1">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Referral link */}
              <div className="mb-8">
                <p className="text-sm font-semibold mb-2">Your referral link</p>
                <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-4 py-3 border border-border">
                  <span className="flex-1 text-sm font-mono text-muted-foreground truncate">{referralUrl}</span>
                  <button
                    onClick={copy}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Recent referrals */}
              {stats.recentReferrals.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-3">Recent referrals</p>
                  <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">Email</th>
                          <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">Date</th>
                          <th className="text-left px-4 py-2.5 text-xs text-muted-foreground font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentReferrals.map((r, i) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="px-4 py-3 font-medium">{r.email}</td>
                            <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                r.status === "active" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                r.status === "trial"  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <button
                onClick={() => { setState("idle"); setStats(null); setCode("") }}
                className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Look up a different code
              </button>
            </motion.div>
          )}
        </div>

        {/* Join CTA */}
        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground mb-3">Don&apos;t have a referral code yet?</p>
          <Link
            href="/#get-started"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Join the waitlist to get yours <ArrowRight size={13} />
          </Link>
        </div>
      </main>
    </div>
  )
}
