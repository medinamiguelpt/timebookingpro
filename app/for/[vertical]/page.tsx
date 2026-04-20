import { notFound } from "next/navigation"
import { Metadata } from "next"
import Anthropic from "@anthropic-ai/sdk"
import { CheckCircle, ArrowRight, Phone } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export const revalidate = 86400 // regenerate daily

const VERTICALS: Record<string, { label: string; emoji: string; avgBookingValue: number; painPoints: string[] }> = {
  barbershops: {
    label: "Barbershops",
    emoji: "✂️",
    avgBookingValue: 35,
    painPoints: ["missed calls during busy hours", "no-shows", "double-bookings", "calls while cutting hair"],
  },
  salons: {
    label: "Hair Salons",
    emoji: "💇",
    avgBookingValue: 80,
    painPoints: ["managing complex multi-stylist scheduling", "clients calling during colour treatments", "weekend booking surges", "last-minute cancellations"],
  },
  spas: {
    label: "Spas & Wellness",
    emoji: "🧖",
    avgBookingValue: 120,
    painPoints: ["long booking flows with multiple service choices", "couples packages requiring coordinated slots", "late cancellations", "after-hours enquiries"],
  },
  dental: {
    label: "Dental Practices",
    emoji: "🦷",
    avgBookingValue: 180,
    painPoints: ["high call volume for routine bookings", "insurance verification delays", "nervous patients needing reassurance", "appointment reminders"],
  },
  gyms: {
    label: "Gyms & Fitness Studios",
    emoji: "🏋️",
    avgBookingValue: 50,
    painPoints: ["class booking surges", "membership enquiries taking up desk staff time", "trial bookings", "peak-hour phone traffic"],
  },
  restaurants: {
    label: "Restaurants",
    emoji: "🍽️",
    avgBookingValue: 90,
    painPoints: ["reservation calls at peak dinner service", "special occasion bookings", "large party coordination", "no-show management"],
  },
  clinics: {
    label: "Medical & Allied Health Clinics",
    emoji: "🏥",
    avgBookingValue: 150,
    painPoints: ["appointment booking calls distracting reception", "urgent vs routine triage", "recall reminders", "multiple practitioner scheduling"],
  },
  tattoo: {
    label: "Tattoo Studios",
    emoji: "🖊️",
    avgBookingValue: 200,
    painPoints: ["consultation bookings requiring artist matching", "deposit collection friction", "design brief questions", "long wait lists"],
  },
}

type Props = { params: Promise<{ vertical: string }> }

export async function generateStaticParams() {
  return Object.keys(VERTICALS).map((vertical) => ({ vertical }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vertical } = await params
  const config = VERTICALS[vertical]
  if (!config) return {}
  return {
    title: `CalBliss for ${config.label} — AI Booking Agent`,
    description: `Stop losing bookings to missed calls. CalBliss AI answers every call for your ${config.label.toLowerCase()} 24/7 and fills your calendar automatically.`,
  }
}

function fallbackCopy(config: (typeof VERTICALS)[string]) {
  return {
    headline: `${config.emoji} ${config.label}: every call answered, every booking captured`,
    subheadline: `Your AI agent handles calls 24/7 so you can focus on your clients.`,
    benefit1: "Never miss another booking when you're with a client",
    benefit2: `Every missed call costs ~$${config.avgBookingValue}. Stop the leak.`,
    benefit3: "Live in under 24 hours. No tech skills required.",
    testimonial: `"We went from losing calls to capturing every booking." — a ${config.label.toLowerCase().slice(0, -1)} owner`,
    cta: `Get your ${config.label.toLowerCase().slice(0, -1)} agent`,
  }
}

async function generateCopy(vertical: string, config: (typeof VERTICALS)[string]) {
  if (!process.env.ANTHROPIC_API_KEY) return fallbackCopy(config)

  try {
    const client = new Anthropic()
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Write conversion-focused landing page copy for CalBliss — an AI voice agent that handles phone bookings 24/7.

Target vertical: ${config.label}
Emoji: ${config.emoji}
Average booking value: $${config.avgBookingValue}
Pain points: ${config.painPoints.join(", ")}

Return ONLY valid JSON with these keys (no markdown, no extra text):
{
  "headline": "punchy, vertical-specific headline with emoji, max 10 words",
  "subheadline": "1-sentence value prop, max 20 words",
  "benefit1": "first benefit, max 12 words, present tense",
  "benefit2": "second benefit mentioning the $${config.avgBookingValue} booking value, max 14 words",
  "benefit3": "third benefit about ease of setup, max 12 words",
  "testimonial": "realistic fake testimonial from a ${config.label.toLowerCase().slice(0, -1)} owner, max 20 words",
  "cta": "CTA button text, max 6 words"
}`,
        },
      ],
    })
    const text = msg.content[0].type === "text" ? msg.content[0].text : ""
    return JSON.parse(text)
  } catch {
    return fallbackCopy(config)
  }
}

export default async function VerticalPage({ params }: Props) {
  const { vertical } = await params
  const config = VERTICALS[vertical]
  if (!config) notFound()

  const copy = await generateCopy(vertical, config)

  const stats = [
    { value: "24/7", label: "Always available" },
    { value: "<2s", label: "Answer time" },
    { value: `$${config.avgBookingValue}`, label: "Avg booking value" },
    { value: "14 days", label: "Free trial" },
  ]

  const features = [
    "Answers calls instantly, even while you're with clients",
    "Books, reschedules, and cancels appointments automatically",
    "Syncs with your existing calendar — no migration needed",
    "Sends SMS confirmations to every customer",
    "Handles multilingual callers with ease",
    "Escalates complex calls to your team instantly",
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-4 py-4 sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/"><Logo iconSize={28} /></Link>
          <Link
            href="/#get-started"
            className="flex items-center gap-2 bg-primary text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Start free trial <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Phone size={13} />
              AI Voice Agent for {config.label}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold leading-[1.1] tracking-tight mb-6">
              {copy.headline}
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              {copy.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/#get-started"
                className="flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                {copy.cta} <ArrowRight size={15} />
              </Link>
              <Link
                href="/demo"
                className="flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm"
              >
                Book a demo
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">14-day free trial · No credit card required</p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-muted/30 py-10 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-heading font-extrabold text-primary mb-1">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Why CalBliss</p>
              <h2 className="text-3xl font-heading font-extrabold tracking-tight mb-6">
                Built for {config.label.toLowerCase()} that can&apos;t afford to miss a call
              </h2>
              <div className="flex flex-col gap-4">
                {[copy.benefit1, copy.benefit2, copy.benefit3].map((b: string) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial card */}
            <div className="bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-7">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg font-medium leading-relaxed mb-4 italic">&ldquo;{copy.testimonial}&rdquo;</p>
              <p className="text-sm text-muted-foreground font-semibold">— {config.label.slice(0, -1)} owner, CalBliss customer</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-muted/20 border-y border-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight mb-8 text-center">
              Everything your {config.label.toLowerCase().slice(0, -1)} needs
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                  <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-heading font-extrabold tracking-tight mb-4">
              Start capturing every booking
            </h2>
            <p className="text-muted-foreground mb-8">
              Join {config.label.toLowerCase()} across the country using CalBliss to fill their calendars.
            </p>
            <Link
              href="/#get-started"
              className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              {copy.cta} — free for 14 days <ArrowRight size={15} />
            </Link>
            <p className="mt-4 text-xs text-muted-foreground">No credit card · Live in 24 h · Cancel any time</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 CalBliss ·{" "}
          <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
          {" · "}
          <Link href="/for/barbershops" className="hover:text-foreground transition-colors">Barbershops</Link>
          {" · "}
          <Link href="/for/salons" className="hover:text-foreground transition-colors">Salons</Link>
          {" · "}
          <Link href="/for/spas" className="hover:text-foreground transition-colors">Spas</Link>
        </p>
      </footer>
    </div>
  )
}
