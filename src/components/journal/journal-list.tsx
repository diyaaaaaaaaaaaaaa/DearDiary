import Link from 'next/link'
import { formatDay } from '@/lib/dates'
import type { getJournal } from '@/lib/content'

type Entry = ReturnType<typeof getJournal>[number]

/** Entries grouped under month headings. Input must already be sorted newest-first. */
export function JournalList({ entries }: { entries: Entry[] }) {
  const groups = new Map<string, Entry[]>()
  for (const e of entries) {
    const key = e.date.slice(0, 7)
    groups.set(key, [...(groups.get(key) ?? []), e])
  }

  return (
    <div className="space-y-10">
      {[...groups.entries()].map(([month, items]) => (
        <section key={month}>
          <h2 className="mb-3 text-sm font-medium text-muted">
            {formatDay(`${month}-01`, { month: 'long', year: 'numeric' })}
          </h2>
          <ul className="divide-y divide-border border-y border-border">
            {items.map((e) => (
              <li key={e.slug} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
                <time dateTime={e.date.slice(0, 10)} className="w-16 shrink-0 font-mono text-xs text-muted">
                  {formatDay(e.date, { month: 'short', day: 'numeric' })}
                </time>
                <Link href={`/journal/${e.slug}`} className="min-w-0 flex-1 font-medium hover:text-accent">
                  {e.title}
                </Link>
                {e.mood !== undefined && <span className="text-xs text-muted">mood {e.mood}/5</span>}
                {e.energy !== undefined && <span className="text-xs text-muted">energy {e.energy}/5</span>}
                <span className="flex gap-2">
                  {e.tags.map((t) => (
                    <Link key={t} href={`/journal/tags/${encodeURIComponent(t)}`} className="text-xs text-muted hover:text-fg">
                      #{t}
                    </Link>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}