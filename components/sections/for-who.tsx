"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"

// Stable tab values (used for state). Labels + content come from translations.
const TAB_VALUES = ["barbershops", "salons", "spas", "nails", "gyms"] as const

type TabText = { label: string; headline: string; body: string; perks: string[] }

export function ForWho({ headline = "Built for every booking business" }: { headline?: string }) {
  const t = useTranslations("forWho")
  const tabsText = t.raw("tabs") as TabText[]
  const tabs = TAB_VALUES.map((value, i) => ({ value, ...tabsText[i] }))

  return (
    <section className="py-24 sm:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h2
            key={headline}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {headline}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="barbershops">
            <TabsList className="flex flex-wrap gap-2 h-auto bg-transparent justify-center mb-10">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-full px-5 py-2 text-sm font-semibold border border-border data-active:bg-primary data-active:text-primary-foreground data-active:border-primary transition-colors"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <div className="grid md:grid-cols-2 gap-10 items-center rounded-2xl border border-border bg-card p-8 sm:p-10">
                  <div>
                    <h3 className="text-2xl font-heading font-extrabold leading-snug mb-4">
                      {tab.headline}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-8">{tab.body}</p>
                    <ul className="space-y-3">
                      {tab.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual accent */}
                  <div className="hidden md:flex justify-center">
                    <div className="w-56 h-56 rounded-3xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center gap-4 text-center p-6">
                      <p className="text-5xl font-heading font-extrabold text-primary">98%</p>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("statCaption")}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
