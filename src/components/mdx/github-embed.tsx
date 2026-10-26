import { parseGithubUrl, type GithubRef } from '@/lib/github-url'

interface Summary {
  label: string
  title: string
  meta: string
}

/** One GitHub API call per embed, cached for a day. Returns null on any failure. */
async function loadSummary(ref: GithubRef): Promise<Summary | null> {
  const base = `https://api.github.com/repos/${ref.owner}/${ref.repo}`
  const path =
    ref.kind === 'repo' ? '' : ref.kind === 'commit' ? `/commits/${ref.sha}` : `/issues/${ref.number}`
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

  try {
    const res = await fetch(base + path, { headers, next: { revalidate: 86400 } })
    if (!res.ok) return null
    const data = await res.json()
    const label = `${ref.owner}/${ref.repo}`

    switch (ref.kind) {
      case 'repo':
        return {
          label,
          title: data.description ?? label,
          meta: [data.language, `${data.stargazers_count} stars`].filter(Boolean).join(' · '),
        }
      case 'commit':
        return { label, title: String(data.commit.message).split('\n')[0] ?? '', meta: `Commit ${String(data.sha).slice(0, 7)}` }
      default:
        return {
          label,
          title: data.title,
          meta: `${data.pull_request ? 'Pull request' : 'Issue'} #${data.number} · ${data.state}`,
        }
    }
  } catch {
    return null
  }
}

export async function GithubEmbed({ url }: { url: string }) {
  const ref = parseGithubUrl(url)
  const summary = ref ? await loadSummary(ref) : null

  // If GitHub is unreachable or rate-limited, fall back to a plain link. Never invent data.
  if (!summary) {
    return (
      <p>
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      </p>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="my-4 block rounded-lg border border-border bg-surface p-4 no-underline"
    >
      <span className="block font-mono text-xs text-muted">{summary.label}</span>
      <span className="mt-1 block text-sm font-medium">{summary.title}</span>
      <span className="mt-1 block text-xs text-muted">{summary.meta}</span>
    </a>
  )
}