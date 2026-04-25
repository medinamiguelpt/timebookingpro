import { headers } from "next/headers"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { pickFromPool, type SectionKey } from "@/lib/taglines"
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
import { FinalCTA } from "@/components/sections/final-cta"
import { HomeJsonLd } from "@/components/seo/json-ld"
import { WaveDivider } from "@/components/ui/wave-divider"

export default async function Home(
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params
  setRequestLocale(locale)

  const headersList = await headers()
  const variant = (headersList.get("x-variant") ?? "a") as "a" | "b"

  const t = await getTranslations({ locale })
  const taglines = t.raw("taglines") as Record<SectionKey, string[]>
  const pick = (section: SectionKey) => pickFromPool(taglines[section])

  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero variant={variant} />
        <TechStrip />
        <HowItWorks  headline={pick("howItWorks")} />
        <AgentNamer  headline={pick("agentNamer")} />
        <WaveDivider opacity={0.5} />
        <Features    headline={pick("features")} />
        <BeforeAfter headline={pick("beforeAfter")} />
        <WaveDivider opacity={0.6} flip />
        <ForWho      headline={pick("forWho")} />
        <Pricing     headline={pick("pricing")} />
        <FinalCTA    headline={pick("finalCta")} />
      </main>
      <Footer />
      <HomeJsonLd />
    </>
  )
}
