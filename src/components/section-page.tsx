import { notFound } from 'next/navigation'
import { sections } from '@/config/site'
import { getSectionCounts } from '@/lib/content'
import { EmptyState } from './empty-state'
import { PageHeader } from './page-header'

/**
 * Shared shell for sections whose full UI lands in a later milestone.
 * It reads real content counts, so it tells the truth about what exists.
 */
export function SectionPage({ href }: { href: string }) {
  const section = sections.find((s) => s.href === href)
  if (!section) notFound()
  const count = getSectionCounts()[href] ?? 0

  return (
    <>
      <PageHeader title={section.label} description={section.description} />
      {count > 0 ? (
        <p className="text-sm text-muted">
          {count} {count === 1 ? 'entry' : 'entries'} found. The listing arrives in Milestone {section.milestone}.
        </p>
      ) : section.contentDir ? (
        <EmptyState
          title="Nothing here yet"
          description={`Add an MDX file to ${section.contentDir} and it shows up here after the next build.`}
          hint={`${section.contentDir}/${section.example}`}
        />
      ) : (
        <EmptyState title="Not built yet" description={`This section arrives in Milestone ${section.milestone}.`} />
      )}
    </>
  )
}
