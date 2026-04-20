import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")?.toUpperCase()

  if (!code || code.length !== 6) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 })
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Return demo data when Supabase isn't configured
    return NextResponse.json({
      referralCode: code,
      referrals: 3,
      active: 2,
      earnings: 118,
      pending: 59,
      recentReferrals: [
        { email: "j***@gmail.com", date: "2026-04-15", status: "active" },
        { email: "m***@outlook.com", date: "2026-04-10", status: "active" },
        { email: "b***@icloud.com", date: "2026-04-02", status: "trial" },
      ],
    })
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Find the owner of this referral code
  const { data: owner } = await supabase
    .from("waitlist")
    .select("email, referral_code")
    .eq("referral_code", code)
    .single()

  if (!owner) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 })
  }

  // Find people referred by this code
  const { data: referred } = await supabase
    .from("waitlist")
    .select("email, created_at")
    .eq("referred_by", code)
    .order("created_at", { ascending: false })

  // Find paying customers from referrals (if customers table exists)
  const referredEmails = (referred ?? []).map((r) => r.email)
  let activeCustomers = 0
  let earnings = 0

  if (referredEmails.length > 0) {
    const { data: customers } = await supabase
      .from("customers")
      .select("email, plan, status")
      .in("email", referredEmails)
      .eq("status", "active")

    if (customers) {
      activeCustomers = customers.length
      const planPrices: Record<string, number> = { starter: 49, growth: 99, pro: 199, franchise: 299 }
      earnings = customers.reduce((sum, c) => sum + (planPrices[c.plan] ?? 99) * 0.3, 0)
    }
  }

  const recentReferrals = (referred ?? []).slice(0, 10).map((r) => ({
    email: r.email.replace(/(?<=.{1}).(?=[^@]*@)/g, "*"),
    date: r.created_at?.slice(0, 10) ?? "",
    status: "trial" as const,
  }))

  return NextResponse.json({
    referralCode: code,
    referrals: referred?.length ?? 0,
    active: activeCustomers,
    earnings: Math.round(earnings),
    pending: Math.round(earnings * 0.5),
    recentReferrals,
  })
}
