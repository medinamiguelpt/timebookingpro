@AGENTS.md

# Timebooking Pro — CLAUDE.md

---

## Deploy Flow

After **every** change:
1. `git commit` the changes (GPG-signed)
2. `git push origin master`
3. Vercel auto-deploys from push — done. No manual `vercel --prod` needed.

Never ask "should I push/deploy?" — just do it as part of every task.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) + shadcn/ui + Tailwind CSS |
| Database | Supabase PostgreSQL |
| Email | Resend |
| AI | Claude API (`claude-sonnet-4-6`) |
| Payments | Stripe |
| Secrets | Doppler |
| Hosting | Vercel (`calbliss.vercel.app`) |

---

## Pending Improvements (implement when requested)

1. **Analytics dashboard** — track A/B variant conversion rates in Supabase, show in `/admin`
2. **Waitlist confirmation email** — auto-send branded "you're on the list" email via Resend
3. **Agent name generator** — make AgentNamer section call Claude API to generate names
4. **Testimonial video cards** — upgrade testimonial cards with a fake "play" button + hover preview
5. **Scroll-triggered nav highlights** — highlight active nav link as user scrolls sections
6. **Dark/light OG image** — generate different OG images based on `prefers-color-scheme`
7. **Blog RSS feed** — `app/blog/feed.xml/route.ts` serving a proper RSS feed for SEO
8. **Structured data (JSON-LD)** — schema.org markup for `LocalBusiness` and `FAQPage`

---

## Hard Rules

- No secrets in code or `.env` files — Doppler only
- Never use `SELECT *` — explicit column list always
- Never expose Supabase service-role key in frontend code
- TypeScript strict mode — no `any`
