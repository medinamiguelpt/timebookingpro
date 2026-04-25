/**
 * Find unused components and unused lib exports across the project.
 * Run: node scripts/audit-unused.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, basename, extname, sep } from "node:path"

const SCAN_DIRS = ["app", "components", "lib", "i18n", "scripts"]

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e)
    const s = statSync(f)
    if (s.isDirectory()) walk(f, out)
    else if (/\.(tsx?|mjs)$/.test(e)) out.push(f)
  }
  return out
}

const allFiles = SCAN_DIRS.flatMap(d => walk(d))
const allContent = allFiles.map(f => ({ f, content: readFileSync(f, "utf8") }))

const componentFiles = walk("components")
console.log("=== UNUSED COMPONENT FILES ===")
let unusedComponents = 0
for (const c of componentFiles) {
  const base = basename(c, extname(c))
  // Convert Windows paths to forward-slash for import matching
  const fwd = c.replace(/\\/g, "/").replace(/\.tsx?$/, "")
  const importPaths = [
    `@/${fwd}`,
    `./${base}`,
    `../${base}`,
  ]
  const used = allContent.some(({ f, content }) => {
    if (f === c) return false
    return importPaths.some(p => content.includes(p))
  })
  if (!used) {
    console.log("  unused:", c)
    unusedComponents++
  }
}
if (unusedComponents === 0) console.log("  (none)")

console.log("\n=== UNUSED LIB EXPORTS ===")
let unusedExports = 0
for (const lf of walk("lib")) {
  const content = readFileSync(lf, "utf8")
  const exports = [...content.matchAll(/export\s+(?:const|function|interface|type|async\s+function)\s+(\w+)/g)].map(m => m[1])
  // Skip "default" and exports that are obviously transient
  for (const exp of exports) {
    const re = new RegExp(`\\b${exp}\\b`)
    const refs = allContent.filter(({ f }) => f !== lf).filter(({ content }) => re.test(content))
    if (refs.length === 0) {
      console.log("  unused export:", exp, "in", lf)
      unusedExports++
    }
  }
}
if (unusedExports === 0) console.log("  (none)")
