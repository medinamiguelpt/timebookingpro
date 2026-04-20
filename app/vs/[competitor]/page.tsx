import { notFound } from "next/navigation"
import { Metadata } from "next"
import { CheckCircle, X, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export const dynamic = "force-static"

type CompRow = { feature: string; calbliss: string | true | false; them: string | true | false }

type CompConfig = {
  label: string
  tagline: string
  headline: string
  subheadline: string
  monthlyPrice: string
  weaknesses: string[]
  rows: CompRow[]
  verdict: string
}

const COMPETITORS: Record<string, CompConfig> = {
  receptionist: {
    label: "a Human Receptionist",
    tagline: "vs. Human Receptionist",
    headline: "AI answers every call for $49/mo. Your receptionist costs $3,500/mo.",
    subheadline: "CalBliss handles bookings 24/7 with zero sick days, zero lunch breaks, and zero missed calls.",
    monthlyPrice: "~$3,500",
    weaknesses: ["Only works office hours", "Gets sick, takes holidays", "Can't handle call surges", "Costs 70× more"],
    rows: [
      { feature: "Answers calls 24/7", calbliss: true, them: false },
      { feature: "Handles call surges simultaneously", calbliss: true, them: false },
      { feature: "Never takes lunch or sick days", calbliss: true, them: false },
      { feature: "Monthly cost", calbliss: "From $49/mo", them: "~$3,500/mo" },
      { feature: "Setup time", calbliss: "< 24 hours", them: "2–4 weeks" },
      { feature: "Speaks multiple languages", calbliss: true, them: "Rarely" },
      { feature: "Scales with call volume", calbliss: true, them: false },
      { feature: "SMS booking confirmations", calbliss: true, them: false },
      { feature: "Analytics dashboard", calbliss: true, them: false },
      { feature: "Zero training required", calbliss: true, them: false },
    ],
    verdict: "For most small businesses, a human receptionist is the most expensive way to handle bookings. CalBliss gives you better coverage at a fraction of the cost.",
  },
  voicemail: {
    label: "Voicemail",
    tagline: "vs. Voicemail",
    headline: "Voicemail loses you bookings. CalBliss captures every one.",
    subheadline: "78% of callers who reach voicemail don't leave a message — they call your competitor instead.",
    monthlyPrice: "$0",
    weaknesses: ["78% of callers hang up", "No real-time booking", "Manual callback required", "Zero after-hours revenue"],
    rows: [
      { feature: "Books appointments in real time", calbliss: true, them: false },
      { feature: "Caller hangs up rate", calbliss: "< 5%", them: "~78%" },
      { feature: "After-hours booking capture", calbliss: true, them: false },
      { feature: "SMS booking confirmation", calbliss: true, them: false },
      { feature: "No callback required", calbliss: true, them: false },
      { feature: "Calendar integration", calbliss: true, them: false },
      { feature: "Handles reschedules", calbliss: true, them: false },
      { feature: "Monthly cost", calbliss: "From $49/mo", them: "$0 (but loses bookings)" },
      { feature: "ROI positive", calbliss: "Yes", them: "No" },
    ],
    verdict: "Voicemail feels free, but every unanswered call is lost revenue. One captured booking per day pays for CalBliss many times over.",
  },
  "google-voice": {
    label: "Google Voice",
    tagline: "vs. Google Voice",
    headline: "Google Voice forwards calls. CalBliss books appointments.",
    subheadline: "Forwarding is just moving the problem. CalBliss solves it — the AI handles the whole conversation.",
    monthlyPrice: "$0–$10",
    weaknesses: ["Just a call-forwarding tool", "Still requires you to answer", "No booking capability", "No calendar integration"],
    rows: [
      { feature: "Books appointments autonomously", calbliss: true, them: false },
      { feature: "Works when you're unavailable", calbliss: true, them: false },
      { feature: "Real-time calendar integration", calbliss: true, them: false },
      { feature: "Sends SMS confirmations", calbliss: true, them: false },
      { feature: "Analytics on call outcomes", calbliss: true, them: false },
      { feature: "No human needed to answer", calbliss: true, them: false },
      { feature: "Purpose-built for bookings", calbliss: true, them: false },
      { feature: "Monthly cost", calbliss: "From $49/mo", them: "$0–$10/mo" },
      { feature: "Actually reduces your workload", calbliss: true, them: false },
    ],
    verdict: "Google Voice is a phone tool, not a booking system. CalBliss is the complete solution — it answers, books, confirms, and syncs, all without you lifting a finger.",
  },
  "answering-service": {
    label: "an Answering Service",
    tagline: "vs. Answering Service",
    headline: "Answering services take messages. CalBliss makes bookings.",
    subheadline: "You're still paying a premium for a human who can't actually book — they just take a note and hope you call back.",
    monthlyPrice: "$200–$500",
    weaknesses: ["Takes messages, doesn't book", "High per-minute costs", "Quality varies by agent", "Still needs your follow-up"],
    rows: [
      { feature: "Books the appointment on the call", calbliss: true, them: false },
      { feature: "No per-minute fees", calbliss: true, them: false },
      { feature: "Consistent quality on every call", calbliss: true, them: false },
      { feature: "Real-time calendar access", calbliss: true, them: false },
      { feature: "No follow-up callback needed", calbliss: true, them: false },
      { feature: "Available 24/7 with no surcharge", calbliss: true, them: "Extra cost" },
      { feature: "Monthly cost", calbliss: "From $49/mo", them: "$200–$500+/mo" },
      { feature: "Setup time", calbliss: "< 24 hours", them: "1–2 weeks" },
      { feature: "ROI positive", calbliss: "Yes", them: "Often marginal" },
    ],
    verdict: "Answering services solve the 'someone answered' problem but not the 'the booking was made' problem. CalBliss solves both, for less.",
  },
}

type Props = { params: Promise<{ competitor: string }> }

export async function generateStaticParams() {
  return Object.keys(COMPETITORS).map((competitor) => ({ competitor }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor } = await params
  const config = COMPETITORS[competitor]
  if (!config) return {}
  return {
    title: `CalBliss vs ${config.label} — AI Booking Agent Comparison`,
    description: config.subheadline,
  }
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <CheckCircle size={18} className="text-green-500 mx-auto" />
  if (value === false) return <X size={18} className="text-red-400 mx-auto" />
  return <span className="text-sm font-medium">{value}</span>
}

export default async function VsPage({ params }: Props) {
  const { competitor } = await params
  const config = COMPETITORS[competitor]
  if (!config) notFound()

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
        <section className="py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-3xl mx-auto relative">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Zap size={13} />
              CalBliss {config.tagline}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight mb-5">
              {config.headline}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              {config.subheadline}
            </p>
            <Link
              href="/#get-started"
              className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Try CalBliss free for 14 days <ArrowRight size={15} />
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">No credit card required</p>
          </div>
        </section>

        {/* Pain points */}
        <section className="py-12 px-4 bg-muted/20 border-y border-border">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8">
              The problem with {config.label}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {config.weaknesses.map((w) => (
                <div key={w} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                  <X size={16} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm">{w}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-heading font-extrabold tracking-tight text-center mb-10">
              Feature comparison
            </h2>
            <div className="border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-4 font-semibold text-muted-foreground w-1/2">Feature</th>
                    <th className="text-center px-5 py-4 w-1/4">
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-bold">
                        ✦ CalBliss
                      </span>
                    </th>
                    <th className="text-center px-5 py-4 w-1/4 text-muted-foreground font-medium text-xs">
                      {config.label}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {config.rows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                    >
                      <td className="px-5 py-3.5 font-medium">{row.feature}</td>
                      <td className="px-5 py-3.5 text-center">
                        <Cell value={row.calbliss} />
                      </td>
                      <td className="px-5 py-3.5 text-center text-muted-foreground">
                        <Cell value={row.them} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Verdict */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">The verdict</p>
            <p className="text-base leading-relaxed text-muted-foreground">{config.verdict}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 text-center">
          <h2 className="text-2xl font-heading font-extrabold mb-4">
            Make the switch today
          </h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            14-day free trial. No credit card. Live in under 24 hours.
          </p>
          <Link
            href="/#get-started"
            className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Get started free <ArrowRight size={15} />
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 CalBliss ·{" "}
          <Link href="/vs/receptionist" className="hover:text-foreground transition-colors">vs. Receptionist</Link>
          {" · "}
          <Link href="/vs/voicemail" className="hover:text-foreground transition-colors">vs. Voicemail</Link>
          {" · "}
          <Link href="/vs/answering-service" className="hover:text-foreground transition-colors">vs. Answering Service</Link>
        </p>
      </footer>
    </div>
  )
}
