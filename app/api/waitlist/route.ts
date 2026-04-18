import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const resendKey   = process.env.RESEND_API_KEY

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(req: Request) {
  const { email, source = "waitlist", ref = "" } = await req.json()

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const { position, referralCode } = await persistToSupabase(email, source, ref)

  await Promise.allSettled([
    sendOwnerNotification(email, source),
    sendConfirmation(email, position, referralCode),
  ])

  console.log(`[waitlist] New signup: ${email} (source: ${source}, position: ${position})`)
  return NextResponse.json({ ok: true, position, referralCode })
}

async function persistToSupabase(email: string, source: string, ref: string) {
  if (!supabaseUrl || !supabaseKey) {
    return { position: null, referralCode: null }
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const code = generateCode()

  const { error } = await supabase
    .from("waitlist")
    .upsert(
      { email, source, referred_by: ref || null, referral_code: code, created_at: new Date().toISOString() },
      { onConflict: "email" }
    )

  if (error) throw new Error(error.message)

  // Count position (how many signed up before this email)
  const { count } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true })
    .lte("created_at", new Date().toISOString())

  return { position: count ?? null, referralCode: code }
}

async function sendOwnerNotification(email: string, source: string) {
  if (!resendKey) return
  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: "CalBliss <hello@calbliss.com>",
    to: ["hello@calbliss.com"],
    subject: `New waitlist signup: ${email}`,
    text: `${email} joined via "${source}".`,
  })
}

async function sendConfirmation(email: string, position: number | null, referralCode: string | null) {
  if (!resendKey) return
  const resend = new Resend(resendKey)
  const positionLine = position
    ? `<p style="color:#7C3AED;font-size:14px;font-weight:700;margin:0 0 4px;">You're #${position} on the list</p>`
    : ""
  const refLine = referralCode
    ? `<p style="color:#6B6880;font-size:13px;margin:12px 0 0;">Your referral link: <a href="https://calbliss.com/r/${referralCode}" style="color:#7C3AED;">calbliss.com/r/${referralCode}</a> — share it to move up the list.</p>`
    : ""

  await resend.emails.send({
    from: "CalBliss <hello@calbliss.com>",
    to: [email],
    subject: "You're on the CalBliss waitlist!",
    html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAFF;font-family:system-ui,sans-serif;">
<div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #E4DCFF;overflow:hidden;">
  <div style="background:#0D0714;padding:36px 40px;text-align:center;">
    <div style="display:inline-block;background:linear-gradient(135deg,#9333EA,#5B21B6);border-radius:12px;padding:10px 18px;margin-bottom:16px;">
      <span style="color:#fff;font-size:18px;font-weight:800;letter-spacing:-0.5px;">CalBliss</span>
    </div>
    <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0;line-height:1.2;">You're on the list!</h1>
    <p style="color:rgba(255,255,255,0.55);font-size:15px;margin:10px 0 0;">We'll be in touch within 24 hours.</p>
  </div>
  <div style="padding:36px 40px;">
    ${positionLine}
    <p style="color:#1A1027;font-size:15px;line-height:1.6;margin:0 0 20px;">
      Thanks for joining CalBliss. You're among the first businesses getting access to an AI voice agent that handles bookings 24/7.
    </p>
    <div style="background:#F0EBFF;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <p style="color:#5B21B6;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">What happens next</p>
      <ul style="margin:0;padding-left:18px;color:#1A1027;font-size:14px;line-height:1.8;">
        <li>We'll reach out within 24 hours to schedule your setup call</li>
        <li>Your agent will be live within the same day</li>
        <li>You'll start capturing every booking from day one</li>
      </ul>
    </div>
    ${refLine}
    <p style="color:#6B6880;font-size:13px;line-height:1.6;margin:12px 0 0;">Questions? Reply to this email — we read every one.</p>
  </div>
  <div style="border-top:1px solid #E4DCFF;padding:20px 40px;text-align:center;">
    <p style="color:#6B6880;font-size:12px;margin:0;">© 2026 CalBliss · <a href="https://calbliss.com" style="color:#7C3AED;">calbliss.com</a></p>
  </div>
</div></body></html>`,
  })
}
