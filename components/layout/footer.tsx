import { useTranslations } from "next-intl"
import { Logo } from "@/components/logo"
import { LocaleSwitcher } from "@/components/ui/locale-switcher"

export function Footer() {
  const t = useTranslations("footer")
  const navT = useTranslations("navbar")
  const year = new Date().getFullYear()

  const navLinks: { label: string; href: string }[] = [
    { label: navT("howItWorks"), href: "#how-it-works" },
    { label: navT("features"),   href: "#features" },
    { label: navT("pricing"),    href: "#pricing" },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <Logo iconSize={28} />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
              {t("tagline")}
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-5">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
          <LocaleSwitcher variant="compact" />
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} TimeBookingPro. {t("rightsReserved")}</p>
          <p>{t("madeWithCare")}</p>
        </div>
      </div>
    </footer>
  )
}
