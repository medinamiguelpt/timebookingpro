import { Metadata } from "next"
import { CheckCircle, ArrowRight, Users, TrendingUp, DollarSign, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Partner Programme — CalBliss",
  description: "Resell CalBliss to your clients and earn up to 30% recurring commission. Built for marketing agencies, consultants, and business advisors.",
}

const TIERS = [
  {
    name: "Affiliate",
    commission: "20%",
    description: "For freelancers and individuals recommending CalBliss.",
    perks: [
      "20% recurring commission",
      "Unique referral link",
      "Monthly payouts",
      "Partner dashboard",
    ],
    cta: "Get your link",
    href: "/affiliate",
    highlighted: false,
  },
  {
    name: "Reseller",
    commission: "25%",
    description: "For agencies billing clients on your behalf.",
    perks: [
      "25% recurring commission",
      "White-label invoicing",
      "Manage multiple client accounts",
      "Priority partner support",
      "Co-branded materials",
    ],
    cta: "Apply now",
    href: "mailto:partners@calbliss.com?subject=Reseller%20Partner%20Application",
    highlighted: true,
  },
  {
    name: "Strategic",
    commission: "30%",
    description: "For large agencies and franchise networks with 10+ clients.",
    perks: [
      "30% recurring commission",
      "Fully white-label product",
      "Custom pricing & bundles",
      "Dedicated partner manager",
      "Co-marketing opportunities",
      "Early access to new features",
    ],
    cta: "Let's talk",
    href: "mailto:partners@calbliss.com?subject=Strategic%20Partner%20Enquiry",
    highlighted: false,
  },
]

const BENEFITS = [
  { icon: DollarSign, title: "Recurring income", desc: "Earn every month for as long as your client stays — no caps, no cliffs." },
  { icon: Zap, title: "Fast onboarding", desc: "New clients go live in under 24 hours. Your reputation stays intact." },
  { icon: Shield, title: "You stay in control", desc: "Manage all your client accounts from one dashboard." },
  { icon: Globe, title: "Any industry", desc: "CalBliss works for barbershops, salons, clinics, restaurants, and more." },
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-4 py-4 sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/"><Logo iconSize={28} /></Link>
          <Link
            href="mailto:partners@calbliss.com"
            className="flex items-center gap-2 bg-primary text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Talk to us <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-3xl mx-auto relative">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Users size={13} /> Partner Programme
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold leading-[1.1] tracking-tight mb-6">
              Build a recurring revenue stream recommending CalBliss
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              Earn up to 30% recurring commission for every business you bring on. No caps, no expiry.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/affiliate"
                className="flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Get your referral link <ArrowRight size={15} />
              </a>
              <a
                href="mailto:partners@calbliss.com"
                className="flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm"
              >
                Talk to the team
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-muted/30 py-10 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "30%", label: "Max commission rate" },
              { value: "$0", label: "Cost to join" },
              { value: "Monthly", label: "Payout schedule" },
              { value: "Forever", label: "Recurring duration" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-heading font-extrabold text-primary mb-1">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why partner */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary text-center mb-3">Why partner with us</p>
            <h2 className="text-2xl font-heading font-extrabold text-center mb-10">Built for agencies that care about client results</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card border border-border rounded-2xl p-6 flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tiers */}
        <section className="py-16 px-4 bg-muted/20 border-y border-border">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-heading font-extrabold text-center mb-10">Choose your tier</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {TIERS.map(({ name, commission, description, perks, cta, href, highlighted }) => (
                <div
                  key={name}
                  className={`relative rounded-2xl border p-7 flex flex-col gap-5 ${
                    highlighted
                      ? "border-primary/60 bg-gradient-to-b from-primary/10 to-primary/5 shadow-2xl shadow-primary/15 ring-1 ring-primary/20 md:scale-[1.02]"
                      : "border-border bg-card"
                  }`}
                >
                  {highlighted && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg shadow-primary/30">
                      Most popular
                    </span>
                  )}
                  <div>
                    <p className="font-heading font-bold text-lg mb-1">{name}</p>
                    <p className="text-muted-foreground text-sm">{description}</p>
                  </div>
                  <p className="text-4xl font-heading font-extrabold text-primary">{commission}<span className="text-base font-normal text-muted-foreground"> recurring</span></p>
                  <ul className="flex-1 space-y-2.5">
                    {perks.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={href}
                    className={`text-center rounded-full font-semibold py-2.5 text-sm transition-colors ${
                      highlighted
                        ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                        : "border-2 border-border hover:border-primary/40 hover:bg-primary/5 text-foreground"
                    }`}
                  >
                    {cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-heading font-extrabold text-center mb-10">Common questions</h2>
            <div className="flex flex-col gap-5">
              {[
                { q: "When do I get paid?", a: "Commissions are paid on the 1st of each month via Stripe. Minimum payout is $50." },
                { q: "How long does commission last?", a: "Forever — as long as your referred client keeps their subscription, you keep earning." },
                { q: "Can I upgrade my tier?", a: "Yes. As you grow your client base, we'll automatically upgrade your tier and commission rate." },
                { q: "Do my clients know I'm earning commission?", a: "That's up to you. We provide transparent pricing to clients and don't disclose partner rates by default." },
              ].map(({ q, a }) => (
                <div key={q} className="border border-border rounded-xl p-5">
                  <p className="font-semibold text-sm mb-2">{q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 text-center">
          <h2 className="text-2xl font-heading font-extrabold mb-4">Ready to start earning?</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Join the programme today. Get your referral link in seconds.
          </p>
          <a
            href="/affiliate"
            className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-8 py-3.5 font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Get your link now <ArrowRight size={15} />
          </a>
          <p className="mt-3 text-xs text-muted-foreground">No application required for Affiliate tier</p>
        </section>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 CalBliss · <a href="mailto:partners@calbliss.com" className="hover:text-foreground transition-colors">partners@calbliss.com</a>
        </p>
      </footer>
    </div>
  )
}
