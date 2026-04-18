"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"

type Message = { role: "user" | "assistant"; content: string }

const STARTERS = [
  "How much does it cost?",
  "How quickly can I go live?",
  "What calendar systems work?",
  "Does it sound like AI?",
]

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "Hi! I'm here to answer any questions about CalBliss. What would you like to know?",
      }])
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async (text: string) => {
    if (!text.trim() || streaming) return

    const userMsg: Message = { role: "user", content: text.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput("")
    setStreaming(true)

    const assistantMsg: Message = { role: "assistant", content: "" }
    setMessages([...next, assistantMsg])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })

      if (!res.body) throw new Error("No stream")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: "assistant", content: full }
          return updated
        })
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Try emailing us at hello@calbliss.com.",
        }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center transition-all ${open ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <MessageCircle size={22} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-6 right-6 z-[150] w-[340px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden"
            style={{ maxHeight: "min(520px, calc(100vh - 100px))" }}
            initial={{ opacity: 0, scale: 0.9, y: 16, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-primary text-white shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold">CB</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-none">CalBliss</p>
                <p className="text-[11px] text-white/70 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Typically replies instantly
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 min-h-0">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.content || (
                      <span className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Starter chips — show before first user message */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={streaming}
                    className="text-xs text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-full px-3 py-1.5 transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border px-3 py-2.5 flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask anything…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input) } }}
                disabled={streaming}
                className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || streaming}
                className="p-1.5 rounded-full bg-primary text-white disabled:opacity-40 hover:bg-primary/90 transition-colors shrink-0"
                aria-label="Send"
              >
                {streaming ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
