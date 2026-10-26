import { currentStreak, longestStreak } from './streak'
import { getDsa, getGate, getJournal } from './content'
import { shiftDay, toDayKey, todayKey } from './dates'

/** Everything the dashboard shows is derived here from content. No manual numbers. */

export function dsaStats() {
  const problems = getDsa()
  // Activity days = every day a problem was first solved or revised.
  const days = problems.flatMap((p) => [toDayKey(p.firstSolved), ...p.revised.map(toDayKey)])
  const today = todayKey()
  return {
    total: problems.length,
    easy: problems.filter((p) => p.difficulty === 'easy').length,
    medium: problems.filter((p) => p.difficulty === 'medium').length,
    hard: problems.filter((p) => p.difficulty === 'hard').length,
    streak: currentStreak(days, today),
    longestStreak: longestStreak(days),
  }
}

/** Completion per subject = done topics / total topics. Overall = mean across subjects that track topics. */
export function gateProgress() {
  const subjects = getGate()
    .filter((s) => s.topics.length > 0)
    .map((s) => ({ title: s.title, completion: s.topics.filter((t) => t.done).length / s.topics.length }))
  const overall = subjects.length ? subjects.reduce((sum, s) => sum + s.completion, 0) / subjects.length : null
  return { subjects: subjects.length, overall }
}

/** Most-used journal tags over the last `windowDays` days. */
export function recentFocus(windowDays = 14, limit = 5) {
  const since = shiftDay(todayKey(), -windowDays)
  const counts = new Map<string, number>()
  for (const entry of getJournal()) {
    if (toDayKey(entry.date) < since) continue
    for (const tag of entry.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }))
}
