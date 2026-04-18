import { headers } from "next/headers"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { TrustBar } from "@/components/sections/trust-bar"
import { TechStrip } from "@/components/sections/tech-strip"
import { HowItWorks } from "@/components/sections/how-it-works"
import { AgentNamer } from "@/components/sections/agent-namer"
import { Features } from "@/components/sections/features"
import { BeforeAfter } from "@/components/sections/before-after"
import { ForWho } from "@/components/sections/for-who"
import { Pricing } from "@/components/sections/pricing"
import { Testimonials } from "@/components/sections/testimonials"
import { StatsBar } from "@/components/sections/stats-bar"
import { Calculator } from "@/components/sections/calculator"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"
import { StickyCTA } from "@/components/ui/sticky-cta"
import { DemoModal } from "@/components/ui/demo-modal"
import { ExitIntent } from "@/components/ui/exit-intent"
import { HomeJsonLd } from "@/components/seo/json-ld"

export default async function Home() {
  const headersList = await headers()
  const variant = (headersList.get("x-variant") ?? "a") as "a" | "b"

  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero variant={variant} />
        <TrustBar />
        <TechStrip />
        <HowItWorks />
        <AgentNamer />
        <Features />
        <BeforeAfter />
        <ForWho />
        <Pricing />
        <Testimonials />
        <StatsBar />
        <Calculator />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyCTA />
      <DemoModal />
      <ExitIntent />
      <HomeJsonLd />
    </>
  )
}
