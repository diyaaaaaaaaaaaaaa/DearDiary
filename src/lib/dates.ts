import { siteConfig } from '@/config/site'

/** A calendar day as YYYY-MM-DD. All streak math works on these, never on timestamps. */
export type DayKey = string

export function toDayKey(iso: string): DayKey {
  return iso.slice(0, 10)
}

/** Today's date in the site's timezone (not the server's — Vercel runs in UTC). */
export function todayKey(now = new Date()): DayKey {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: siteConfig.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function shiftDay(day: DayKey, delta: number): DayKey {
  const d = new Date(`${day}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

export function formatDay(iso: string, options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }): string {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(
    new Date(`${toDayKey(iso)}T00:00:00Z`),
  )
}
