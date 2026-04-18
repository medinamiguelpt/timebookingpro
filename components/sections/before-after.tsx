"use client"

import { motion } from "framer-motion"
import { X, CheckCircle2 } from "lucide-react"

const BEFORE = [
  "Phone rings at 7 PM — you're with a client",
  "Call goes to voicemail",
  "Customer books with a competitor",
  "8 missed bookings this week",
  "Weekend calls go unanswered",
]

const AFTER = [
  "Phone rings at 7 PM — agent picks up instantly",
  "Customer is greeted by name, in their language",
  "Booking confirmed in under 90 seconds",
  "0 missed bookings — ever",
  "Weekends, nights, and holidays covered",
]

export function BeforeAfter() {
  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            The difference
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            What changes when you add an agent
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Before */}
          <motion.div
            className="rounded-2xl border border-border bg-card p-7 sm:p-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <X size={16} className="text-destructive" />
              </div>
              <h3 className="font-heading font-bold text-lg text-muted-foreground">Without CalBliss</h3>
            </div>
            <ul className="space-y-4">
              {BEFORE.map((item, i) => (
                <motion.li
                  key={item}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}
                >
                  <X size={15} className="text-destructive mt-0.5 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            className="rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/8 to-primary/4 p-7 sm:p-8 shadow-xl shadow-primary/10"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} className="text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg text-primary">With CalBliss</h3>
            </div>
            <ul className="space-y-4">
              {AFTER.map((item, i) => (
                <motion.li
                  key={item}
                  className="flex items-start gap-3 text-sm text-foreground"
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.07 }}
                >
                  <CheckCircle2 size={15} className="text-primary mt-0.5 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
