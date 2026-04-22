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
      {/* Outer M-badge — traced from logo asset */}
      <path
        d="M14 0 L0 8 L0 48 L32 64 L64 48 L64 8 L50 0 L32 9 Z"
        fill="#7C3AED"
      />
      {/* Inner M-badge — same crown shape scaled inside; gap shows background */}
      <path
        d="M14.5 11 L21.3 26 L21 43 L32 53 L43 43 L42.9 26 L49.5 11 L39.1 26 L32 31 L25.4 26 Z"
        fill="#A855F7"
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
        <span className="font-heading text-xl tracking-tight text-foreground">
          <span className="font-bold">TimeBooking</span><span className="font-light opacity-75">Pro</span>
        </span>
      )}
    </div>
  )
}
