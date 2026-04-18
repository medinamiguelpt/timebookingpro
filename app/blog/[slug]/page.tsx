import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { BlogPostJsonLd } from "@/components/seo/json-ld"
import type { Metadata } from "next"

const POSTS: Record<string, {
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  content: string
}> = {
  "how-barber-studio-booked-40-more-clients": {
    title: "How a Barbershop Added 40 Bookings a Month Without Hiring",
    excerpt: "Carlos was losing weekend bookings to voicemail. Six weeks after setting up his CalBliss agent, his Friday and Saturday slots fill by Wednesday.",
    date: "April 10, 2026",
    readTime: "4 min read",
    category: "Case Study",
    content: `
Carlos M. has run The Barber Studio in Austin for eight years. He's good at what he does — his regulars drive forty minutes to see him. His problem wasn't the work. It was the phone.

"I'd miss four or five calls on a busy Saturday," he told us. "By the time I listened to the voicemails and called back, half those people had already booked somewhere else."

**The setup took less than a day.**

We built Carlos a voice agent named "Jay" — trained on his exact services, prices, hours, and his two staff members' individual schedules. Jay handles calls in English and Spanish, confirms bookings via text, and sends reminders 24 hours before each appointment.

Carlos didn't change anything else. Same location, same team, same prices.

**Six weeks later:**

- **+40 bookings per month** compared to the same period last year
- Friday and Saturday slots now fill by Wednesday evening
- Zero missed calls outside business hours
- One staff member freed up from ~45 minutes of daily phone admin

"The agent sounds completely professional," Carlos said. "I had a client ask who the new girl was. I had to explain it was AI."

The math is simple: at an average ticket of $35, 40 extra bookings is $1,400 in recovered monthly revenue — against a $49/month plan. That's a 28x return.

**What made the difference?**

The biggest unlock wasn't the AI itself — it was the *availability*. Most missed bookings happen after 6 PM and on weekends, when small business owners are either with customers or offline. Jay is always on.

The second unlock was speed. A caller who gets voicemail leaves. A caller who gets an immediate, friendly response books. It's that simple.

---

*If you're running a barbershop, salon, or similar appointment-based business and losing bookings to voicemail, [get your agent here](/). Setup takes under 24 hours.*
    `.trim(),
  },

  "ai-vs-human-receptionist-real-cost": {
    title: "AI Receptionist vs Human: The Real Cost Breakdown for Salons",
    excerpt: "A full-time receptionist costs $28,000–$45,000 a year in the US. An AI agent costs $49/month. We break down what you actually get for each.",
    date: "April 3, 2026",
    readTime: "6 min read",
    category: "Guide",
    content: `
If you've been thinking about hiring a receptionist to manage bookings and calls, you should first understand the true cost — and compare it honestly against the alternative.

**The real cost of a human receptionist**

The base salary for a front-desk receptionist at a salon or barbershop in the US runs $14–$20/hour, or roughly $28,000–$40,000 annually for full-time.

But salary is the floor, not the ceiling:

| Cost item | Annual estimate |
|-----------|----------------|
| Base salary | $28,000 – $40,000 |
| Payroll taxes (employer side) | $2,500 – $4,000 |
| Health insurance (if offered) | $3,000 – $6,000 |
| Paid time off (10 days) | $1,100 – $1,500 |
| Training & onboarding | $500 – $1,500 |
| **Total** | **$35,000 – $53,000** |

And that's before you account for turnover. The average receptionist tenure at a small business is 14 months. Replacing someone costs 20–30% of their annual salary in recruiting and lost productivity.

**What you actually get: coverage gaps**

A human receptionist works 8-hour days, 5 days a week. That's 40 hours out of 168 in a week — 24% coverage. The other 76% of the time, your calls go to voicemail.

Studies on appointment-based businesses show that **62% of callers who reach voicemail don't call back**. They book with a competitor.

**The AI alternative**

An AI voice agent from CalBliss costs $49–$199/month depending on your call volume. That's $588–$2,388/year.

What it does:
- Answers calls 24/7/365 — 100% coverage
- Books, reschedules, and cancels appointments
- Handles multiple simultaneous calls (no hold music)
- Sends confirmation texts
- Never calls in sick, takes lunch, or has a bad day

What it doesn't do:
- Greet walk-in customers at the door
- Handle complex complaints requiring human judgment
- Build personal relationships with your regulars (though it can remember preferences)

**The honest verdict**

If your reception desk does more than answer phones — if you need someone checking in walk-ins, managing inventory, or handling complex situations face-to-face — a human may still be the right call.

But if your primary need is **capturing bookings from phone calls**, the math is difficult to argue with: an AI agent at 1/20th the cost with 4x the availability.

Most of our customers don't replace their human staff. They prevent the first hire — or free up an existing team member to focus on in-person service.

---

*See how CalBliss compares for your specific situation — [book a free 20-minute demo](/).*
    `.trim(),
  },

  "five-signs-your-business-needs-voice-ai": {
    title: "5 Signs Your Business Is Ready for an AI Voice Agent",
    excerpt: "Missing calls after hours? Staff spending 20 minutes a day on booking calls? These are signals — not inconveniences.",
    date: "March 28, 2026",
    readTime: "5 min read",
    category: "Insights",
    content: `
Most business owners don't know how much they're losing to missed calls. It's invisible revenue — bookings that never happened, customers who didn't leave a voicemail, money that went to a competitor down the street.

Here are five signs you're ready for a voice AI — and what to do about it.

**1. You're missing calls during peak hours**

If you're a one-person shop, or your team is busy with customers, the phone goes unanswered. That's not a staffing problem — it's a systems problem. Peak hours are when people *want* to book, which means missing those calls is the most expensive thing that can happen to your calendar.

An AI agent handles simultaneous calls during your busiest periods without any degradation in quality.

**2. You have calls after 6 PM**

People search for services and pick up the phone whenever they have time — not when you're open. Late evenings and weekends are your biggest booking opportunity precisely because that's when your competitors also have their phones off.

An AI agent never goes home.

**3. Your staff spends 20+ minutes a day on booking calls**

A booking call takes 2–4 minutes. If you're doing 10–15 per day, that's 20–60 minutes of skilled labour going into something a machine can do perfectly. That time would be better spent on the customer in front of them.

Track it for one week. You might be surprised.

**4. You've had no-shows from "confirmed" bookings**

No-show rates for appointment-based businesses average 15–20%. Most of those are forgetting, not intent. Automated reminders sent 24 hours and 2 hours before the appointment cut no-show rates by up to 50% in our customer data.

An AI agent can send those reminders automatically — and reschedule if needed.

**5. You've said "I need to hire someone just to answer the phone"**

This is the clearest sign. If you've felt the need to hire a person specifically for call-handling, that role can almost certainly be handled by AI at a fraction of the cost — freeing your budget for hires that actually require human presence.

---

**What to do next**

If three or more of these apply to your business, you're leaving money on the table every week.

CalBliss sets up in under 24 hours. You tell us your services, hours, and staff — we handle everything else. [Get started here](/) or [book a demo](/) to see the agent live on your number.
    `.trim(),
  },
}

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) return {}
  return {
    title: `${post.title} — CalBliss Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) notFound()

  const paragraphs = post.content.split("\n\n").filter(Boolean)

  return (
    <>
      <Navbar />
      <BlogPostJsonLd title={post.title} excerpt={post.excerpt} date={post.date} slug={slug} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          ← All articles
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground">{post.date}</span>
            <span className="text-xs text-muted-foreground">· {post.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
        </div>

        <hr className="border-border mb-10" />

        {/* Content */}
        <article className="prose prose-sm max-w-none text-foreground [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-muted-foreground [&_li]:mb-1 [&_table]:w-full [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground [&_th]:py-2 [&_th]:border-b [&_th]:border-border [&_td]:py-2 [&_td]:text-sm [&_td]:text-muted-foreground [&_td]:border-b [&_td]:border-border/50 [&_hr]:border-border [&_hr]:my-8">
          {paragraphs.map((block, i) => {
            if (block.startsWith("**") && block.endsWith("**")) {
              const text = block.slice(2, -2)
              return <h2 key={i}>{text}</h2>
            }
            if (block.startsWith("| ")) {
              const rows = block.split("\n").filter((r) => !r.match(/^[\s|:-]+$/))
              const [header, ...body] = rows
              const headers = header.split("|").filter(Boolean).map((s) => s.trim())
              return (
                <table key={i}>
                  <thead>
                    <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {body.map((row, ri) => {
                      const cells = row.split("|").filter(Boolean).map((s) => s.trim())
                      return <tr key={ri}>{cells.map((c, ci) => <td key={ci}>{c}</td>)}</tr>
                    })}
                  </tbody>
                </table>
              )
            }
            if (block.startsWith("---")) {
              return <hr key={i} />
            }
            if (block.startsWith("- ")) {
              const items = block.split("\n").map((l) => l.replace(/^- /, ""))
              return <ul key={i}>{items.map((item, ii) => <li key={ii}>{item}</li>)}</ul>
            }
            // Inline bold rendering
            const parts = block.split(/(\*\*[^*]+\*\*)/)
            return (
              <p key={i}>
                {parts.map((part, pi) =>
                  part.startsWith("**") ? (
                    <strong key={pi}>{part.slice(2, -2)}</strong>
                  ) : (
                    part
                  )
                )}
              </p>
            )
          })}
        </article>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border border-primary/20 bg-primary/5 p-7 text-center">
          <p className="font-heading font-bold text-foreground mb-1">Ready to try CalBliss?</p>
          <p className="text-sm text-muted-foreground mb-4">Live in under 24 hours. No credit card required.</p>
          <a
            href="/#get-started"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 h-10 text-sm shadow-lg shadow-primary/25 transition-colors"
          >
            Get your agent →
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}
