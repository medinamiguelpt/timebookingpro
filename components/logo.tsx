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
      <defs>
        <linearGradient
          id="cb-bg"
          x1="0" y1="0" x2="64" y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="64" height="64" rx="16" fill="url(#cb-bg)" />

      {/* Source dot — the agent */}
      <circle cx="10" cy="32" r="4" fill="white" />

      {/* Single fluid sine wave — the voice */}
      <path
        d="M 14 32 C 22 18, 30 18, 38 32 C 46 46, 54 46, 58 32"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
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
        <span className="font-heading font-semibold text-xl tracking-tight text-foreground">
          TimeBookingPro
        </span>
      )}
    </div>
  )
}
