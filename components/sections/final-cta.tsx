"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

// Parse *segments* of the headline — odd segments render in the gradient-text style,
// so each random variant can pick which word(s) get the flair.
function HighlightedHeadline({ text }: { text: string }) {
  const parts = text.split("*")
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            className="bg-gradient-to-r from-primary-soft via-white to-primary-soft bg-clip-text text-transparent"
            style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export function FinalCTA({ headline = "Their calendar won't fill *itself*, yours will." }: { headline?: string }) {
  const t = useTranslations("finalCta")

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
          {t("eyebrow")}
        </motion.p>

        <motion.h2
          key={headline}
          className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-[1.1] tracking-tight mb-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <HighlightedHeadline text={headline} />
        </motion.h2>

        <motion.p
          className="text-lg text-white/60 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {t("subheadline")}
        </motion.p>
      </div>
    </section>
  )
}
