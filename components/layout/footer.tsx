import { Logo } from "@/components/logo"

const LINKS = {
  Product: [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Help Centre", href: "/help" },
    { label: "Partner Programme", href: "/partners" },
    { label: "Affiliate", href: "/affiliate" },
  ],
  Industries: [
    { label: "Barbershops", href: "/for/barbershops" },
    { label: "Salons", href: "/for/salons" },
    { label: "Spas", href: "/for/spas" },
    { label: "Dental Practices", href: "/for/dental" },
    { label: "Gyms & Fitness", href: "/for/gyms" },
  ],
  Compare: [
    { label: "vs. Receptionist", href: "/vs/receptionist" },
    { label: "vs. Voicemail", href: "/vs/voicemail" },
    { label: "vs. Answering Service", href: "/vs/answering-service" },
    { label: "vs. Google Voice", href: "/vs/google-voice" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "mailto:hello@timebookingpro.com" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo iconSize={32} />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              AI voice agents that fill your calendar — 24 hours a day.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {group}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TimeBookingPro. All rights reserved.</p>
          <p>Made with care for independent businesses.</p>
        </div>
      </div>
    </footer>
  )
}
