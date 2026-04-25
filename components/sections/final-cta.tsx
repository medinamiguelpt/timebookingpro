"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { useTranslations } from "next-intl"
import { ArrowRight, CheckCircle, MessageSquare } from "lucide-react"

const EMOJIS = ["📅", "📞", "✅", "🎉", "💜", "⚡", "🚀", "🤖"]

type EmojiParticle = { id: number; emoji: string; x: number; delay: number }

function EmojiReactions({ particles }: { particles: EmojiParticle[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute text-2xl select-none"
            style={{ left: `calc(50% + ${p.x}px)`, bottom: "50%" }}
            initial={{ y: 0, opacity: 1, scale: 0.5 }}
            animate={{ y: -160, opacity: 0, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

let particleCounter = 0

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
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [position, setPosition] = useState<number | null>(null)
  const [phone, setPhone] = useState("")
  const [smsState, setSmsState] = useState<"idle" | "loading" | "done">("idle")
  const [emojiParticles, setEmojiParticles] = useState<EmojiParticle[]>([])
  const [inputFocused, setInputFocused] = useState(false)
  const shakeControls = useAnimation()

  const spawnEmojis = useCallback(() => {
    const count = 7
    const newParticles: EmojiParticle[] = Array.from({ length: count }, (_, i) => ({
      id: ++particleCounter,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: (Math.random() - 0.5) * 240,
      delay: i * 0.08,
    }))
    setEmojiParticles((prev) => [...prev, ...newParticles])
    setTimeout(() => {
      setEmojiParticles((prev) => prev.filter((p) => !newParticles.find((n) => n.id === p.id)))
    }, 2000)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setState("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        const data = await res.json()
        setPosition(data.position ?? null)
        setState("success")
        // Double-pulse haptic on mobile devices that support it
        if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate([80, 30, 80])
      } else {
        setState("error")
        shakeControls.start({ x: [0, -10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.5 } })
      }
    } catch {
      setState("error")
      shakeControls.start({ x: [0, -10, 10, -8, 8, -4, 4, 0], transition: { duration: 0.5 } })
    }
  }

  const handleSmsOptin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !email) return
    setSmsState("loading")
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone }),
    })
    setSmsState("done")
  }

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
          className="text-lg text-white/60 mb-8 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {t("subheadline")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {state === "success" ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2.5 text-green-400 font-semibold text-lg">
                <CheckCircle size={22} />
                {t("successHeading")}
              </div>
              {position && (
                <p className="text-white/70 text-sm font-medium">
                  {t.rich("positionLine", {
                    position,
                    bold: (chunks) => <span className="text-primary-soft font-bold">{chunks}</span>,
                  })}
                </p>
              )}
              <p className="text-white/50 text-sm">{t("checkEmail")}</p>

              {/* SMS opt-in */}
              {smsState === "done" ? (
                <div className="flex items-center gap-2 text-green-400 text-xs font-semibold mt-1">
                  <CheckCircle size={14} /> {t("smsEnabled")}
                </div>
              ) : (
                <form onSubmit={handleSmsOptin} className="mt-2 flex gap-2 items-center">
                  <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs text-white/50">
                    <MessageSquare size={12} />
                    <span>{t("smsPrompt")}</span>
                  </div>
                  <input
                    type="tel"
                    placeholder={t("smsPhonePlaceholder")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-full px-4 h-8 bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-xs outline-none focus:border-primary-soft/60 transition-colors w-36"
                  />
                  <button
                    type="submit"
                    disabled={smsState === "loading" || !phone}
                    className="bg-white/15 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-semibold rounded-full px-3 h-8 transition-colors whitespace-nowrap"
                  >
                    {smsState === "loading" ? "…" : t("smsButton")}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <motion.div className="relative" animate={shakeControls}>
              <EmojiReactions particles={emojiParticles} />
              <form
                onSubmit={(e) => { handleSubmit(e); spawnEmojis() }}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              >
                {/* Email input with animated gradient border on focus */}
                <div className="relative flex-1">
                  {/* Spinning gradient ring — only rendered when focused */}
                  {inputFocused && (
                    <div
                      className="absolute -inset-[1.5px] rounded-full pointer-events-none"
                      style={{
                        background: "conic-gradient(from var(--border-angle), #7C3AED, #A78BFA, #C4B5FD, #7C3AED)",
                        animation: "border-spin 3s linear infinite",
                      }}
                      aria-hidden
                    />
                  )}
                  <input
                    type="email"
                    required
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => {
                      setInputFocused(true)
                      const el = e.currentTarget
                      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 300)
                    }}
                    onBlur={() => setInputFocused(false)}
                    className="relative z-10 w-full rounded-full px-5 h-13 bg-[#130921] border border-transparent text-white placeholder:text-white/35 text-sm outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  data-ripple
                  disabled={state === "loading"}
                  className="shimmer-btn flex items-center gap-2 whitespace-nowrap bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-full px-7 h-13 text-sm shadow-2xl shadow-primary/40 transition-colors"
                >
                  {state === "loading" ? t("submitLoading") : t("submitDefault")}
                  {state !== "loading" && <ArrowRight size={16} className="rtl:rotate-180" />}
                </button>
              </form>
            </motion.div>
          )}
          {state === "error" && (
            <p className="mt-3 text-sm text-red-400">{t("errorMessage")}</p>
          )}
          <p className="mt-4 text-xs text-white/30">{t("finePrint")}</p>
        </motion.div>
      </div>
    </section>
  )
}
