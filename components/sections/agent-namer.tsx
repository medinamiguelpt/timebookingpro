"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { Phone, Mic, Wand2, Loader2 } from "lucide-react"

const DEFAULT_SUGGESTIONS = ["Max", "Nova", "Aria", "Leo", "Sage", "Zara"]

const EASTER_EGG_KEYS = ["siri","alexa","cortana","hal","glados","jarvis","friday","clippy","watson"] as const
type EasterEggKey = (typeof EASTER_EGG_KEYS)[number]

export function AgentNamer({ headline = "Meet your AI teammate" }: { headline?: string }) {
  const t = useTranslations("agentNamer")
  const [name, setName] = useState("")
  const [business, setBusiness] = useState("")
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayName = name.trim() || "Max"
  const displayBusiness = business.trim() || t("defaultBusiness")

  const easterEggKey = name.toLowerCase().trim() as EasterEggKey
  const easterEgg = EASTER_EGG_KEYS.includes(easterEggKey) ? t(`easterEggs.${easterEggKey}`) : null

  const generateNames = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/agent-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: business.trim() }),
      })
      const data = await res.json()
      if (data.ok && Array.isArray(data.names)) {
        setSuggestions(data.names)
      } else {
        setError(t("errorTakingBreak"))
      }
    } catch {
      setError(t("errorNetwork"))
    } finally {
      setGenerating(false)
    }
  }

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
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {t("subheadline")}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left — Inputs */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">{t("businessLabel")}</label>
              <input
                type="text"
                placeholder={t("businessPlaceholder")}
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                maxLength={40}
                className="h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">{t("agentNameLabel")}</label>
              <input
                type="text"
                placeholder={t("agentNamePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />

              {/* Name suggestions */}
              <div className="flex flex-wrap gap-2 mt-1">
                <AnimatePresence mode="popLayout">
                  {suggestions.map((s) => (
                    <motion.button
                      key={s}
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.18 }}
                      onClick={() => setName(s)}
                      className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                        name === s
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>

              {/* AI generate button */}
              <button
                onClick={generateNames}
                disabled={generating}
                className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors mt-1 w-fit disabled:opacity-60"
              >
                {generating ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Wand2 size={13} />
                )}
                {generating ? t("generatingButton") : t("generateButton")}
              </button>

              {error && (
                <p role="alert" className="text-xs text-destructive mt-1" aria-live="polite">
                  {error}
                </p>
              )}
            </div>
          </motion.div>

          {/* Right — Live Preview Card */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-full max-w-sm rounded-2xl border border-border bg-card/90 backdrop-blur-sm shadow-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Mic size={22} className="text-primary" />
                </div>
                <div>
                  <motion.p
                    key={displayName}
                    className="font-heading font-bold text-foreground"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {displayName}
                  </motion.p>
                  <motion.p
                    key={displayBusiness}
                    className="text-xs text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t("previewAgentLabel", { business: displayBusiness })}
                  </motion.p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {t("previewLive")}
                </div>
              </div>

              <div className="space-y-2.5">
                {!easterEgg && (
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-foreground max-w-[85%]">
                    {t("previewUserBubble")}
                  </div>
                )}
                <motion.div
                  key={`${displayName}-${displayBusiness}`}
                  className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm ml-auto max-w-[90%]"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {easterEgg ?? t("previewAgentReply", { name: displayName, business: displayBusiness })}
                </motion.div>
                {easterEgg && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-muted-foreground text-center"
                  >
                    {t("easterEggHint")}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground pt-1">
                <Phone size={14} />
                <span className="text-xs">{t("phoneTagline")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
