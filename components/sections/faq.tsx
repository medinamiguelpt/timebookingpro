"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { RevealWords } from "@/components/ui/reveal-words"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    q: "What happens when I run out of minutes?",
    a: "Your bill stays flat — we don't charge overage. New calls route to voicemail until the next billing cycle or an upgrade. You'll get email alerts at 75% and 90% of your bucket so you're never surprised.",
  },
  {
    q: "Can I use one plan across multiple locations?",
    a: "Yes. Minutes are a single pool you can use across any number of locations — we don't track or limit where they're spent. Pick the plan that matches your total monthly call volume.",
  },
  {
    q: "What if my volume changes month to month?",
    a: "Upgrade or downgrade any time from the weekly performance email — changes prorate against the current cycle.",
  },
  {
    q: "Do you serve customers outside the EU?",
    a: "Not yet — we're focused on the EU market at this stage. If you're outside the EU and want to be notified when we expand, drop us a line.",
  },
  {
    q: "How long does it take to set up?",
    a: "Most agents are live within 24 hours. We handle the entire setup — you just need to tell us your business name, hours, and services.",
  },
  {
    q: "Does the agent sound robotic?",
    a: "Not at all. We use state-of-the-art voice AI from ElevenLabs that sounds natural, warm, and conversational. Most customers don't realise they're talking to an AI.",
  },
  {
    q: "What calendar systems does it work with?",
    a: "We currently support Google Calendar, Calendly, and Acuity Scheduling. Outlook Calendar and Apple Calendar support are coming soon. If you use a different system, get in touch and we'll check compatibility.",
  },
  {
    q: "What happens if I already have someone answering calls?",
    a: "Your agent acts as a first responder — it handles bookings automatically so your team can focus on higher-value tasks. It's not a replacement, it's an upgrade.",
  },
  {
    q: "Can I change my agent's name or style later?",
    a: "Yes. From the dashboard you can update your agent's name and conversation style at any time. Changes go live within minutes.",
  },
  {
    q: "Is there a long-term contract?",
    a: "No. All plans are month-to-month. You can upgrade, downgrade, or cancel at any time — no penalties, no questions asked.",
  },
  {
    q: "What happens if the agent can't answer a question?",
    a: "The agent is designed to handle your specific services and FAQs. If a caller asks something outside its knowledge, it gracefully offers to take a message or transfer the call. It never leaves a caller stranded.",
  },
  {
    q: "Is my customer data safe?",
    a: "Yes. All data is encrypted in transit and at rest. We are GDPR-compliant and never sell or share customer data. You own your data and can export or delete it at any time.",
  },
  {
    q: "Can the agent handle multiple languages?",
    a: "Yes — all plans include 7-language support. The agent auto-detects the caller's language and responds in Greek, English, Spanish, Portuguese, French, German, or Arabic.",
  },
  {
    q: "What if I get more calls than my plan allows?",
    a: "We'll notify you before you reach your limit so you can upgrade. If you go over briefly, we won't cut you off — we'll simply charge a small per-call overage rate rather than miss a booking for you.",
  },
]

export function FAQ({ headline = "Frequently asked questions" }: { headline?: string }) {
  const allValues = useMemo(() => FAQS.map((_, i) => `item-${i}`), [])
  const [open, setOpen] = useState<string[]>([])
  const allOpen = open.length === allValues.length

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            FAQ
          </motion.p>
          <RevealWords
            key={headline}
            className="text-3xl sm:text-4xl font-heading font-extrabold leading-tight tracking-tight"
            delay={0.1}
          >
            {headline}
          </RevealWords>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Expand / collapse all — animates icon swap and button width */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setOpen(allOpen ? [] : allValues)}
              className="relative flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-full"
              aria-label={allOpen ? "Collapse all questions" : "Expand all questions"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={allOpen ? "collapse" : "expand"}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {allOpen ? <Minus size={12} /> : <Plus size={12} />}
                  {allOpen ? "Collapse all" : "Expand all"}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          <Accordion
            className="space-y-3"
            multiple
            value={open}
            onValueChange={(v) => setOpen(v as string[])}
          >
            {FAQS.map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border rounded-xl px-5 bg-card"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
