import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // A/B test headline variant — sticky for 30 days
  if (!request.cookies.get("cb-variant")) {
    const variant = Math.random() < 0.5 ? "a" : "b"
    response.cookies.set("cb-variant", variant, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    })
    response.headers.set("x-variant", variant)
  } else {
    const variant = request.cookies.get("cb-variant")?.value ?? "a"
    response.headers.set("x-variant", variant)
  }

  return response
}

export const config = {
  matcher: ["/"],
}
