import { dsa, gate, journal, posts, projects, reading, reviews } from '#site/content'
import { toDayKey } from './dates'

/**
 * Typed, sorted access to compiled content. Pages import from here, never from
 * '#site/content' directly, so ordering and draft rules live in one place.
 */

const isDev = process.env.NODE_ENV === 'development'

export const getJournal = () => [...journal].sort((a, b) => b.date.localeCompare(a.date))
export const getDsa = () => [...dsa].sort((a, b) => b.firstSolved.localeCompare(a.firstSolved))
export const getGate = () => [...gate]
export const getProjects = () => [...projects].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
export const getPosts = () =>
  posts.filter((p) => isDev || !p.draft).sort((a, b) => b.date.localeCompare(a.date))
export const getReading = () => [...reading].sort((a, b) => b.date.localeCompare(a.date))
export const getReviews = () => [...reviews].sort((a, b) => b.month.localeCompare(a.month))

/** Entry counts keyed by section href — drives section pages and empty states. */
export function getSectionCounts(): Record<string, number> {
  return {
    '/journal': journal.length,
    '/dsa': dsa.length,
    '/gate': gate.length,
    '/projects': projects.length,
    '/writing': getPosts().length,
    '/reading': reading.length,
    '/reviews': reviews.length,
  }
}

export { toDayKey }
