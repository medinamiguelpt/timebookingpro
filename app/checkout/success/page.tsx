import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { CheckCircle, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Welcome to CalBliss!", robots: "noindex" }

export default function CheckoutSuccess() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-md w-full text-center">
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

          <div className="rounded-2xl border border-border bg-card p-6 mb-8 text-left space-y-3">
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

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Back to CalBliss
            <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    </>
  )
}
