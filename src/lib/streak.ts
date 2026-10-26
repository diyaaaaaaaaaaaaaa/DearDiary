import { shiftDay, type DayKey } from './dates'

/**
 * Current streak: consecutive days with activity, ending today.
 * If today has no activity yet, the streak is still alive as long as yesterday had some —
 * you haven't broken it until the day is over.
 */
export function currentStreak(days: Iterable<DayKey>, today: DayKey): number {
  const set = new Set(days)
  let cursor = set.has(today) ? today : shiftDay(today, -1)
  let count = 0
  while (set.has(cursor)) {
    count++
    cursor = shiftDay(cursor, -1)
  }
  return count
}

/** Longest run of consecutive days with activity, ever. */
export function longestStreak(days: Iterable<DayKey>): number {
  const sorted = [...new Set(days)].sort()
  let best = 0
  let run = 0
  let prev: DayKey | null = null
  for (const day of sorted) {
    run = prev !== null && shiftDay(prev, 1) === day ? run + 1 : 1
    best = Math.max(best, run)
    prev = day
  }
  return best
}
