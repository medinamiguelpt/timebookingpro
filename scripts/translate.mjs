/**
 * Auto-translate messages/en.json into every other locale.
 *
 * Reads messages/en.json (single source of truth), prompts Claude to translate
 * the entire JSON to each target locale in one batch call, validates that the
 * output is valid JSON with the same key shape, writes messages/{locale}.json.
 *
 * Run:    node scripts/translate.mjs
 * Env:    ANTHROPIC_API_KEY
 *
 * Idempotent — every run regenerates all 6 locale files from en.json. Cost
 * per full run is roughly $0.50–$2 in Claude Sonnet tokens depending on how
 * much copy is in en.json.
 */

import Anthropic from "@anthropic-ai/sdk"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, "..")

const LOCALES = {
  "el":     "Greek (Modern, formal register)",
  "es-ES":  "European Spanish (Spain). Use the formal 'usted' register.",
  "pt-PT":  "European Portuguese (Portugal — NOT Brazilian). Use the formal register.",
  "fr-FR":  "French (France). Use the formal 'vous' register.",
  "de-DE":  "German (Germany). Use the formal 'Sie' register.",
  "ar-SA":  "Modern Standard Arabic (MSA), formal register.",
}

function buildPrompt(langDescription, sourceJson) {
  return `You are translating UI copy for a SaaS marketing website called TimeBookingPro — an AI voice-agent service that answers phone calls and handles bookings for small businesses (barbershops, salons, dental practices, etc.). The audience is small-business owners in the EU.

Target language: ${langDescription}

Translate the JSON below from English to the target language. Strict rules:

1. Output ONLY valid JSON. No commentary, no markdown code fences, no explanations before or after. Just the raw JSON.
2. Preserve the EXACT same structure, keys, and ordering. Translate ONLY the values, never the keys.
3. The brand name "TimeBookingPro" must stay as "TimeBookingPro" in every language — do not translate, do not transliterate.
4. Proper nouns and example names stay untranslated: "Greek Barber Festival", "Kostas", "Max", "Nova", "Aria", "Leo", "Sage", "Zara", "Carlos M.", "Sophie L.", "The Barber Studio", "Bloom Beauty Salon", "ElevenLabs", "Google Calendar", "Calendly", "Acuity", "Outlook", "Apple Calendar", "Stripe".
5. Tone: formal, professional, warm but not stiff — aimed at small-business owners. Use the formal register where the language distinguishes (vous/Sie/usted/voi).
6. Preserve formatting markers: em-dashes (—), middle dots (·), curly quotes (' '), and asterisk pairs around words (e.g. *word* in a headline marks gradient-text — keep the asterisks around the translated word).
7. Keep emoji exactly as-is (✦, ✓, ✂️, 📞, etc.).
8. Numbers, currency symbols (€, kr, zł), percentages (15%), and units (min/month, 24/7, 24 h) stay as-is.
9. For Arabic: use natural MSA. Numerals stay Western (123, not ١٢٣). Brand and proper nouns stay in Latin script.
10. Avoid hyper-literal translations — render the meaning naturally for a native reader of the target language.

Input JSON:
${sourceJson}

Output the translated JSON now.`
}

function stripFences(text) {
  return text
    .replace(/^\s*```(?:json)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim()
}

function sameKeyShape(a, b) {
  if (typeof a !== typeof b) return false
  if (typeof a !== "object" || a === null || b === null) return true
  const aKeys = Object.keys(a).sort()
  const bKeys = Object.keys(b).sort()
  if (aKeys.length !== bKeys.length) return false
  if (aKeys.some((k, i) => k !== bKeys[i])) return false
  return aKeys.every(k => sameKeyShape(a[k], b[k]))
}

async function main() {
  const enPath = resolve(ROOT, "messages/en.json")
  const enRaw = readFileSync(enPath, "utf8")
  const enParsed = JSON.parse(enRaw)
  const sourceJson = JSON.stringify(enParsed, null, 2)

  const client = new Anthropic()

  for (const [locale, langDescription] of Object.entries(LOCALES)) {
    process.stdout.write(`→ ${locale} ... `)

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      messages: [{ role: "user", content: buildPrompt(langDescription, sourceJson) }],
    })

    const block = response.content[0]
    if (!block || block.type !== "text") {
      throw new Error(`No text content from model for ${locale}`)
    }

    const cleaned = stripFences(block.text)

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch (err) {
      console.error(`\n✗ Invalid JSON for ${locale}:\n${cleaned.slice(0, 800)}\n`)
      throw err
    }

    if (!sameKeyShape(enParsed, parsed)) {
      throw new Error(`Key shape mismatch for ${locale} — model dropped/added keys`)
    }

    const outPath = resolve(ROOT, `messages/${locale}.json`)
    writeFileSync(outPath, JSON.stringify(parsed, null, 2) + "\n")
    console.log("✓")
  }

  console.log("\nAll locales translated.")
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
