import { headers } from "next/headers"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { TechStrip } from "@/components/sections/tech-strip"
import { HowItWorks } from "@/components/sections/how-it-works"
import { AgentNamer } from "@/components/sections/agent-namer"
import { Features } from "@/components/sections/features"
import { BeforeAfter } from "@/components/sections/before-after"
import { ForWho } from "@/components/sections/for-who"
import { Pricing } from "@/components/sections/pricing"
import { Calculator } from "@/components/sections/calculator"
import { FAQ } from "@/components/sections/faq"
import { FinalCTA } from "@/components/sections/final-cta"
import { StickyCTA } from "@/components/ui/sticky-cta"
import { DemoModal } from "@/components/ui/demo-modal"
import { HomeJsonLd } from "@/components/seo/json-ld"
import { WaveDivider } from "@/components/ui/wave-divider"

export default async function Home() {
  const headersList = await headers()
  const variant = (headersList.get("x-variant") ?? "a") as "a" | "b"

  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero variant={variant} />
        <TechStrip />
        <HowItWorks />
        <AgentNamer />
        <WaveDivider opacity={0.5} />
        <Features />
        <BeforeAfter />
        <WaveDivider opacity={0.6} flip />
        <ForWho />
        <Pricing />
        <WaveDivider opacity={0.5} />
        <Calculator />
        <FAQ />
        <FinalCTA />
        <StickyCTA />
      </main>
      <Footer />
      <DemoModal />
      <HomeJsonLd />
    </>
  )
}
