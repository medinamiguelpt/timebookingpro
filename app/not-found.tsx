import Link from "next/link"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <Logo className="mb-10" iconSize={48} />

      <p className="text-[10rem] font-heading font-extrabold text-primary/10 leading-none select-none mb-0">
        404
      </p>

      <h1 className="text-2xl sm:text-3xl font-heading font-bold mt-2 mb-3">
        This page doesn&apos;t exist
      </h1>
      <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed">
        But your AI booking agent will. Let&apos;s get you back on track.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-7 h-12 text-sm transition-colors shadow-lg shadow-primary/25"
      >
        Back to TimeBookingPro
      </Link>
    </div>
  )
}
