import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { SITE_URL, BRAND_NAME, FROM_EMAIL, OWNER_EMAIL } from "@/lib/constants"
import { waitlistSchema, parseBody } from "@/lib/schemas"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const resendKey   = process.env.RESEND_API_KEY

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
const resend   = resendKey ? new Resend(resendKey) : null

const twilioSid   = process.env.TWILIO_ACCOUNT_SID
const twilioToken = process.env.TWILIO_AUTH_TOKEN
const twilioFrom  = process.env.TWILIO_PHONE_NUMBER
const twilioAuth  = twilioSid && twilioToken
  ? Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64")
  : null

export async function POST(req: Request) {
  const parsed = parseBody(waitlistSchema, await req.json())
  if (parsed.error) return parsed.error
  const { email, source, phone } = parsed.data

  const { position } = await persistToSupabase(email, source, phone)

  await Promise.allSettled([
    sendOwnerNotification(email, source),
    sendConfirmation(email, position),
    phone ? sendSmsConfirmation(phone, position) : Promise.resolve(),
  ])

  console.log(`[waitlist] New signup (source: ${source}, position: ${position})`)
  return NextResponse.json({ ok: true, position })
}

async function sendSmsConfirmation(phone: string, position: number | null) {
  if (!twilioAuth || !twilioFrom) return

  const positionText = position ? ` You're #${position} on the list.` : ""
  const body = `${BRAND_NAME}: You're on the waitlist!${positionText} We'll reach out within 24 hours. Questions? Reply to this message.`

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${twilioAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: phone, From: twilioFrom, Body: body }).toString(),
  })
}

async function persistToSupabase(email: string, source: string, phone = "") {
  if (!supabase) return { position: null }

  const { error } = await supabase
    .from("waitlist")
    .upsert(
      { email, source, phone: phone || null, created_at: new Date().toISOString() },
      { onConflict: "email" }
    )

  if (error) throw new Error(error.message)

  const { count } = await supabase
    .from("waitlist")
    .select("id", { count: "exact", head: true })
    .lte("created_at", new Date().toISOString())

  return { position: count ?? null }
}

async function sendOwnerNotification(email: string, source: string) {
  if (!resend) return
  await resend.emails.send({
    from: FROM_EMAIL,
    to: [OWNER_EMAIL],
    subject: `New waitlist signup: ${email}`,
    text: `${email} joined via "${source}".`,
  })
}

async function sendConfirmation(email: string, position: number | null) {
  if (!resend) return
  const positionLine = position
    ? `<p style="color:#7C3AED;font-size:14px;font-weight:700;margin:0 0 4px;">You're #${position} on the list</p>`
    : ""

  await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: `You're on the ${BRAND_NAME} waitlist!`,
    html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAFF;font-family:system-ui,sans-serif;">
<div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #E4DCFF;overflow:hidden;">
  <div style="background:#0D0714;padding:36px 40px;text-align:center;">
    <div style="display:inline-block;background:linear-gradient(135deg,#9333EA,#5B21B6);border-radius:12px;padding:10px 18px;margin-bottom:16px;">
      <span style="color:#fff;font-size:18px;font-weight:800;letter-spacing:-0.5px;">${BRAND_NAME}</span>
    </div>
    <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0;line-height:1.2;">You're on the list!</h1>
    <p style="color:rgba(255,255,255,0.55);font-size:15px;margin:10px 0 0;">We'll be in touch within 24 hours.</p>
  </div>
  <div style="padding:36px 40px;">
    ${positionLine}
    <p style="color:#1A1027;font-size:15px;line-height:1.6;margin:0 0 20px;">
      Thanks for joining ${BRAND_NAME}. You're among the first businesses getting access to an AI voice agent that handles bookings 24/7.
    </p>
    <div style="background:#F0EBFF;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <p style="color:#5B21B6;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">What happens next</p>
      <ul style="margin:0;padding-left:18px;color:#1A1027;font-size:14px;line-height:1.8;">
        <li>We'll reach out within 24 hours to schedule your setup call</li>
        <li>Your agent will be live within the same day</li>
        <li>You'll start capturing every booking from day one</li>
      </ul>
    </div>
    <p style="color:#6B6880;font-size:13px;line-height:1.6;margin:12px 0 0;">Questions? Reply to this email — we read every one.</p>
  </div>
  <div style="border-top:1px solid #E4DCFF;padding:20px 40px;text-align:center;">
    <p style="color:#6B6880;font-size:12px;margin:0;">© 2026 ${BRAND_NAME} · <a href="${SITE_URL}" style="color:#7C3AED;">${SITE_URL.replace("https://","")}</a></p>
  </div>
</div></body></html>`,
  })
}
