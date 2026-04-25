import { z } from "zod"
import { NextResponse } from "next/server"

// ── Shared schemas ────────────────────────────────────────

export const waitlistSchema = z.object({
  email:  z.string().email("Invalid email"),
  source: z.string().optional().default("waitlist"),
  phone:  z.string().optional().default(""),
})

export const agentNameSchema = z.object({
  business: z.string().optional().default(""),
})

export const dripSchema = z.object({
  email:  z.string().email("Invalid email"),
  day:    z.number().int().refine((d) => [1, 3, 7].includes(d), "day must be 1, 3, or 7"),
  secret: z.string().optional(),
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
