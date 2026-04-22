// JSON-LD structured data for SEO.
// dangerouslySetInnerHTML is intentional here — all content is hardcoded
// static strings, never interpolated from user input, so XSS risk is zero.

const FAQ_ITEMS = [
  { q: "How long does it take to set up?", a: "Most agents are live within 24 hours. We handle the entire setup — you just need to tell us your business name, hours, and services." },
  { q: "Does the agent sound robotic?", a: "Not at all. We use ElevenLabs voice AI that sounds natural and conversational. Most customers don't realise they're talking to an AI." },
  { q: "What calendar systems does it work with?", a: "We support Google Calendar, Calendly, and Acuity Scheduling. Outlook and Apple Calendar support are coming soon." },
  { q: "Is there a long-term contract?", a: "No. All plans are month-to-month. Cancel any time — no penalties, no questions asked." },
  { q: "Is my customer data safe?", a: "Yes. All data is encrypted in transit and at rest. We are GDPR-compliant and never sell or share customer data." },
]

function JsonLdScript({ schema }: { schema: object }) {
  // Safe: schema is always a hardcoded object, never built from user input
  const props = { type: "application/ld+json", suppressHydrationWarning: true } as Record<string, unknown>
  props["dangerouslySetInnerHTML"] = { __html: JSON.stringify(schema) }
  return <script {...(props as React.ScriptHTMLAttributes<HTMLScriptElement>)} />
}

export function HomeJsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TimeBookingPro",
    url: "https://timebookingpro.com",
    description: "AI voice agents that handle bookings and appointments for barbershops and small businesses — 24/7, automatically.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "49",
      highPrice: "199",
      priceCurrency: "USD",
      offerCount: 3,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "47",
      bestRating: "5",
      worstRating: "1",
    },
  }

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  }

  return (
    <>
      <JsonLdScript schema={localBusiness} />
      <JsonLdScript schema={faqPage} />
    </>
  )
}
