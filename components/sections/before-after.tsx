"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { X, Check } from "lucide-react"

type Row = { before: string; after: string }

export function BeforeAfter({ headline = "What changes when you add an agent" }: { headline?: string }) {
  const t = useTranslations("beforeAfter")
  const rows = t.raw("rows") as Row[]

  return (
    <section className="py-24 sm:py-32 bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h2
            key={headline}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
          >
            {headline}
          </motion.h2>
        </div>

        {/* Comparison table */}
        <motion.div
          className="rounded-2xl border border-border overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Column headers */}
          <div className="grid grid-cols-2">
            <div className="flex items-center gap-2.5 px-6 py-4 bg-destructive/5 border-b border-r border-border">
              <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <X size={12} className="text-destructive" />
              </div>
              <span className="font-heading font-bold text-sm text-muted-foreground">{t("withoutBrand")}</span>
            </div>
            <div className="flex items-center gap-2.5 px-6 py-4 bg-primary/5 border-b border-border">
              <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Check size={12} className="text-primary" />
              </div>
              <span className="font-heading font-bold text-sm text-primary">{t("withBrand")}</span>
            </div>
          </div>

          {/* Rows */}
          {rows.map(({ before, after }, i) => (
            <motion.div
              key={i}
              className="grid grid-cols-2 group"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.2 + i * 0.07 }}
            >
              {/* Before — text gets struck through on row hover */}
              <div className={`flex items-start gap-3 px-6 py-5 border-r border-border bg-card group-hover:bg-destructive/[0.03] transition-colors ${i < rows.length - 1 ? "border-b" : ""}`}>
                <X size={14} className="text-destructive/70 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground leading-snug transition-all duration-400 group-hover:line-through group-hover:opacity-50">
                  {before}
                </span>
              </div>

              {/* After — checkmark scales up on row hover */}
              <div className={`flex items-start gap-3 px-6 py-5 bg-primary/[0.03] group-hover:bg-primary/[0.06] transition-colors ${i < rows.length - 1 ? "border-b border-border" : ""}`}>
                <Check size={14} className="text-primary mt-0.5 shrink-0 transition-transform duration-300 origin-center group-hover:scale-125" />
                <span className="text-sm text-foreground font-medium leading-snug">{after}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
