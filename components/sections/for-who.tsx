"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"

const TABS = [
  {
    value: "barbershops",
    label: "Barbershops",
    headline: "Stop losing bookings while you're behind the chair",
    body: "Every missed call is a missed haircut. Your agent answers instantly, checks your schedule, and locks in the appointment — so you can focus on the cut.",
    perks: [
      "Handles walk-in vs appointment calls",
      "Knows your barbers' individual schedules",
      "Sends booking confirmations automatically",
      "Speaks the language your customers prefer",
    ],
  },
  {
    value: "salons",
    label: "Salons",
    headline: "A receptionist that never takes a day off",
    body: "From colouring appointments to last-minute cancellations, your agent manages it all — without ever putting a customer on hold.",
    perks: [
      "Books specific stylists by name",
      "Handles service duration differences",
      "Manages cancellations and reschedules",
      "Works across multiple staff calendars",
    ],
  },
  {
    value: "spas",
    label: "Spas",
    headline: "Let your clients relax — starting from the first call",
    body: "Your agent books treatments, answers questions about services, and handles rescheduling — so your team can focus entirely on the experience.",
    perks: [
      "Books massages, facials, and treatments",
      "Handles multi-therapist scheduling",
      "Sends reminders to reduce no-shows",
      "Works across multiple treatment rooms",
    ],
  },
  {
    value: "nails",
    label: "Nail & Beauty Studios",
    headline: "Keep your chair full without lifting a finger",
    body: "From gel sets to lash extensions, your agent knows your services and books the right slot with the right technician — every time.",
    perks: [
      "Books specific technicians by specialty",
      "Handles service duration differences",
      "Manages cancellations and reschedules",
      "Answers pricing and availability questions",
    ],
  },
  {
    value: "gyms",
    label: "Gyms & Studios",
    headline: "Fill every class, every session",
    body: "From personal training sessions to group classes, your agent keeps your timetable full and your members informed.",
    perks: [
      "Books classes and 1-to-1 sessions",
      "Manages class capacity limits",
      "Handles membership and trial enquiries",
      "Sends session reminders automatically",
    ],
  },
]

export function ForWho() {
  return (
    <section className="py-24 sm:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.p
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Who it&apos;s for
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Built for every booking business
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="barbershops">
            <TabsList className="flex flex-wrap gap-2 h-auto bg-transparent justify-center mb-10">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-full px-5 py-2 text-sm font-semibold border border-border data-active:bg-primary data-active:text-primary-foreground data-active:border-primary transition-colors"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <div className="grid md:grid-cols-2 gap-10 items-center rounded-2xl border border-border bg-card p-8 sm:p-10">
                  <div>
                    <h3 className="text-2xl font-heading font-extrabold leading-snug mb-4">
                      {tab.headline}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-8">{tab.body}</p>
                    <ul className="space-y-3">
                      {tab.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual accent */}
                  <div className="hidden md:flex justify-center">
                    <div className="w-56 h-56 rounded-3xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center gap-4 text-center p-6">
                      <p className="text-5xl font-heading font-extrabold text-primary">98%</p>
                      <p className="text-sm font-medium text-muted-foreground">
                        of calls answered on the first ring
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
