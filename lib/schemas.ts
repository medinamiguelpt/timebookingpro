import { z } from "zod"
import { NextResponse } from "next/server"

// ── Shared schemas ────────────────────────────────────────

export const waitlistSchema = z.object({
  email:  z.string().email("Invalid email"),
  source: z.string().optional().default("waitlist"),
  ref:    z.string().optional().default(""),
  phone:  z.string().optional().default(""),
})

export const demoSchema = z.object({
  name:     z.string().min(1, "Name is required"),
  email:    z.string().email("Invalid email"),
  business: z.string().optional().default(""),
})

export const chatSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .min(1, "Messages required"),
})

export const agentNameSchema = z.object({
  business: z.string().optional().default(""),
})

export const ttsSchema = z.object({
  text: z.string().min(1, "Text required").max(300, "Text too long"),
})

export const dripSchema = z.object({
  email:  z.string().email("Invalid email"),
  day:    z.number().int().refine((d) => [1, 3, 7].includes(d), "day must be 1, 3, or 7"),
  secret: z.string().optional(),
})

// ── Query param schemas ───────────────────────────────────

export const affiliateQuerySchema = z.object({
  code: z.string().length(6, "Code must be 6 characters"),
})

export const checkoutQuerySchema = z.object({
  plan:    z.enum(["starter", "professional", "enterprise"]).default("professional"),
  billing: z.enum(["monthly", "annual"]).default("monthly"),
  ref:     z.string().optional().default(""),
})

export const leaderboardQuerySchema = z.object({
  code: z.string().optional(),
})

// ── Parse helper ─────────────────────────────────────────

type ParseOk<T>  = { data: T;    error: null }
type ParseErr    = { data: null; error: NextResponse }

export function parseBody<T>(schema: z.ZodType<T>, raw: unknown): ParseOk<T> | ParseErr {
  const result = schema.safeParse(raw)
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid request"
    return { data: null, error: NextResponse.json({ error: message }, { status: 400 }) }
  }
  return { data: result.data, error: null }
}

export function parseQuery<T>(schema: z.ZodType<T>, params: URLSearchParams): ParseOk<T> | ParseErr {
  const raw = Object.fromEntries(params.entries())
  return parseBody(schema, raw)
}
