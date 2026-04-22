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
      {/* Outer M-badge ring */}
      <path
        d="M32 61 L14 54 L4 38 L4 22 L14 5 L24 19 L32 23 L40 19 L50 5 L60 22 L60 38 L50 54 Z"
        fill="#7C3AED"
      />
      {/* Inner raised M-badge — background shows through the gap creating 3D depth */}
      <path
        d="M32 54 L20 48 L13 36 L13 25 L20 13 L27 22 L32 26 L37 22 L44 13 L51 25 L51 36 L44 48 Z"
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
