import Anthropic from "@anthropic-ai/sdk"
import { chatSchema, parseBody } from "@/lib/schemas"

const client = new Anthropic()

const SYSTEM = `You are a helpful, concise assistant for TimeBookingPro — an AI voice agent service for barbershops and small businesses.

Key facts:
- AI agents handle bookings 24/7 via phone calls
- Pricing: Starter €229/mo (200 min), Professional €429/mo (600 min), Enterprise €859/mo (1,600 min) — 20% off with annual billing
- Live in under 24 hours — zero technical setup required
- Works with Google Calendar, Calendly, Acuity Scheduling
- Voice powered by ElevenLabs — sounds completely natural
- No long-term contracts, cancel any time
- GDPR compliant, data encrypted at rest and in transit
- Available in English, Spanish, French, Portuguese and more

Rules:
- Keep every reply to 2–3 sentences max
- Be warm, direct, and human — not corporate
- If someone wants to sign up, say: "Hit the 'Get your agent' button above — you'll be live within 24 hours."
- If someone asks about a demo, say: "You can book a free 20-minute demo from the 'Book a demo' button in the hero section."
- Never make up features or pricing that aren't listed above
- If you don't know something, say "That's a great question — email us at hello@timebookingpro.com and we'll get back to you quickly."`

export async function POST(req: Request) {
  const parsed = parseBody(chatSchema, await req.json())
  if (parsed.error) return new Response("Invalid messages", { status: 400 })
  const { messages } = parsed.data

  const stream = client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: SYSTEM,
    messages: messages.slice(-10),
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
