"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

const TECH = [
  { name: "ElevenLabs",      labelKey: "voiceAi",      color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
  { name: "Twilio",           labelKey: "phoneCalls",   color: "#F22F46", bg: "rgba(242,47,70,0.1)"  },
  { name: "OpenAI",           labelKey: "languageAi",   color: "#10A37F", bg: "rgba(16,163,127,0.1)" },
  { name: "Google Calendar",  labelKey: "scheduling",   color: "#1A73E8", bg: "rgba(26,115,232,0.1)" },
  { name: "Calendly",         labelKey: "bookingFlows", color: "#006BFF", bg: "rgba(0,107,255,0.1)"  },
  { name: "Stripe",           labelKey: "payments",     color: "#635BFF", bg: "rgba(99,91,255,0.1)"  },
] as const

export function TechStrip() {
  const t = useTranslations("techStrip")

  return (
    <section className="py-14 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.p
          className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t("heading")}
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {TECH.map(({ name, labelKey, color, bg }, i) => (
            <motion.div
              key={name}
              className="flex items-center gap-2.5 rounded-full px-4 py-2.5 border"
              style={{
                borderColor: `${color}30`,
                backgroundColor: bg,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ scale: 1.04 }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">{name}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">· {t(`labels.${labelKey}`)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
