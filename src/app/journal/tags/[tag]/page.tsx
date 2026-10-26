import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JournalList } from '@/components/journal/journal-list'
import { PageHeader } from '@/components/page-header'
import { getJournal } from '@/lib/content'

type Params = Promise<{ tag: string }>

export function generateStaticParams() {
  return [...new Set(getJournal().flatMap((e) => e.tags))].map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const tag = decodeURIComponent((await params).tag)
  return { title: `#${tag}` }
}

export default async function TagPage({ params }: { params: Params }) {
  const tag = decodeURIComponent((await params).tag)
  const entries = getJournal().filter((e) => e.tags.includes(tag))
  if (!entries.length) notFound()

  return (
    <>
      <PageHeader title={`#${tag}`} description={`${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`} />
      <JournalList entries={entries} />
      <Link href="/journal" className="mt-10 inline-block text-sm text-muted hover:text-fg">
        ← All entries
      </Link>
    </>
  )
}