/**
 * One-off Tailwind logical-property sweep.
 *
 * Walks every .tsx file under components/ and app/, converts directional
 * class names to logical-property equivalents so they auto-mirror under
 * <html dir="rtl">. Idempotent — running it twice is a no-op (the patterns
 * only match the LTR-flavoured names).
 *
 * Run:  node scripts/rtl-sweep.mjs
 *
 * Conversions:
 *   ml-X            → ms-X        (margin-inline-start)
 *   mr-X            → me-X        (margin-inline-end)
 *   pl-X            → ps-X        (padding-inline-start)
 *   pr-X            → pe-X        (padding-inline-end)
 *   ml-auto         → ms-auto
 *   mr-auto         → me-auto
 *   text-left       → text-start
 *   text-right      → text-end
 *   border-l(-X)    → border-s(-X)
 *   border-r(-X)    → border-e(-X)
 *   rounded-l-X     → rounded-s-X
 *   rounded-r-X     → rounded-e-X
 *   rounded-tl-X    → rounded-ss-X (top-start)
 *   rounded-tr-X    → rounded-se-X (top-end)
 *   rounded-bl-X    → rounded-es-X (bottom-start)
 *   rounded-br-X    → rounded-ee-X (bottom-end)
 *
 * NOT converted (need case-by-case judgment):
 *   left-X / right-X — absolute positioning. Sometimes intentional.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { join, extname } from "node:path"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, "..")

const SCAN_DIRS = ["components", "app"]
const EXTS = new Set([".tsx", ".ts"])
const SKIP = new Set(["node_modules", ".next", ".git"])

// Each pattern is a regex paired with its replacement. We use boundary-checks
// to avoid false matches inside identifiers like `pricing` (which contains "ri").
const REPLACEMENTS = [
  // Margin / padding with size
  [/(?<![\w-])ml-(\w)/g, "ms-$1"],
  [/(?<![\w-])mr-(\w)/g, "me-$1"],
  [/(?<![\w-])pl-(\w)/g, "ps-$1"],
  [/(?<![\w-])pr-(\w)/g, "pe-$1"],

  // Auto margins
  [/(?<![\w-])ml-auto(?![\w-])/g, "ms-auto"],
  [/(?<![\w-])mr-auto(?![\w-])/g, "me-auto"],

  // Text alignment (only horizontal — text-center stays center)
  [/(?<![\w-])text-left(?![\w-])/g, "text-start"],
  [/(?<![\w-])text-right(?![\w-])/g, "text-end"],

  // Borders — shorthand and sized variants
  [/(?<![\w-])border-l(?![\w-])/g, "border-s"],
  [/(?<![\w-])border-r(?![\w-])/g, "border-e"],

  // Rounded corners — 4 corners and 2 sides
  [/(?<![\w-])rounded-tl-(\w)/g, "rounded-ss-$1"],
  [/(?<![\w-])rounded-tr-(\w)/g, "rounded-se-$1"],
  [/(?<![\w-])rounded-bl-(\w)/g, "rounded-es-$1"],
  [/(?<![\w-])rounded-br-(\w)/g, "rounded-ee-$1"],
  [/(?<![\w-])rounded-tl(?![\w-])/g, "rounded-ss"],
  [/(?<![\w-])rounded-tr(?![\w-])/g, "rounded-se"],
  [/(?<![\w-])rounded-bl(?![\w-])/g, "rounded-es"],
  [/(?<![\w-])rounded-br(?![\w-])/g, "rounded-ee"],
  [/(?<![\w-])rounded-l-(\w)/g, "rounded-s-$1"],
  [/(?<![\w-])rounded-r-(\w)/g, "rounded-e-$1"],
  [/(?<![\w-])rounded-l(?![\w-])/g, "rounded-s"],
  [/(?<![\w-])rounded-r(?![\w-])/g, "rounded-e"],
]

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) yield* walk(full)
    else if (EXTS.has(extname(entry))) yield full
  }
}

let changedFiles = 0
let totalEdits = 0

for (const dir of SCAN_DIRS) {
  for (const file of walk(resolve(ROOT, dir))) {
    let content = readFileSync(file, "utf8")
    let edits = 0
    for (const [pat, rep] of REPLACEMENTS) {
      const before = content
      content = content.replace(pat, rep)
      const matches = before.match(pat)
      if (matches) edits += matches.length
    }
    if (edits > 0) {
      writeFileSync(file, content)
      console.log(`${edits.toString().padStart(3)}  ${file.replace(ROOT, "")}`)
      changedFiles++
      totalEdits += edits
    }
  }
}

console.log(`\n${totalEdits} replacements across ${changedFiles} files.`)
