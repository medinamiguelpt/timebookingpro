"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, CheckCircle2 } from "lucide-react"
import { ComparisonSlider } from "@/components/ui/comparison-slider"

const ROWS = [
  {
    before: "Phone rings at 7 PM — you're mid-cut",
    after:  "Agent picks up in under 2 seconds",
  },
  {
    before: "Call goes to voicemail",
    after:  "Caller greeted by name, in their language",
  },
  {
    before: "Customer books with a competitor",
    after:  "Booking confirmed in under 90 seconds",
  },
  {
    before: "8 missed bookings this week",
    after:  "0 missed bookings — ever",
  },
  {
    before: "Weekend calls go unanswered",
    after:  "Weekends, nights, and holidays covered",
  },
]

function Panel({ side }: { side: "before" | "after" }) {
  const isBefore = side === "before"
  return (
    <div className={`h-full w-full p-6 sm:p-8 ${isBefore ? "bg-card" : "bg-gradient-to-br from-primary/10 to-primary/5"}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isBefore ? "bg-destructive/10" : "bg-primary/15"}`}>
          {isBefore
            ? <X size={15} className="text-destructive" />
            : <CheckCircle2 size={15} className="text-primary" />
          }
        </div>
        <h3 className={`font-heading font-bold text-base ${isBefore ? "text-muted-foreground" : "text-primary"}`}>
          {isBefore ? "Without CalBliss" : "With CalBliss"}
        </h3>
      </div>
      <ul className="space-y-3.5">
        {ROWS.map((row, i) => {
          const text = isBefore ? row.before : row.after
          return (
            <motion.li
              key={i}
              className={`flex items-start gap-3 text-sm ${isBefore ? "text-muted-foreground" : "text-foreground"}`}
              initial={{ opacity: 0, x: isBefore ? -8 : 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
            >
              {isBefore
                ? <X size={13} className="text-destructive mt-0.5 shrink-0" />
                : <CheckCircle2 size={13} className="text-primary mt-0.5 shrink-0" />
              }
              <span>{text}</span>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

export function BeforeAfter() {
  const [tab, setTab] = useState<"before" | "after">("after")

  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
          >
            The difference
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
          >
            What changes when you add an agent
          </motion.h2>
          <motion.p
            className="mt-3 text-muted-foreground text-base sm:hidden"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            Drag the handle to compare
          </motion.p>
        </div>

        {/* Desktop: drag slider */}
        <motion.div
          className="hidden sm:block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <ComparisonSlider
            before={<Panel side="before" />}
            after={<Panel side="after" />}
            beforeLabel="Without CalBliss"
            afterLabel="With CalBliss"
            initialPosition={48}
          />
          <p className="text-center text-xs text-muted-foreground mt-3">
            ← Drag to reveal →
          </p>
        </motion.div>

        {/* Mobile: tabs */}
        <div className="sm:hidden">
          <div className="flex gap-1 bg-muted/40 rounded-xl p-1 mb-4 w-fit mx-auto">
            <button
              onClick={() => setTab("before")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "before" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Without
            </button>
            <button
              onClick={() => setTab("after")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "after" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              With CalBliss
            </button>
          </div>
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === "after" ? 12 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-border overflow-hidden"
          >
            <Panel side={tab} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
