import 'katex/dist/katex.min.css' // required for math to render correctly (hides the duplicate MathML layer)
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXContent } from '@/components/mdx/mdx-content'
import { getJournal } from '@/lib/content'
import { formatDay } from '@/lib/dates'

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return getJournal().map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const entry = getJournal().find((e) => e.slug === slug)
  return { title: entry?.title }
}

export default async function JournalEntryPage({ params }: { params: Params }) {
  const { slug } = await params
  const entries = getJournal() // newest first
  const index = entries.findIndex((e) => e.slug === slug)
  const entry = entries[index]
  if (!entry) notFound()

  const newer = entries[index - 1]
  const older = entries[index + 1]

  return (
    <article>
      <header className="mb-10">
        <time dateTime={entry.date.slice(0, 10)} className="text-sm text-muted">
          {formatDay(entry.date, { dateStyle: 'full' })}
        </time>
        <h1 className="mt-2 text-2xl font-semibold">{entry.title}</h1>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {entry.mood !== undefined && <span>Mood {entry.mood}/5</span>}
          {entry.energy !== undefined && <span>Energy {entry.energy}/5</span>}
          {entry.tags.map((t) => (
            <Link key={t} href={`/journal/tags/${encodeURIComponent(t)}`} className="hover:text-fg">
              #{t}
            </Link>
          ))}
        </p>
      </header>

      <MDXContent code={entry.body} />

      <nav aria-label="Entry navigation" className="mt-16 flex justify-between gap-6 border-t border-border pt-6 text-sm">
        {older ? (
          <Link href={`/journal/${older.slug}`} className="text-muted hover:text-fg">
            ← {older.title}
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link href={`/journal/${newer.slug}`} className="text-right text-muted hover:text-fg">
            {newer.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}