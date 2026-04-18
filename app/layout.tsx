import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import Script from "next/script"
import { Providers } from "@/components/providers"
import { CookieBanner } from "@/components/ui/cookie-banner"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { ChatWidget } from "@/components/ui/chat-widget"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CalBliss — Your bookings, handled.",
  description:
    "CalBliss builds AI voice agents that handle bookings and appointments for barbershops and small businesses — 24/7, automatically.",
  metadataBase: new URL("https://calbliss.com"),
  openGraph: {
    title: "CalBliss — Your bookings, handled.",
    description:
      "AI voice agents that handle bookings for your business — 24/7, automatically.",
    type: "website",
    url: "https://calbliss.com",
    siteName: "CalBliss",
  },
  twitter: {
    card: "summary_large_image",
    title: "CalBliss — Your bookings, handled.",
    description:
      "AI voice agents that handle bookings for your business — 24/7, automatically.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakartaSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <ScrollProgress />
        <Providers>{children}</Providers>
        <CookieBanner />
        <ChatWidget />
        {/* Plausible Analytics — privacy-friendly, no cookies required */}
        <Script
          defer
          data-domain="calbliss.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        {/* Google Tag Manager — add GTM_ID env var to activate */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
          </Script>
        )}
      </body>
    </html>
  )
}
