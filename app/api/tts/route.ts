import { NextResponse } from "next/server"

const VOICE_ID = "EXAVITQu4vr4xnSDxMaL" // ElevenLabs "Bella" — warm, professional

export async function POST(req: Request) {
  const { text } = await req.json()
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text" }, { status: 400 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "TTS not configured" }, { status: 503 })
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_turbo_v2",
      voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.1 },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("[tts]", res.status, err)
    return NextResponse.json({ error: "TTS failed" }, { status: 502 })
  }

  const audio = await res.arrayBuffer()
  return new Response(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  })
}
