import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")?.toUpperCase()

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Demo data when Supabase is not configured
    return NextResponse.json({
      top: [
        { rank: 1, initial: "J", referrals: 14, milestone: "Elite" },
        { rank: 2, initial: "M", referrals: 9,  milestone: "Partner" },
        { rank: 3, initial: "S", referrals: 7,  milestone: "Partner" },
        { rank: 4, initial: "A", referrals: 5,  milestone: "Partner" },
        { rank: 5, initial: "R", referrals: 3,  milestone: "Starter" },
      ],
      user: code ? { rank: 23, referrals: 1, nextMilestone: 3, nextReward: "1 month free", progress: 33 } : null,
      milestones: [
        { count: 1,  reward: "Extended trial (30 days)",  achieved: true },
        { count: 3,  reward: "1 month free subscription", achieved: false },
        { count: 10, reward: "3 months free",             achieved: false },
        { count: 25, reward: "Lifetime 25% discount",     achieved: false },
      ],
    })
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Count referrals per referral_code
  const { data: referralCounts } = await supabase
    .from("waitlist")
    .select("referred_by")
    .not("referred_by", "is", null)

  const counts: Record<string, number> = {}
  for (const row of referralCounts ?? []) {
    if (row.referred_by) counts[row.referred_by] = (counts[row.referred_by] ?? 0) + 1
  }

  // Top 5 referrers
  const sorted = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const milestoneLabel = (n: number) => n >= 10 ? "Elite" : n >= 6 ? "Partner" : "Starter"

  const top = sorted.map(([, count], i) => ({
    rank: i + 1,
    initial: "?",
    referrals: count,
    milestone: milestoneLabel(count),
  }))

  let user = null
  if (code) {
    const userReferrals = counts[code] ?? 0
    const allRanks = Object.values(counts).sort((a, b) => b - a)
    const rank = allRanks.findIndex(n => n <= userReferrals) + 1
    const nextMilestone = userReferrals < 1 ? 1 : userReferrals < 3 ? 3 : userReferrals < 10 ? 10 : 25
    const rewards = { 1: "Extended trial", 3: "1 month free", 10: "3 months free", 25: "Lifetime 25% off" }
    const progress = userReferrals >= nextMilestone ? 100 : Math.round((userReferrals / nextMilestone) * 100)
    user = {
      rank: rank || Object.keys(counts).length + 1,
      referrals: userReferrals,
      nextMilestone,
      nextReward: rewards[nextMilestone as keyof typeof rewards],
      progress,
    }
  }

  const MILESTONES = [
    { count: 1,  reward: "Extended trial (30 days)" },
    { count: 3,  reward: "1 month free subscription" },
    { count: 10, reward: "3 months free" },
    { count: 25, reward: "Lifetime 25% discount" },
  ]

  return NextResponse.json({
    top,
    user,
    milestones: MILESTONES.map(m => ({
      ...m,
      achieved: code ? (counts[code] ?? 0) >= m.count : false,
    })),
  })
}
