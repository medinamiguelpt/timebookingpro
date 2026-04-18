export const dynamic = "force-static"

const POSTS = [
  {
    slug: "how-barber-studio-booked-40-more-clients",
    title: "How a Barbershop Added 40 Bookings a Month Without Hiring",
    excerpt: "Carlos was losing weekend bookings to voicemail. Six weeks after setting up his CalBliss agent, his Friday and Saturday slots fill by Wednesday.",
    date: "2026-04-10",
  },
  {
    slug: "ai-vs-human-receptionist-real-cost",
    title: "AI Receptionist vs Human: The Real Cost Breakdown for Salons",
    excerpt: "A full-time receptionist costs $28,000–$45,000 a year. An AI agent costs $49/month and works 24/7. We break down what you actually get for each.",
    date: "2026-04-03",
  },
  {
    slug: "five-signs-your-business-needs-voice-ai",
    title: "5 Signs Your Business Is Ready for an AI Voice Agent",
    excerpt: "Missing calls after hours? Staff spending 20 minutes a day on booking calls? These are signals. Here's how to tell if AI can fix them.",
    date: "2026-03-28",
  },
]

const BASE = "https://calbliss.com"

export async function GET() {
  const items = POSTS.map(
    (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${BASE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${p.slug}</guid>
      <description><![CDATA[${p.excerpt}]]></description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`
  ).join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CalBliss Blog</title>
    <link>${BASE}/blog</link>
    <description>Insights, case studies, and guides for small businesses using AI to grow their bookings.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
