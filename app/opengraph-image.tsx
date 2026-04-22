import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "TimeBookingPro — Your bookings, handled."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0D0714",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Purple radial glow */}
        <div
          style={{
            position: "absolute",
            width: 800,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 65%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: "linear-gradient(to bottom, #7C3AED, #A78BFA, #7C3AED)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            zIndex: 1,
          }}
        >
          {/* Logo mark — M-badge */}
          <svg width="100" height="100" viewBox="0 0 64 64" fill="none">
            <path d="M32 61 L14 54 L4 38 L4 22 L14 5 L24 19 L32 23 L40 19 L50 5 L60 22 L60 38 L50 54 Z" fill="#7C3AED" />
            <path d="M32 54 L20 48 L13 36 L13 25 L20 13 L27 22 L32 26 L37 22 L44 13 L51 25 L51 36 L44 48 Z" fill="#A855F7" />
          </svg>

          {/* Brand name */}
          <div
            style={{
              color: "white",
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            TimeBookingPro
          </div>

          {/* Tagline */}
          <div
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: 30,
              textAlign: "center",
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            AI voice agents that fill your calendar — 24 hours a day
          </div>

          {/* Pill badges */}
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            {["Live in 24 hours", "No credit card", "Cancel any time"].map((text) => (
              <div
                key={text}
                style={{
                  background: "rgba(124,58,237,0.2)",
                  border: "1px solid rgba(124,58,237,0.4)",
                  borderRadius: 40,
                  padding: "10px 24px",
                  color: "#A78BFA",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 40,
            color: "rgba(255,255,255,0.25)",
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          timebookingpro.com
        </div>
      </div>
    ),
    { ...size }
  )
}
