"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Logo } from "@/components/logo"
import {
  Phone, Calendar, TrendingUp, Settings, CheckCircle,
  Clock, Users, Star, ArrowRight, ExternalLink, Zap
} from "lucide-react"

const MOCK_CALLS = [
  { name: "Marcus T.", time: "Today, 11:42 AM", outcome: "Booked", service: "Haircut + beard" },
  { name: "James R.", time: "Today, 10:15 AM", outcome: "Rescheduled", service: "Fade" },
  { name: "Dario M.", time: "Yesterday, 4:30 PM", outcome: "Booked", service: "Hot towel shave" },
  { name: "Leo K.", time: "Yesterday, 2:10 PM", outcome: "Booked", service: "Haircut" },
  { name: "Alex P.", time: "Yesterday, 1:55 PM", outcome: "Cancelled", service: "Beard trim" },
]

const UPCOMING = [
  { name: "Marcus T.", time: "Tomorrow, 2:00 PM", service: "Haircut + beard", confirmed: true },
  { name: "Dario M.", time: "Tomorrow, 4:30 PM", service: "Hot towel shave", confirmed: true },
  { name: "Leo K.", time: "Wed 23 Apr, 11:00 AM", service: "Haircut", confirmed: false },
]

function StatCard({ icon: Icon, label, value, sub, color = "primary" }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color?: string
}) {
  return (
    <motion.div
      className="bg-card border border-border rounded-2xl p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3`}>
        <Icon size={16} className="text-primary" />
      </div>
      <p className="text-2xl font-heading font-extrabold mb-0.5">{value}</p>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      {sub && <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">{sub}</p>}
    </motion.div>
  )
}

export default function DashboardPage() {
  const [tab, setTab] = useState<"calls" | "upcoming" | "settings">("calls")
  const [agentName, setAgentName] = useState("Max")
  const [businessName, setBusinessName] = useState("Tony's Barbershop")
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4 sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/"><Logo iconSize={28} /></Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-full px-3 py-1.5 text-xs font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Agent live
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-primary" />
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Dashboard</p>
          </div>
          <h1 className="text-2xl font-heading font-extrabold">
            Good morning — {agentName} is handling your calls.
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here&apos;s your activity over the last 7 days.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Phone}      label="Calls handled"   value="47"    sub="↑ 23% vs last week" />
          <StatCard icon={Calendar}   label="Bookings made"   value="38"    sub="↑ 18% vs last week" />
          <StatCard icon={TrendingUp} label="Revenue captured" value="$1,330" sub="Est. based on avg $35/booking" />
          <StatCard icon={Users}      label="Unique callers"  value="31"    />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/40 rounded-xl p-1 mb-6 w-fit">
          {(["calls", "upcoming", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "calls" ? "Recent calls" : t === "upcoming" ? "Upcoming" : "Agent settings"}
            </button>
          ))}
        </div>

        {/* Recent calls */}
        {tab === "calls" && (
          <div className="border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Caller</th>
                  <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Time</th>
                  <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Service</th>
                  <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CALLS.map((c, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium">{c.name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.time}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.service}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.outcome === "Booked" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                        c.outcome === "Rescheduled" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                        "bg-muted text-muted-foreground"
                      }`}>{c.outcome}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upcoming */}
        {tab === "upcoming" && (
          <div className="flex flex-col gap-3">
            {UPCOMING.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.time} · {a.service}</p>
                </div>
                {a.confirmed ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold shrink-0">
                    <CheckCircle size={13} /> Confirmed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold shrink-0">
                    <Clock size={13} /> Pending
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5 max-w-lg"
          >
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="font-semibold mb-4">Agent configuration</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Agent name</label>
                  <input
                    value={agentName}
                    onChange={e => setAgentName(e.target.value)}
                    className="w-full rounded-xl px-4 h-10 bg-background border border-border text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Business name</label>
                  <input
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full rounded-xl px-4 h-10 bg-background border border-border text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <button
                  onClick={save}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors w-fit"
                >
                  {saved ? <><CheckCircle size={14} /> Saved!</> : "Save changes"}
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="font-semibold mb-4">Billing & plan</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Growth Plan</p>
                  <p className="text-xs text-muted-foreground">$99/month · Renews May 1, 2026</p>
                </div>
                <span className="bg-primary/10 text-primary text-xs font-semibold rounded-full px-3 py-1">Active</span>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Manage billing <ExternalLink size={13} />
              </a>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="font-semibold mb-2">Need help?</p>
              <p className="text-sm text-muted-foreground mb-4">Our team replies within a few hours.</p>
              <div className="flex gap-3">
                <Link href="/help" className="flex items-center gap-1.5 text-sm text-primary hover:underline font-semibold">
                  Help centre <ArrowRight size={13} />
                </Link>
                <a href="mailto:hello@timebookingpro.com" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Email us
                </a>
              </div>
            </div>

            {/* Review collection */}
            <div className="bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-primary" />
                <p className="font-semibold">Auto-request reviews</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Automatically send a Google review link to customers after their appointment.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative inline-flex h-5 w-9 cursor-pointer rounded-full bg-primary transition-colors">
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow translate-x-4 transition-transform" />
                  </div>
                  <span className="text-xs font-semibold text-primary">Enabled</span>
                </div>
                <input
                  placeholder="Your Google review URL"
                  className="flex-1 rounded-lg px-3 h-8 bg-background border border-border text-xs outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
