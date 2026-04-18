"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { motion } from "framer-motion"
import { CheckCircle, Star, ArrowRight, Clock, Phone, Calendar } from "lucide-react"

const SOCIAL_PROOF = [
  { stat: "500+", label: "businesses onboarded" },
  { stat: "99%",  label: "calls answered instantly" },
  { stat: "<24h", label: "to go live" },
]

const QUOTES = [
  { quote: "CalBliss paid for itself in the first week.", name: "Carlos M.", role: "The Barber Studio" },
  { quote: "The agent sounds completely natural. No one realises it's AI.", name: "Sophie L.", role: "Bloom Beauty Salon" },
]

export default function DemoPage() {
  const [name, setName]       = useState("")
  const [email, setEmail]     = useState("")
  const [business, setBusiness] = useState("")
  const [phone, setPhone]     = useState("")
  const [state, setState]     = useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return
    setState("loading")
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, business, phone }),
      })
      if (res.ok) setState("success")
      else setState("idle")
    } catch {
      setState("idle")
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        {/* Background */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/8 to-transparent -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left — social proof */}
            <motion.div
              className="flex flex-col gap-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Free demo</p>
                <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight leading-[1.1] mb-4">
                  See CalBliss live on your number
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Book a free 20-minute call and we&apos;ll demo the agent answering as your business — live, on the spot.
                </p>
              </div>

              {/* What to expect */}
              <div className="space-y-3">
                {[
                  { icon: Phone, text: "We call your business number and demo the agent live" },
                  { icon: Calendar, text: "You see the booking flow end-to-end in real time" },
                  { icon: Clock, text: "20 minutes — no slides, no fluff, just the product" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={15} className="text-primary" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {SOCIAL_PROOF.map(({ stat, label }) => (
                  <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-2xl font-heading font-extrabold text-primary">{stat}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div className="space-y-3">
                {QUOTES.map(({ quote, name: qName, role }) => (
                  <div key={qName} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-gold text-gold" />)}
                    </div>
                    <p className="text-sm text-foreground italic mb-3">&ldquo;{quote}&rdquo;</p>
                    <p className="text-xs font-semibold text-foreground">{qName} <span className="text-muted-foreground font-normal">· {role}</span></p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              className="lg:sticky lg:top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary via-primary-soft to-primary" />
                <div className="p-7">
                  {state === "success" ? (
                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <CheckCircle size={32} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-xl font-heading font-bold mb-2">Demo request received!</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          We&apos;ll email you a calendar invite within the next 2 hours to confirm your time slot.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-heading font-bold mb-1">Book your free demo</h2>
                      <p className="text-sm text-muted-foreground mb-6">Usually scheduled within the same business day.</p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                          { label: "Your name *", value: name, onChange: setName, type: "text", placeholder: "Jane Smith", required: true },
                          { label: "Work email *", value: email, onChange: setEmail, type: "email", placeholder: "jane@yourbusiness.com", required: true },
                          { label: "Business name", value: business, onChange: setBusiness, type: "text", placeholder: "My Barbershop", required: false },
                          { label: "Business phone", value: phone, onChange: setPhone, type: "tel", placeholder: "+1 (555) 000-0000", required: false },
                        ].map(({ label, value, onChange, type, placeholder, required }) => (
                          <div key={label}>
                            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">{label}</label>
                            <input
                              type={type}
                              required={required}
                              placeholder={placeholder}
                              value={value}
                              onChange={(e) => onChange(e.target.value)}
                              className="w-full rounded-xl px-4 h-11 bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                            />
                          </div>
                        ))}

                        <button
                          type="submit"
                          disabled={state === "loading"}
                          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-full h-12 text-sm shadow-lg shadow-primary/25 transition-colors mt-2"
                        >
                          {state === "loading" ? "Booking…" : "Request my free demo"}
                          {state !== "loading" && <ArrowRight size={16} />}
                        </button>

                        <p className="text-center text-xs text-muted-foreground">
                          Free · No obligation · No slides
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
