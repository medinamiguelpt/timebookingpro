import { MetadataRoute } from "next"

const BASE = "https://calbliss.com"

const BLOG_SLUGS = [
  { slug: "how-barber-studio-booked-40-more-clients", date: "2026-04-10" },
  { slug: "ai-vs-human-receptionist-real-cost",        date: "2026-04-03" },
  { slug: "five-signs-your-business-needs-voice-ai",   date: "2026-03-28" },
]

const VERTICALS = ["barbershops", "salons", "spas", "dental", "gyms", "restaurants", "clinics", "tattoo"]
const COMPETITORS = ["receptionist", "voicemail", "google-voice", "answering-service"]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,               lastModified: new Date(), changeFrequency: "weekly",  priority: 1 },
    { url: `${BASE}/blog`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/help`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/demo`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/affiliate`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...BLOG_SLUGS.map(({ slug, date }) => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: new Date(date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...VERTICALS.map((v) => ({
      url: `${BASE}/for/${v}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...COMPETITORS.map((c) => ({
      url: `${BASE}/vs/${c}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
