// src/lib/journal-entry.d.mts
export const SECTION_TEMPLATE: string

export interface EntryInput {
  date: string
  title?: string
  mood?: number
  energy?: number
  tags?: string[]
  body?: string
}

export type WriteResult = { ok: true; date: string } | { ok: false; status: number; error: string }

export function isRealDay(day: string): boolean
export function todayIn(timeZone: string): string
export function longDate(day: string): string
export function writeEntry(root: string, input: unknown, timeZone: string): Promise<WriteResult>
