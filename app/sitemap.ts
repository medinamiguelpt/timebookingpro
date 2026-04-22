import { MetadataRoute } from "next"

const BASE = "https://timebookingpro.com"

const VERTICALS = ["barbershops", "salons", "spas", "dental", "gyms", "restaurants", "clinics", "tattoo"]
const COMPETITORS = ["receptionist", "voicemail", "google-voice", "answering-service"]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,               lastModified: new Date(), changeFrequency: "weekly",  priority: 1 },
    { url: `${BASE}/help`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/demo`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/affiliate`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/partners`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/dashboard`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
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
