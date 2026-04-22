"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, PhoneOff, Volume2, Mic } from "lucide-react"

const SCRIPT: { speaker: "agent" | "user"; text: string; options?: string[] }[] = [
  {
    speaker: "agent",
    text: "Thank you for calling Tony's Barbershop. This is Max — how can I help you today?",
    options: ["Book a haircut", "What are your hours?", "Reschedule an appointment"],
  },
  {
    speaker: "user",
    text: "Book a haircut",
  },
  {
    speaker: "agent",
    text: "Great! I have tomorrow at 2 PM or 4 PM available. Which works better for you?",
    options: ["2 PM please", "4 PM works for me"],
  },
  {
    speaker: "user",
    text: "2 PM please",
  },
  {
    speaker: "agent",
    text: "Perfect! I've got you booked for tomorrow at 2 PM. What's your name so I can confirm the reservation?",
    options: ["It's Alex"],
  },
  {
    speaker: "user",
    text: "It's Alex",
  },
  {
    speaker: "agent",
    text: "Wonderful, Alex! You're all set for tomorrow at 2 PM. You'll receive a confirmation text shortly. Is there anything else I can help with?",
    options: ["No, that's all — thanks!"],
  },
  {
    speaker: "user",
    text: "No, that's all — thanks!",
  },
  {
    speaker: "agent",
    text: "My pleasure, Alex! We'll see you tomorrow at 2 PM. Have a great day!",
  },
]

function Waveform({ active }: { active: boolean }) {
  const bars = [0.3, 0.7, 1, 0.5, 0.9, 0.4, 0.8, 0.6, 0.95, 0.35, 0.75, 0.5]
  return (
    <div className="flex items-center gap-[3px] h-8">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-primary"
          animate={active ? { scaleY: [h, 1, h * 0.4, 0.9, h] } : { scaleY: 0.15 }}
          transition={active ? { duration: 0.9, repeat: Infinity, delay: i * 0.07, ease: "easeInOut" } : { duration: 0.3 }}
          style={{ height: "100%", transformOrigin: "center" }}
        />
      ))}
    </div>
  )
}

export function VoiceDemo() {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<"ringing" | "active" | "done">("ringing")
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState<{ speaker: "agent" | "user"; text: string }[]>([])
  const [speaking, setSpeaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const playTTS = useCallback(async (text: string) => {
    setSpeaking(true)
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) {
        await new Promise(r => setTimeout(r, text.length * 45))
        setSpeaking(false)
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url) }
      await audio.play()
    } catch {
      await new Promise(r => setTimeout(r, text.length * 40))
      setSpeaking(false)
    }
  }, [])

  const startCall = useCallback(async () => {
    setPhase("active")
    setStep(0)
    setMessages([])
    setLoading(true)

    const first = SCRIPT[0]
    if (first.speaker === "agent") {
      setMessages([{ speaker: "agent", text: first.text }])
      setLoading(false)
      await playTTS(first.text)
    }
  }, [playTTS])

  const handleOption = useCallback(async (option: string) => {
    if (speaking || loading) return
    const userStep = step + 1
    const userMsg = SCRIPT[userStep]
    if (!userMsg) return

    setMessages(prev => [...prev, { speaker: "user", text: option }])
    setStep(userStep + 1)

    const nextStep = userStep + 1
    const agentMsg = SCRIPT[nextStep]
    if (!agentMsg) {
      setTimeout(() => setPhase("done"), 800)
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setMessages(prev => [...prev, { speaker: "agent", text: agentMsg.text }])
    setLoading(false)
    await playTTS(agentMsg.text)
    setStep(nextStep)
  }, [step, speaking, loading, playTTS])

  const close = useCallback(() => {
    audioRef.current?.pause()
    setOpen(false)
    setTimeout(() => { setPhase("ringing"); setStep(0); setMessages([]) }, 300)
  }, [])

  const currentOptions = SCRIPT[step]?.options ?? []

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <span className="flex items-center gap-[2px] h-3.5">
          {[0.4, 0.9, 0.6, 1, 0.5].map((h, i) => (
            <motion.span key={i} className="w-[2px] rounded-full bg-primary-soft block" style={{ height: "100%" }}
              animate={{ scaleY: [h, 1, h * 0.5, 0.9, h] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </span>
        Hear the agent live
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />

            <motion.div
              className="relative w-full max-w-sm bg-[#0D0714] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 blur-[60px] -z-0 pointer-events-none" />

              {/* Header */}
              <div className="relative px-6 pt-7 pb-5 text-center border-b border-white/10">
                <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✂️</span>
                </div>
                <p className="font-bold text-white text-base">Tony&apos;s Barbershop</p>
                <p className="text-white/50 text-xs mt-0.5">AI Agent Demo</p>
              </div>

              {/* Phase: ringing */}
              {phase === "ringing" && (
                <div className="px-6 py-8 text-center">
                  <motion.div
                    className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center mx-auto mb-5"
                    animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 0 0 rgba(124,58,237,0.4)", "0 0 0 20px rgba(124,58,237,0)", "0 0 0 0 rgba(124,58,237,0)"] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                  >
                    <Phone size={28} className="text-primary-soft" />
                  </motion.div>
                  <p className="text-white font-semibold mb-1">Calling the agent…</p>
                  <p className="text-white/40 text-sm mb-8">Experience a real booking call</p>
                  <button
                    onClick={startCall}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-full py-3 text-sm transition-colors shadow-lg shadow-primary/30"
                  >
                    Answer call
                  </button>
                </div>
              )}

              {/* Phase: active */}
              {phase === "active" && (
                <div className="flex flex-col h-[380px]">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-white/70 font-medium">Live call</span>
                    </div>
                    {speaking ? (
                      <div className="flex items-center gap-1.5">
                        <Volume2 size={13} className="text-primary-soft" />
                        <Waveform active={speaking} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-white/30">
                        <Mic size={13} />
                        <span className="text-xs">Your turn</span>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
                    <AnimatePresence initial={false}>
                      {messages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.25, type: "spring" }}
                          className={`flex ${msg.speaker === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            msg.speaker === "agent"
                              ? "bg-white/10 text-white rounded-tl-sm"
                              : "bg-primary text-white rounded-tr-sm"
                          }`}>
                            {msg.text}
                          </div>
                        </motion.div>
                      ))}
                      {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                          <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                            {[0, 1, 2].map(i => (
                              <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50"
                                animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Options */}
                  <div className="px-4 pb-4 pt-2 border-t border-white/10">
                    <AnimatePresence>
                      {!speaking && !loading && currentOptions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col gap-2"
                        >
                          {currentOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleOption(opt)}
                              className="text-left text-xs font-medium text-white/80 bg-white/5 hover:bg-primary/20 hover:text-white border border-white/10 hover:border-primary/40 rounded-xl px-3.5 py-2.5 transition-all duration-150"
                            >
                              {opt}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Phase: done */}
              {phase === "done" && (
                <div className="px-6 py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <p className="text-white font-bold text-lg mb-2">Booking confirmed!</p>
                  <p className="text-white/50 text-sm mb-6">That&apos;s exactly how your callers experience TimeBookingPro — 24/7.</p>
                  <a
                    href="/#get-started"
                    onClick={close}
                    className="block w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-full py-3 text-sm transition-colors shadow-lg shadow-primary/30 mb-3"
                  >
                    Get your own agent
                  </a>
                  <button onClick={close} className="text-white/40 hover:text-white/70 text-sm transition-colors">
                    Close
                  </button>
                </div>
              )}

              {/* Hang up */}
              {phase === "active" && (
                <div className="px-6 pb-5 text-center">
                  <button
                    onClick={close}
                    className="flex items-center gap-2 text-white/30 hover:text-red-400 text-xs transition-colors mx-auto"
                  >
                    <PhoneOff size={12} /> End demo
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
