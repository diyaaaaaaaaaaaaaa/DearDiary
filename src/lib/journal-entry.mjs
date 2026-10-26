// src/lib/journal-entry.mjs
//
// Single source of truth for creating a journal entry file. Used by both the
// CLI (scripts/new-journal.mjs) and the dev-only "+" button (src/app/api/journal).
// Plain .mjs so Node can run it directly; types live in journal-entry.d.mts.

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const SECTION_TEMPLATE = `## Today's Goals

## What I Worked On

## Problems Solved

## GATE Progress

## Project Progress

## What I Learned

## Biggest Mistake

## Interesting Thought

## Tomorrow
`

const MAX_TITLE = 120 // matches the Velite schema
const MAX_TAG = 40
const MAX_BODY = 200_000

/** True for a real calendar day in YYYY-MM-DD form (rejects 2026-02-31). */
export function isRealDay(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false
  const d = new Date(`${day}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === day
}

/** Today's date (YYYY-MM-DD) in the given IANA timezone. */
export function todayIn(timeZone) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

export function longDate(day) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${day}T00:00:00Z`))
}

const fail = (status, error) => ({ ok: false, status, error })

/** Validate untrusted input. Returns { ok: true, value } with cleaned fields, or { ok: false, status, error }. */
function validate(input, timeZone) {
  if (typeof input !== 'object' || input === null) return fail(400, 'Invalid request.')
  const { date, title, mood, energy, tags, body } = input

  if (typeof date !== 'string' || !isRealDay(date)) return fail(400, 'Pick a valid date.')
  if (date > todayIn(timeZone)) return fail(400, 'Entries can’t be dated in the future.')

  if (title != null && (typeof title !== 'string' || title.length > MAX_TITLE)) {
    return fail(400, `Title must be ${MAX_TITLE} characters or fewer.`)
  }
  for (const [name, value] of [['Mood', mood], ['Energy', energy]]) {
    if (value != null && !(Number.isInteger(value) && value >= 1 && value <= 5)) {
      return fail(400, `${name} must be a whole number from 1 to 5.`)
    }
  }

  let cleanTags = []
  if (tags != null) {
    if (!Array.isArray(tags) || tags.some((t) => typeof t !== 'string')) return fail(400, 'Tags must be a list of words.')
    cleanTags = [...new Set(tags.map((t) => t.trim()).filter(Boolean))]
    if (cleanTags.some((t) => t.length > MAX_TAG)) return fail(400, `Each tag must be ${MAX_TAG} characters or fewer.`)
  }

  if (body != null && (typeof body !== 'string' || body.length > MAX_BODY)) return fail(400, 'Entry text is too long.')

  return {
    ok: true,
    value: {
      date,
      title: title?.trim() || longDate(date),
      mood: mood ?? undefined,
      energy: energy ?? undefined,
      tags: cleanTags,
      body: body?.trim() ? body : SECTION_TEMPLATE,
    },
  }
}

/** Frontmatter + body. JSON.stringify gives valid YAML quoting for titles and tags. */
function render({ date, title, mood, energy, tags, body }) {
  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    `date: ${date}`,
    mood ? `mood: ${mood}` : '# mood: 1-5',
    energy ? `energy: ${energy}` : '# energy: 1-5',
    `tags: ${JSON.stringify(tags)}`,
    '---',
    '',
    body.trimEnd(),
    '',
  ].join('\n')
}

/**
 * Validate and write content/journal/<date>.mdx under `root`.
 * Never overwrites: the 'wx' flag makes creation atomic, so two quick saves can't clobber each other.
 */
export async function writeEntry(root, input, timeZone) {
  const checked = validate(input, timeZone)
  if (!checked.ok) return checked

  const { date } = checked.value
  const dir = join(root, 'content', 'journal')
  await mkdir(dir, { recursive: true })
  try {
    await writeFile(join(dir, `${date}.mdx`), render(checked.value), { flag: 'wx' })
  } catch (err) {
    if (err && err.code === 'EEXIST') return fail(409, `An entry for ${date} already exists.`)
    throw err
  }
  return { ok: true, date }
}
