import { NextResponse } from "next/server"
import { Resend } from "resend"

const resendKey = process.env.RESEND_API_KEY
const DRIP_SECRET = process.env.DRIP_SECRET

const EMAILS: Record<number, { subject: string; html: (email: string) => string }> = {
  1: {
    subject: "Your TimeBookingPro agent is almost ready",
    html: (email) => `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAFF;font-family:system-ui,sans-serif;">
<div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #E4DCFF;overflow:hidden;">
  <div style="background:#0D0714;padding:32px 40px;">
    <span style="color:#A78BFA;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Day 1 — Getting started</span>
    <h1 style="color:#fff;font-size:22px;font-weight:800;margin:10px 0 0;line-height:1.3;">Your agent is waiting for a name</h1>
  </div>
  <div style="padding:32px 40px;">
    <p style="color:#1A1027;font-size:15px;line-height:1.7;margin:0 0 20px;">
      You joined the TimeBookingPro waitlist — and we haven't forgotten you. While we get your setup ready, here's one thing to think about:
    </p>
    <div style="background:#F0EBFF;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <p style="color:#5B21B6;font-size:14px;font-weight:700;margin:0 0 8px;">What will you name your agent?</p>
      <p style="color:#1A1027;font-size:14px;line-height:1.6;margin:0;">
        Our most popular agent names: <strong>Max</strong>, <strong>Nova</strong>, and <strong>Aria</strong>. Your agent will introduce itself by name on every call — so pick one that fits your brand.
      </p>
    </div>
    <p style="color:#6B6880;font-size:13px;line-height:1.6;margin:0;">
      Reply to this email with your business name and the name you want — and we'll have your agent ready even faster.
    </p>
  </div>
  <div style="border-top:1px solid #E4DCFF;padding:20px 40px;text-align:center;">
    <a href="https://timebookingpro.com/#get-started" style="display:inline-block;background:#7C3AED;color:#fff;font-weight:700;border-radius:40px;padding:12px 28px;text-decoration:none;font-size:14px;">Get your agent now →</a>
    <p style="color:#6B6880;font-size:11px;margin:16px 0 0;">© 2026 TimeBookingPro · <a href="https://timebookingpro.com" style="color:#7C3AED;">timebookingpro.com</a></p>
  </div>
</div></body></html>`,
  },

  3: {
    subject: "How Carlos added 40 bookings a month (real story)",
    html: (_email) => `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAFF;font-family:system-ui,sans-serif;">
<div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #E4DCFF;overflow:hidden;">
  <div style="background:#0D0714;padding:32px 40px;">
    <span style="color:#A78BFA;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Day 3 — Real results</span>
    <h1 style="color:#fff;font-size:22px;font-weight:800;margin:10px 0 0;line-height:1.3;">"I was losing 4 bookings every weekend"</h1>
  </div>
  <div style="padding:32px 40px;">
    <p style="color:#1A1027;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Carlos M. runs The Barber Studio in Austin. Before TimeBookingPro, he was losing 3–4 bookings every Saturday — missed calls while he was cutting hair.
    </p>
    <div style="border-left:3px solid #7C3AED;padding:12px 20px;margin-bottom:24px;background:#F0EBFF;border-radius:0 8px 8px 0;">
      <p style="color:#1A1027;font-size:14px;line-height:1.6;margin:0;font-style:italic;">
        "TimeBookingPro paid for itself in the first week. My Friday and Saturday slots now fill by Wednesday. I haven't missed a call since."
      </p>
      <p style="color:#7C3AED;font-size:12px;font-weight:700;margin:8px 0 0;">— Carlos M., The Barber Studio</p>
    </div>
    <div style="display:flex;gap:16px;margin-bottom:24px;">
      <div style="flex:1;background:#F0EBFF;border-radius:10px;padding:16px;text-align:center;">
        <p style="color:#7C3AED;font-size:28px;font-weight:800;margin:0;">+40</p>
        <p style="color:#6B6880;font-size:12px;margin:4px 0 0;">bookings/month</p>
      </div>
      <div style="flex:1;background:#F0EBFF;border-radius:10px;padding:16px;text-align:center;">
        <p style="color:#7C3AED;font-size:28px;font-weight:800;margin:0;">28×</p>
        <p style="color:#6B6880;font-size:12px;margin:4px 0 0;">ROI in month 1</p>
      </div>
    </div>
    <p style="color:#6B6880;font-size:13px;line-height:1.6;margin:0;">
      You're next. We'll have your agent live within 24 hours of you signing up.
    </p>
  </div>
  <div style="border-top:1px solid #E4DCFF;padding:20px 40px;text-align:center;">
    <a href="https://timebookingpro.com/#get-started" style="display:inline-block;background:#7C3AED;color:#fff;font-weight:700;border-radius:40px;padding:12px 28px;text-decoration:none;font-size:14px;">Start my free trial →</a>
    <p style="color:#6B6880;font-size:11px;margin:16px 0 0;">© 2026 TimeBookingPro · <a href="https://timebookingpro.com" style="color:#7C3AED;">timebookingpro.com</a></p>
  </div>
</div></body></html>`,
  },

  7: {
    subject: "Still thinking it over? Here's an honest breakdown.",
    html: (_email) => `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAFF;font-family:system-ui,sans-serif;">
<div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #E4DCFF;overflow:hidden;">
  <div style="background:#0D0714;padding:32px 40px;">
    <span style="color:#A78BFA;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Day 7 — Still interested?</span>
    <h1 style="color:#fff;font-size:22px;font-weight:800;margin:10px 0 0;line-height:1.3;">Is TimeBookingPro right for you?</h1>
  </div>
  <div style="padding:32px 40px;">
    <p style="color:#1A1027;font-size:15px;line-height:1.7;margin:0 0 20px;">
      It's been a week. You haven't signed up yet — that's totally fine. Here's an honest breakdown of who TimeBookingPro works best for:
    </p>
    <div style="margin-bottom:20px;">
      <p style="color:#10B981;font-size:13px;font-weight:700;margin:0 0 8px;">✓ Good fit</p>
      <ul style="margin:0;padding-left:18px;color:#1A1027;font-size:14px;line-height:1.8;">
        <li>You get 10+ calls per day</li>
        <li>You miss calls during busy hours or after close</li>
        <li>Bookings are your main revenue source</li>
        <li>You don't want to hire a receptionist</li>
      </ul>
    </div>
    <div style="margin-bottom:24px;">
      <p style="color:#EF4444;font-size:13px;font-weight:700;margin:0 0 8px;">✗ Not the right fit (yet)</p>
      <ul style="margin:0;padding-left:18px;color:#1A1027;font-size:14px;line-height:1.8;">
        <li>You get fewer than 5 calls per week</li>
        <li>Walk-ins are your only channel</li>
        <li>You don't use a calendar system at all</li>
      </ul>
    </div>
    <p style="color:#6B6880;font-size:13px;line-height:1.6;margin:0;">
      Not sure which camp you're in? Reply to this email — we'll tell you honestly whether TimeBookingPro is worth it for your specific business.
    </p>
  </div>
  <div style="border-top:1px solid #E4DCFF;padding:20px 40px;text-align:center;">
    <a href="https://timebookingpro.com/#get-started" style="display:inline-block;background:#7C3AED;color:#fff;font-weight:700;border-radius:40px;padding:12px 28px;text-decoration:none;font-size:14px;">I'm a good fit — sign me up →</a>
    <p style="color:#6B6880;font-size:11px;margin:16px 0 0;">© 2026 TimeBookingPro · You're receiving this because you joined our waitlist.</p>
  </div>
</div></body></html>`,
  },
}

export async function POST(req: Request) {
  const { email, day, secret } = await req.json()

  if (DRIP_SECRET && secret !== DRIP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!email?.includes("@") || !EMAILS[day as number]) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 })
  }

  if (!resendKey) {
    console.log(`[drip] Would send day-${day} to ${email} (Resend not configured)`)
    return NextResponse.json({ ok: true, sent: false })
  }

  const resend = new Resend(resendKey)
  const template = EMAILS[day as number]

  await resend.emails.send({
    from: "TimeBookingPro <hello@timebookingpro.com>",
    to: [email],
    subject: template.subject,
    html: template.html(email),
  })

  return NextResponse.json({ ok: true, sent: true })
}
