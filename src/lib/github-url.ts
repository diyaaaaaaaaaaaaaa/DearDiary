/** Shared by the remark plugin (build-time detection) and the embed component (rendering). */

export const GITHUB_URL =
  /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)(?:\/(issues|pull)\/(\d+)|\/commit\/([0-9a-f]{7,40}))?\/?$/

export type GithubRef =
  | { kind: 'repo'; owner: string; repo: string }
  | { kind: 'issue' | 'pull'; owner: string; repo: string; number: string }
  | { kind: 'commit'; owner: string; repo: string; sha: string }

export function parseGithubUrl(url: string): GithubRef | null {
  const m = GITHUB_URL.exec(url)
  if (!m) return null
  const [, owner, repo, type, number, sha] = m
  if (!owner || !repo) return null
  if (type && number) return { kind: type === 'pull' ? 'pull' : 'issue', owner, repo, number }
  if (sha) return { kind: 'commit', owner, repo, sha }
  return { kind: 'repo', owner, repo }
}