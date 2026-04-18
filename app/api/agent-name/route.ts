import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

export async function POST(req: Request) {
  const { business } = await req.json()

  const businessContext = business?.trim()
    ? `The business is called "${business}".`
    : "The business is a barbershop or salon."

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 120,
      messages: [
        {
          role: "user",
          content: `You are naming an AI voice agent for a small business. ${businessContext}

Generate exactly 5 short, friendly, professional first names for this AI agent. Names should feel warm and approachable — like a real receptionist. Mix classic and modern names.

Reply with ONLY the 5 names as a JSON array of strings, nothing else. Example: ["Max","Nova","Aria","Leo","Zara"]`,
        },
      ],
    })

    const text = (message.content[0] as { type: string; text: string }).text.trim()
    const names: string[] = JSON.parse(text)

    if (!Array.isArray(names) || names.length === 0) {
      throw new Error("Invalid response format")
    }

    return NextResponse.json({ names: names.slice(0, 5) })
  } catch (err) {
    console.error("[agent-name] Error:", err)
    return NextResponse.json(
      { names: ["Max", "Nova", "Aria", "Leo", "Sage"] },
      { status: 200 }
    )
  }
}
