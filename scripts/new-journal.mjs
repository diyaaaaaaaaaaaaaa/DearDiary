#!/usr/bin/env node
// scripts/new-journal.mjs
/**
 * Create a journal entry from the template.
 *
 *   pnpm new:journal                       -> today's entry (in SITE_TIMEZONE)
 *   pnpm new:journal --date 2026-10-24     -> back-fill a past day
 *   pnpm new:journal --title "Shipped M1"  -> custom title (defaults to the long date)
 *
 * Never overwrites an existing entry. Shares its logic with the "+" button.
 */
import { todayIn, writeEntry } from '../src/lib/journal-entry.mjs'

const TIMEZONE = process.env.SITE_TIMEZONE ?? 'Asia/Kolkata' // keep in sync with src/config/site.ts

const args = process.argv.slice(2).filter((a) => a !== '--')
function option(name) {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? undefined : args[i + 1]
}

const result = await writeEntry(
  process.cwd(),
  { date: option('date') ?? todayIn(TIMEZONE), title: option('title') },
  TIMEZONE,
)

if (!result.ok) {
  console.error(`✗ ${result.error} Nothing was changed.`)
  process.exit(1)
}
console.log(`✓ Created content/journal/${result.date}.mdx`)
