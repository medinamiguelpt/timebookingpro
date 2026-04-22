import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Admin — TimeBookingPro", robots: "noindex" }
export const dynamic = "force-dynamic"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminKey = process.env.ADMIN_KEY

async function getStats() {
  if (!supabaseUrl || !supabaseKey) return null
  const supabase = createClient(supabaseUrl, supabaseKey)

  const [waitlistRes, demoRes, variantRes] = await Promise.all([
    supabase.from("waitlist").select("id, email, source, created_at").order("created_at", { ascending: false }).limit(50),
    supabase.from("demo_requests").select("id, name, email, business, created_at").order("created_at", { ascending: false }).limit(20),
    supabase.from("waitlist").select("source"),
  ])

  const waitlist = waitlistRes.data ?? []
  const demos = demoRes.data ?? []
  const all = variantRes.data ?? []

  const variantA = all.filter((r) => r.source === "waitlist" || r.source === "exit-intent").length
  const variantB = all.filter((r) => r.source === "variant-b").length

  return { waitlist, demos, variantA, variantB, total: all.length }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const { key } = await searchParams

  if (adminKey && key !== adminKey) {
    notFound()
  }

  const stats = await getStats()

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Internal</p>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight">Dashboard</h1>
        </div>

        {!stats ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground text-sm">Supabase not connected yet.</p>
            <p className="text-xs text-muted-foreground mt-2">
              Add <code className="bg-muted px-1 py-0.5 rounded text-xs">SUPABASE_URL</code> and{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">SUPABASE_SERVICE_ROLE_KEY</code> to Vercel env vars.
            </p>
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Total signups", value: stats.total },
                { label: "Demo requests", value: stats.demos.length },
                { label: "Variant A signups", value: stats.variantA },
                { label: "Variant B signups", value: stats.variantB },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="text-3xl font-heading font-extrabold text-primary">{value}</p>
                </div>
              ))}
            </div>

            {/* Recent waitlist */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Recent waitlist signups
              </h2>
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      {["Email", "Source", "Signed up"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.waitlist.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground text-sm">No signups yet</td>
                      </tr>
                    ) : (
                      stats.waitlist.map((row: { id: string; email: string; source: string; created_at: string }) => (
                        <tr key={row.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 text-foreground">{row.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.source ?? "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {new Date(row.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demo requests */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Demo requests
              </h2>
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      {["Name", "Email", "Business", "Date"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.demos.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground text-sm">No demo requests yet</td>
                      </tr>
                    ) : (
                      stats.demos.map((row: { id: string; name: string; email: string; business: string; created_at: string }) => (
                        <tr key={row.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 text-foreground">{row.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.business ?? "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {new Date(row.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}
