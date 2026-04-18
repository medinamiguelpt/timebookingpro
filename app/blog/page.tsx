import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog — CalBliss",
  description: "Insights, case studies, and guides for small businesses using AI to grow their bookings.",
  alternates: {
    types: { "application/rss+xml": "https://calbliss.com/blog/feed.xml" },
  },
}

const POSTS = [
  {
    slug: "how-barber-studio-booked-40-more-clients",
    title: "How a Barbershop Added 40 Bookings a Month Without Hiring",
    excerpt:
      "Carlos was losing weekend bookings to voicemail. Six weeks after setting up his CalBliss agent, his Friday and Saturday slots fill by Wednesday. Here's exactly what changed.",
    category: "Case Study",
    date: "April 10, 2026",
    readTime: "4 min read",
    color: "from-violet-500/15 to-purple-500/5",
  },
  {
    slug: "ai-vs-human-receptionist-real-cost",
    title: "AI Receptionist vs Human: The Real Cost Breakdown for Salons",
    excerpt:
      "A full-time receptionist costs $28,000–$45,000 a year in the US. An AI agent costs $49/month and works 24/7. We break down what you actually get for each.",
    category: "Guide",
    date: "April 3, 2026",
    readTime: "6 min read",
    color: "from-blue-500/15 to-cyan-500/5",
  },
  {
    slug: "five-signs-your-business-needs-voice-ai",
    title: "5 Signs Your Business Is Ready for an AI Voice Agent",
    excerpt:
      "Missing calls after hours? Staff spending 20 minutes a day on booking calls? These are signals — not inconveniences. Here's how to tell if AI can fix them.",
    category: "Insights",
    date: "March 28, 2026",
    readTime: "5 min read",
    color: "from-emerald-500/15 to-teal-500/5",
  },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        <div className="mb-12 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Blog</p>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight leading-tight mb-4">
              Insights & Case Studies
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Real stories and practical guides for independent businesses growing with AI.
            </p>
          </div>
          <a
            href="/blog/feed.xml"
            className="shrink-0 flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 px-3 py-2 rounded-full transition-colors mt-1"
            title="RSS feed"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>
            RSS
          </a>
        </div>

        <div className="flex flex-col gap-6">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="relative p-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className="text-xs text-muted-foreground">· {post.readTime}</span>
                </div>
                <h2 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                <p className="mt-4 text-sm font-semibold text-primary">Read article →</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
