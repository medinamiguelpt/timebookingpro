/**
 * Auto-translate messages/en.json into every other locale via DeepL.
 *
 * Reads messages/en.json, flattens to leaf-string array preserving paths,
 * wraps brand/proper nouns in <ignore> XML tags so DeepL leaves them
 * alone, batches all values into a single DeepL call per target locale,
 * unwraps the tags, rebuilds the JSON tree, writes messages/{locale}.json.
 *
 * Run:    node scripts/translate.mjs
 * Env:    DEEPL_API_KEY  — get a free key at https://www.deepl.com/pro-api
 *                          free tier: 500,000 chars/month, plenty for us
 *
 * Idempotent — every run regenerates all 6 locale files from en.json.
 * Free-tier keys end with ":fx" and route to api-free.deepl.com automatically.
 */

import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, "..")

const DEEPL_API_KEY = process.env.DEEPL_API_KEY
if (!DEEPL_API_KEY) {
  console.error("DEEPL_API_KEY is not set.")
  console.error("Get a free key (500k chars/month) at https://www.deepl.com/pro-api,")
  console.error("then export DEEPL_API_KEY=... before running this script.")
  process.exit(1)
}

// DeepL hosts a separate origin for free-tier keys. Free keys are suffixed `:fx`.
const ENDPOINT = DEEPL_API_KEY.endsWith(":fx")
  ? "https://api-free.deepl.com/v2/translate"
  : "https://api.deepl.com/v2/translate"

/**
 * Locale → DeepL target_lang + formality. DeepL only supports `formality`
 * for a subset of target languages; for the rest we pass null and DeepL
 * renders in the natural register (typically formal for written contexts).
 *
 * Greek (EL) and Arabic (AR) don't support `formality`. DeepL's MSA Arabic
 * and modern Greek are formal by default for written content.
 */
const LOCALES = {
  "el":     { target: "EL",    formality: null          },
  "es-ES":  { target: "ES",    formality: "prefer_more" },
  "pt-PT":  { target: "PT-PT", formality: "prefer_more" },
  "fr-FR":  { target: "FR",    formality: "prefer_more" },
  "de-DE":  { target: "DE",    formality: "prefer_more" },
  "ar-SA":  { target: "AR",    formality: null          },
}

/** Terms wrapped in <ignore> tags so DeepL passes them through unchanged. */
const PROTECTED_TERMS = [
  "TimeBookingPro",
  "Greek Barber Festival",
  "Kostas",
  "Max", "Nova", "Aria", "Leo", "Sage", "Zara",
  "Carlos M.",
  "The Barber Studio",
  "ElevenLabs",
  "Google Calendar", "Calendly", "Acuity", "Outlook", "Apple Calendar",
  "Stripe", "Resend", "Twilio",
]

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function protectTerms(text) {
  let out = text
  for (const term of PROTECTED_TERMS) {
    // \b doesn't work cleanly across Unicode, but our source is English
    // and the protected terms are Latin-script, so word-boundary is fine.
    const re = new RegExp(`\\b${escapeRegex(term)}\\b`, "g")
    out = out.replace(re, `<ignore>${term}</ignore>`)
  }
  return out
}

function unprotectTerms(text) {
  return text.replace(/<ignore>([\s\S]*?)<\/ignore>/g, "$1")
}

/** Collect every leaf string from a JSON tree as { path: string[], value: string }. */
function flattenLeaves(obj) {
  const leaves = []
  const walk = (node, path) => {
    if (typeof node === "string") {
      leaves.push({ path: [...path], value: node })
    } else if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, [...path, String(i)]))
    } else if (typeof node === "object" && node !== null) {
      for (const [k, v] of Object.entries(node)) {
        walk(v, [...path, k])
      }
    }
  }
  walk(obj, [])
  return leaves
}

function setLeafValue(obj, path, value) {
  let node = obj
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    node = Array.isArray(node) ? node[Number(key)] : node[key]
  }
  const last = path[path.length - 1]
  if (Array.isArray(node)) node[Number(last)] = value
  else node[last] = value
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

async function translateBatch(texts, targetLang, formality) {
  // DeepL accepts repeated `text` form fields for batch translation.
  const params = new URLSearchParams()
  for (const t of texts) params.append("text", t)
  params.append("source_lang", "EN")
  params.append("target_lang", targetLang)
  params.append("tag_handling", "xml")
  params.append("ignore_tags", "ignore")
  if (formality) params.append("formality", formality)

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "timebookingpro-translate/1.0",
    },
    body: params.toString(),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`DeepL ${res.status} for ${targetLang}: ${body}`)
  }

  const data = await res.json()
  if (!Array.isArray(data.translations) || data.translations.length !== texts.length) {
    throw new Error(`Unexpected DeepL response shape for ${targetLang}: ${JSON.stringify(data).slice(0, 300)}`)
  }
  return data.translations.map((t) => unprotectTerms(t.text))
}

async function main() {
  const enPath = resolve(ROOT, "messages/en.json")
  const en = JSON.parse(readFileSync(enPath, "utf8"))

  const leaves = flattenLeaves(en)
  const totalChars = leaves.reduce((acc, l) => acc + l.value.length, 0)
  console.log(`Source: ${leaves.length} strings, ${totalChars} characters`)
  console.log(`Endpoint: ${ENDPOINT}\n`)

  for (const [locale, { target, formality }] of Object.entries(LOCALES)) {
    process.stdout.write(`→ ${locale} (DeepL ${target}${formality ? `, ${formality}` : ""}) ... `)

    const protectedTexts = leaves.map((l) => protectTerms(l.value))
    const translated = await translateBatch(protectedTexts, target, formality)

    const out = deepClone(en)
    leaves.forEach((leaf, i) => setLeafValue(out, leaf.path, translated[i]))

    writeFileSync(resolve(ROOT, `messages/${locale}.json`), JSON.stringify(out, null, 2) + "\n")
    console.log("✓")
  }

  console.log(`\nAll locales translated. Used ~${totalChars * Object.keys(LOCALES).length} chars from your DeepL budget.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
