import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { CheckCircle, ArrowRight, ExternalLink, LayoutDashboard } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Welcome to CalBliss!", robots: "noindex" }

export default function CheckoutSuccess() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-16 pb-20">
        <div className="max-w-lg w-full text-center">
          {/* Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[100px] -z-10 pointer-events-none" />

          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>

          <h1 className="text-3xl font-heading font-extrabold tracking-tight mb-3">
            You&apos;re in! Welcome to CalBliss.
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Your subscription is confirmed. We&apos;ll email you within the next few hours to schedule your setup call — your agent will be live within 24 hours.
          </p>

          {/* Next steps */}
          <div className="rounded-2xl border border-border bg-card p-6 mb-5 text-left space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">What happens next</p>
            {[
              { step: "1", text: "Check your email — setup instructions are on their way" },
              { step: "2", text: "We'll schedule a 15-min onboarding call at your convenience" },
              { step: "3", text: "Your AI agent goes live — answering calls from day one" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {step}
                </span>
                <p className="text-sm text-foreground">{text}</p>
              </div>
            ))}
          </div>

          {/* Google Business Profile */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 mb-8 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-base">📍</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Connect your Google Business Profile</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Add your CalBliss phone number as your GBP booking number so customers who find you on Google can book instantly.
                </p>
                <a
                  href="https://business.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Open Google Business <ExternalLink size={11} />
                </a>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Your CalBliss number will be in your setup email — add it under &quot;Phone&quot; in your GBP profile.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-colors shadow-lg shadow-primary/25"
            >
              <LayoutDashboard size={14} /> View your dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Back to CalBliss <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
