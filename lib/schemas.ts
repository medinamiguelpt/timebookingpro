import { z } from "zod"
import { NextResponse } from "next/server"

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
