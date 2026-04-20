import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") ?? ""
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email
    const plan = session.metadata?.plan ?? "growth"
    const billing = session.metadata?.billing ?? "monthly"

    await Promise.allSettled([
      recordCustomer(email, plan, billing, session),
      sendOnboardingEmail(email, plan),
    ])
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription
    await cancelCustomer(sub.id)
  }

  return NextResponse.json({ received: true })
}

async function recordCustomer(
  email: string | null | undefined,
  plan: string,
  billing: string,
  session: Stripe.Checkout.Session
) {
  if (!email || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  await supabase.from("customers").upsert(
    {
      email,
      plan,
      billing,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      status: "active",
      created_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  )
}

async function cancelCustomer(subscriptionId: string) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  await supabase
    .from("customers")
    .update({ status: "cancelled" })
    .eq("stripe_subscription_id", subscriptionId)
}

async function sendOnboardingEmail(email: string | null | undefined, plan: string) {
  if (!email || !process.env.RESEND_API_KEY) return
  const resend = new Resend(process.env.RESEND_API_KEY)

  const steps = [
    "We'll call you within 24 hours to collect your scheduling preferences",
    "Your AI agent gets trained on your business — services, prices, availability",
    "Agent goes live and starts handling bookings 24/7",
  ]

  await resend.emails.send({
    from: "CalBliss <hello@calbliss.com>",
    to: [email],
    subject: "Welcome to CalBliss — your agent is being set up",
    html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAFF;font-family:system-ui,sans-serif;">
<div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #E4DCFF;overflow:hidden;">
  <div style="background:#0D0714;padding:36px 40px;text-align:center;">
    <div style="display:inline-block;background:linear-gradient(135deg,#9333EA,#5B21B6);border-radius:12px;padding:10px 18px;margin-bottom:16px;">
      <span style="color:#fff;font-size:18px;font-weight:800;letter-spacing:-0.5px;">CalBliss</span>
    </div>
    <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0;line-height:1.2;">You're in. Let's get live.</h1>
    <p style="color:rgba(255,255,255,0.55);font-size:15px;margin:10px 0 0;">Your ${plan} plan is confirmed.</p>
  </div>
  <div style="padding:36px 40px;">
    <p style="color:#1A1027;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Here's what happens in the next 24 hours:
    </p>
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${steps.map((s, i) => `
      <div style="display:flex;gap:12px;align-items:flex-start;">
        <div style="background:linear-gradient(135deg,#9333EA,#5B21B6);color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;margin-top:2px;">${i + 1}</div>
        <p style="margin:0;color:#1A1027;font-size:14px;line-height:1.6;">${s}</p>
      </div>`).join("")}
    </div>
    <div style="background:#F0EBFF;border-radius:12px;padding:20px 24px;margin:24px 0 0;">
      <p style="color:#5B21B6;font-size:13px;font-weight:600;margin:0 0 6px;">Questions?</p>
      <p style="color:#1A1027;font-size:14px;margin:0;">Reply to this email or reach us at <a href="mailto:hello@calbliss.com" style="color:#7C3AED;">hello@calbliss.com</a>. We're a small team and we read everything.</p>
    </div>
  </div>
  <div style="border-top:1px solid #E4DCFF;padding:20px 40px;text-align:center;">
    <p style="color:#6B6880;font-size:12px;margin:0;">© 2026 CalBliss · <a href="https://calbliss.com" style="color:#7C3AED;">calbliss.com</a></p>
  </div>
</div></body></html>`,
  })
}
