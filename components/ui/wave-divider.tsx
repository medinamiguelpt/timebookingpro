interface WaveDividerProps {
  flip?: boolean
  className?: string
  opacity?: number
}

export function WaveDivider({ flip = false, className = "", opacity = 1 }: WaveDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-none -my-1 ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="block w-full text-muted"
        style={{ height: 36 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,24 C240,48 480,0 720,24 C960,48 1200,0 1440,24 L1440,48 L0,48 Z"
          fill="currentColor"
          fillOpacity={opacity}
        />
      </svg>
    </div>
  )
}
