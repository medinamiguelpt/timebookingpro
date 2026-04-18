import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "CalBliss — Your bookings, handled."
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
          {/* Logo mark */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: "linear-gradient(135deg, #9333EA 0%, #5B21B6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 60px rgba(124,58,237,0.5)",
            }}
          >
            {/* Phone wave icon */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 24 }}>
                {[10, 20, 14, 24, 12, 18, 10].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: h,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.9)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

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
            CalBliss
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
          calbliss.com
        </div>
      </div>
    ),
    { ...size }
  )
}
