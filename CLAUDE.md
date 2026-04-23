@AGENTS.md
@C:/Users/medin/.claude/shared-rules.md

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
| Hosting | Vercel (`timebookingpro.com`) |

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

---

## Pricing — constraints (do not drift)

> Canonical source: https://dashboard-sooty-seven-64.vercel.app/dashboard
> Settings → Subscription. If this CLAUDE.md disagrees with that page,
> the dashboard wins. Request an updated handoff PDF before changing prices.

- 4 tiers, EUR: Light €99 · Standard €179 · Busy €299 · Heavy €499 (monthly).
- Minutes per month: 100 / 250 / 500 / 1,000. Hard cap — NO overage, ever.
- Yearly = flat 20% off monthly. Toggle defaults to Monthly.
- Badges: Standard = "Most popular"; Heavy = "Best value". No other badges.
- Per-card feature list = exactly 5 bullets (minutes + 4 shared). Nothing else.
- DO NOT add "locations", "support tier", "overage rate", or "per-min included"
  as feature bullets. These are not part of the pricing model.
- DO NOT write "up to X minutes" — write "X min/month".
- DO NOT invent discounts. Any promo code must come from the canonical source.
- Show prices ex-VAT with "Prices shown ex-VAT — tax calculated at checkout."
- All 4 tier CTAs are self-serve Stripe Checkout — no "Book a demo" CTA on
  any tier. Book-a-demo belongs on the top-nav, not in pricing.
- EU-only scope: pricing is shown only for the 27 EU member states.
  Do NOT list GB, NO, CH, IS, US, CA, AU, NZ, AE, JP, or SG anywhere
  on the pricing section or the country picker.
- Supported currencies on the pricing page: EUR (default), SEK, DKK, PLN.
  All other EU countries use EUR.
- Default country = GR (Greece). Default currency = EUR. Defaults are
  DETERMINISTIC on the pricing page — no geo-IP guessing.
- ONE dropdown on pricing (unified country+currency picker). Currency is
  derived from country via `currencyForCountry(code)`. No separate currency
  select, no "Buying for a business" checkbox, no VAT ID field — Stripe
  Checkout handles VIES lookup + reverse-charge at checkout.
- Option label format: `{flag} {country name} · {currency code}`
  (e.g. `🇬🇷 Greece · EUR`). Matches the canonical dashboard.
