import type { Metadata } from 'next'
import { EmptyState } from '@/components/empty-state'
import { JournalList } from '@/components/journal/journal-list'
import { PageHeader } from '@/components/page-header'
import { getJournal } from '@/lib/content'

export const metadata: Metadata = { title: 'Journal' }

export default function JournalPage() {
  const entries = getJournal()
  return (
    <>
      <PageHeader title="Journal" description="One entry per day: what happened, what I learned." />
      {entries.length ? (
        <JournalList entries={entries} />
      ) : (
        <EmptyState
          title="Nothing here yet"
          description="Create today's entry, then it shows up here after the next build."
          hint="pnpm new:journal"
        />
      )}
    </>
  )
}