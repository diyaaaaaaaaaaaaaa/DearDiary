#!/usr/bin/env node
/**
 * Create a journal entry from the template.
 *
 *   pnpm new:journal                       -> today's entry (in SITE_TIMEZONE)
 *   pnpm new:journal --date 2026-10-24     -> back-fill a specific day
 *   pnpm new:journal --title "Shipped M1"  -> custom title (defaults to the long date)
 *
 * Never overwrites an existing entry.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const TIMEZONE = process.env.SITE_TIMEZONE ?? 'Asia/Kolkata' // keep in sync with src/config/site.ts

const args = process.argv.slice(2).filter((a) => a !== '--')
function option(name) {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? undefined : args[i + 1]
}
function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date())

const date = option('date') ?? today
if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
  fail(`Invalid date "${date}". Use YYYY-MM-DD, e.g. 2026-10-24.`)
}
// Reject overflow like 2026-02-31, which Date.parse can silently roll forward.
if (new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) fail(`"${date}" is not a real calendar day.`)

const longDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))
const title = (option('title') ?? longDate).replace(/"/g, '\\"')

const dir = join(process.cwd(), 'content', 'journal')
const file = join(dir, `${date}.mdx`)
if (existsSync(file)) fail(`content/journal/${date}.mdx already exists. Nothing was changed.`)

const template = `---
title: "${title}"
date: ${date}
# mood: 1-5
# energy: 1-5
tags: []
---

## Today's Goals

## What I Worked On

## Problems Solved

## GATE Progress

## Project Progress

## What I Learned

## Biggest Mistake

## Interesting Thought

## Tomorrow

`

mkdirSync(dir, { recursive: true })
writeFileSync(file, template)
console.log(`✓ Created content/journal/${date}.mdx`)
