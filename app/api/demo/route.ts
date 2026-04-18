import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const resendKey = process.env.RESEND_API_KEY

export async function POST(req: Request) {
  const { name, email, business } = await req.json()

  if (!email?.includes("@") || !name) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  await Promise.allSettled([
    persistDemo({ name, email, business }),
    notifyDemo({ name, email, business }),
  ])

  console.log(`[demo] Request from ${name} <${email}> — ${business || "no business"}`)
  return NextResponse.json({ ok: true })
}

async function persistDemo({ name, email, business }: { name: string; email: string; business: string }) {
  if (!supabaseUrl || !supabaseKey) return
  const supabase = createClient(supabaseUrl, supabaseKey)
  await supabase.from("demo_requests").upsert(
    { name, email, business, created_at: new Date().toISOString() },
    { onConflict: "email" }
  )
}

async function notifyDemo({ name, email, business }: { name: string; email: string; business: string }) {
  if (!resendKey) return
  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: "CalBliss <hello@calbliss.com>",
    to: ["hello@calbliss.com"],
    subject: `Demo request: ${name} — ${business || "unknown business"}`,
    text: `Name: ${name}\nEmail: ${email}\nBusiness: ${business || "—"}\n\nSchedule their demo ASAP.`,
  })
}
