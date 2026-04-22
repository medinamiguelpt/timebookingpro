"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, BookOpen, Zap, CreditCard, Settings, Headphones, Shield } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

const CATEGORIES = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: Zap,
    color: "#7C3AED",
    articles: [
      {
        q: "How quickly can my AI agent go live?",
        a: "Most businesses are live within 24 hours. After you sign up, we schedule a 15-minute setup call to collect your preferences (services, prices, availability). Your agent is then trained and activated the same day.",
      },
      {
        q: "What information do I need to provide for setup?",
        a: "You'll need: your list of services and prices, your opening hours, your booking/calendar tool (we support Google Calendar, Calendly, Acuity, Outlook, and Apple Calendar), and any special instructions (e.g. \"always offer a 15-min consultation first\").",
      },
      {
        q: "Do I need any technical knowledge?",
        a: "None at all. We handle everything — phone number provisioning, calendar integration, and agent training. You just give us the details and we make it work.",
      },
      {
        q: "What phone number does the agent use?",
        a: "We provision a local phone number for your area. You can optionally forward your existing business number to it, so callers still dial the same number they know.",
      },
    ],
  },
  {
    id: "calls-bookings",
    label: "Calls & Bookings",
    icon: Headphones,
    color: "#0EA5E9",
    articles: [
      {
        q: "What happens when a customer calls?",
        a: "The AI agent answers within 2 rings, greets the caller by your business name, and handles the full booking conversation — checking availability, collecting details, and confirming the appointment. The caller gets an SMS confirmation automatically.",
      },
      {
        q: "Can the agent handle appointment changes and cancellations?",
        a: "Yes. Callers can say 'I need to move my appointment' or 'I want to cancel' and the agent will handle it, update the calendar, and send a new confirmation.",
      },
      {
        q: "What if a call is too complex for the agent?",
        a: "The agent recognises when it's out of its depth (complaints, complex queries, etc.) and offers to take a message or connect to your team. You'll be notified immediately via SMS and email.",
      },
      {
        q: "Does the agent speak other languages?",
        a: "Yes — Growth and Pro plans include multilingual support. The agent automatically detects the caller's language and responds in kind. We currently support English, Spanish, French, Portuguese, and German.",
      },
    ],
  },
  {
    id: "calendar",
    label: "Calendar & Integrations",
    icon: Settings,
    color: "#10B981",
    articles: [
      {
        q: "Which calendar tools do you support?",
        a: "We integrate natively with Google Calendar, Calendly, Acuity Scheduling, Microsoft Outlook, and Apple Calendar. If your tool is not listed, contact us — we may support it or can add it.",
      },
      {
        q: "Does the agent check real-time availability?",
        a: "Yes. The agent queries your calendar live during each call, so it only offers slots that are genuinely open. There's no risk of double-bookings.",
      },
      {
        q: "Can I set buffer time between appointments?",
        a: "Yes. During setup you can specify buffer times (e.g. 15 minutes between appointments) and the agent will respect them when offering slots.",
      },
    ],
  },
  {
    id: "billing",
    label: "Billing & Plans",
    icon: CreditCard,
    color: "#F59E0B",
    articles: [
      {
        q: "Can I cancel at any time?",
        a: "Yes. There are no long-term contracts. You can cancel your subscription at any time from your billing portal and you won't be charged again. You'll keep access until the end of your current billing period.",
      },
      {
        q: "What happens if I exceed my call limit?",
        a: "On Starter and Growth plans, we'll notify you when you're at 80% of your call allowance. If you exceed it, calls continue but you'll be billed at a small per-call rate. We'll always warn you before any extra charge.",
      },
      {
        q: "Do you offer a free trial?",
        a: "Yes — all plans come with a 14-day free trial. No credit card required to start. You'll only be billed if you decide to continue after the trial.",
      },
      {
        q: "Can I switch plans?",
        a: "Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately (prorated). Downgrades take effect at the next billing cycle.",
      },
      {
        q: "Do you offer discounts for annual billing?",
        a: "Yes — annual billing is 20% cheaper than monthly across all plans. You can switch to annual at any time from the billing portal.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: Shield,
    color: "#EF4444",
    articles: [
      {
        q: "Are call recordings stored?",
        a: "No. We do not store recordings of customer calls. Transcripts are temporarily used for booking confirmation but are not retained beyond 30 days, and are never sold or shared.",
      },
      {
        q: "Is my customer data secure?",
        a: "Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are GDPR-compliant and operate exclusively within EU/US data centres.",
      },
      {
        q: "Can I export my data?",
        a: "Yes. You can request a full export of your booking history and customer data at any time by emailing hello@timebookingpro.com. We provide it in CSV format within 5 business days.",
      },
    ],
  },
]

type Article = { q: string; a: string }

function ArticleItem({ article }: { article: Article }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors"
      >
        <span className="font-semibold text-sm pr-4">{article.q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
              {article.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HelpPage() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const results = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return CATEGORIES.flatMap((cat) =>
      cat.articles
        .filter((a) => a.q.toLowerCase().includes(q) || a.a.toLowerCase().includes(q))
        .map((a) => ({ ...a, category: cat.label }))
    )
  }, [query])

  const displayed = activeCategory
    ? CATEGORIES.filter((c) => c.id === activeCategory)
    : CATEGORIES

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

      {/* Hero */}
      <div className="bg-muted/30 border-b border-border py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <BookOpen size={14} />
            Help Centre
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight mb-4">
            How can we help?
          </h1>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full pl-11 pr-5 h-12 bg-card border border-border text-sm outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
        {/* Search results */}
        {results !== null ? (
          <div>
            <p className="text-sm text-muted-foreground mb-6">
              {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </p>
            {results.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-2">No articles found.</p>
                <p className="text-sm text-muted-foreground">
                  Try different keywords or{" "}
                  <a href="mailto:hello@timebookingpro.com" className="text-primary hover:underline">
                    contact us directly
                  </a>.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {results.map((a) => (
                  <div key={a.q}>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{a.category}</p>
                    <ArticleItem article={a} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden md:block w-52 shrink-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Categories</p>
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !activeCategory ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  All articles
                </button>
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        activeCategory === cat.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon size={13} />
                      {cat.label}
                    </button>
                  )
                })}
              </nav>
            </aside>

            {/* Articles */}
            <div className="flex-1 min-w-0 flex flex-col gap-10">
              {displayed.map((cat, i) => {
                const Icon = cat.icon
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <div className="flex items-center gap-2.5 mb-4">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${cat.color}15`, color: cat.color }}
                      >
                        <Icon size={15} />
                      </div>
                      <h2 className="font-heading font-bold text-lg">{cat.label}</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                      {cat.articles.map((a) => (
                        <ArticleItem key={a.q} article={a} />
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 bg-muted/40 border border-border rounded-2xl p-8 text-center">
          <p className="font-heading font-bold text-lg mb-2">Still have questions?</p>
          <p className="text-muted-foreground text-sm mb-5">
            Our team typically replies within a few hours during business hours.
          </p>
          <a
            href="mailto:hello@timebookingpro.com"
            className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Email us
          </a>
        </div>
      </main>
    </div>
  )
}
