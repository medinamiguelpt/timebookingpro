import { cn } from "@/lib/utils"

interface LogoIconProps {
  className?: string
  size?: number
}

export function LogoIcon({ className, size = 36 }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Badge ring — outer M-crown shape minus hollow interior (evenodd) */}
      <path
        fillRule="evenodd"
        fill="#7C3AED"
        d="M14 0 L0 9 L0 43 L32 64 L64 43 L64 9 L51 0 L32 9 Z M11 13 L53 13 L53 43 L32 55 L11 43 Z"
      />
      {/* Large chevron (upper V) */}
      <path d="M15 16 L32 27 L49 16" stroke="#A855F7" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Small chevron (lower V) */}
      <path d="M21 31 L32 41 L43 31" stroke="#A855F7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

interface LogoProps {
  className?: string
  iconSize?: number
  showWordmark?: boolean
}

export function Logo({
  className,
  iconSize = 36,
  showWordmark = true,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoIcon size={iconSize} />
      {showWordmark && (
        <span className="font-heading text-xl tracking-tight text-foreground">
          <span className="font-bold">TimeBooking</span><span className="font-light opacity-75">Pro</span>
        </span>
      )}
    </div>
  )
}
