import Link from 'next/link'
import { CardEmpty, DashboardCard, Metric } from '@/components/dashboard/card'
import { PageHeader } from '@/components/page-header'
import { getJournal, getPosts, getProjects, getReading } from '@/lib/content'
import { formatDay, todayKey } from '@/lib/dates'
import { dsaStats, gateProgress, recentFocus } from '@/lib/stats'

/** Stats depend on "today", so rebuild the page hourly even without a push. */
export const revalidate = 3600

export default function DashboardPage() {
  const dsa = dsaStats()
  const gate = gateProgress()
  const focus = recentFocus()
  const inProgress = getProjects().filter((p) => p.status === 'in-progress')
  const reading = getReading().filter((r) => r.status === 'reading')
  const latestEntry = getJournal()[0]
  const latestPost = getPosts()[0]

  return (
    <>
      <PageHeader title="Dashboard" description={formatDay(todayKey(), { dateStyle: 'full' })} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="DSA streak">
          <Metric value={dsa.streak} detail={dsa.total ? `Longest: ${dsa.longestStreak} days` : 'Solve a problem to start one.'} />
        </DashboardCard>

        <DashboardCard title="Problems solved">
          <Metric value={dsa.total} detail={`${dsa.easy} easy · ${dsa.medium} medium · ${dsa.hard} hard`} />
        </DashboardCard>

        <DashboardCard title="GATE progress">
          {gate.overall === null ? (
            <CardEmpty>No subjects with topics tracked yet.</CardEmpty>
          ) : (
            <Metric value={`${Math.round(gate.overall * 100)}%`} detail={`Across ${gate.subjects} subjects`} />
          )}
        </DashboardCard>

        <DashboardCard title="Projects in progress">
          {inProgress.length ? (
            <ul className="space-y-1 text-sm">
              {inProgress.map((p) => (
                <li key={p.slug}>{p.title}</li>
              ))}
            </ul>
          ) : (
            <CardEmpty>Nothing in progress.</CardEmpty>
          )}
        </DashboardCard>

        <DashboardCard title="Latest journal entry">
          {latestEntry ? (
            <>
              <Link href={`/journal/${latestEntry.slug}`} className="text-sm font-medium hover:text-accent">
                {latestEntry.title}
              </Link>
              <p className="mt-1 text-sm text-muted">{formatDay(latestEntry.date)}</p>
            </>
          ) : (
            <CardEmpty>No entries yet.</CardEmpty>
          )}
        </DashboardCard>

        <DashboardCard title="Latest post">
          {latestPost ? (
            <>
              <p className="text-sm font-medium">{latestPost.title}</p>
              <p className="mt-1 text-sm text-muted">
                {formatDay(latestPost.date)} · {latestPost.metadata.readingTime} min read
              </p>
            </>
          ) : (
            <CardEmpty>Nothing published yet.</CardEmpty>
          )}
        </DashboardCard>

        <DashboardCard title="Currently reading">
          {reading.length ? (
            <ul className="space-y-1 text-sm">
              {reading.map((r) => (
                <li key={r.slug}>
                  {r.title} <span className="text-muted">· {r.author}</span>
                </li>
              ))}
            </ul>
          ) : (
            <CardEmpty>Nothing marked as reading.</CardEmpty>
          )}
        </DashboardCard>

        <DashboardCard title="Focus, last 14 days">
          {focus.length ? (
            <ul className="space-y-1 text-sm">
              {focus.map((f) => (
                <li key={f.tag} className="flex justify-between">
                  <span>{f.tag}</span>
                  <span className="tabular-nums text-muted">{f.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <CardEmpty>Tag your journal entries and your focus areas appear here.</CardEmpty>
          )}
        </DashboardCard>

        <DashboardCard title="Recent GitHub activity">
          <CardEmpty>Connects in Milestone 8.</CardEmpty>
        </DashboardCard>

        <DashboardCard title="Upcoming goals" className="sm:col-span-2 lg:col-span-3">
          {latestEntry && latestEntry.tomorrow.length ? (
            <ul className="list-inside list-disc space-y-1 text-sm">
              {latestEntry.tomorrow.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          ) : (
            <CardEmpty>Add bullets under “## Tomorrow” in your latest journal entry.</CardEmpty>
          )}
        </DashboardCard>
      </div>
    </>
  )
}