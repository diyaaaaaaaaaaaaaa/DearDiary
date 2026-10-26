export const siteConfig = {
  name: 'Engineering Journal',
  description: 'A public record of becoming a software engineer.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  /** IANA timezone used to decide what "today" means for streaks. */
  timezone: process.env.SITE_TIMEZONE ?? 'Asia/Kolkata',
} as const

export interface Section {
  href: string
  label: string
  /** Pressed after `g`, e.g. g then j */
  shortcut: string
  description: string
  /** Where entries live, relative to the repo root. Undefined if the section has no content directory. */
  contentDir?: string
  /** Frontmatter-bearing filename shown in empty states. */
  example?: string
  /** Milestone in which the section gets its real UI. */
  milestone: number
}

export const sections: Section[] = [
  { href: '/', label: 'Dashboard', shortcut: 'd', description: 'Where everything stands right now.', milestone: 1 },
  { href: '/journal', label: 'Journal', shortcut: 'j', description: 'One entry per day: what happened, what I learned.', contentDir: 'content/journal', example: '2026-07-08.mdx', milestone: 2 },
  { href: '/dsa', label: 'DSA', shortcut: 'a', description: 'Problems indexed by topic and pattern.', contentDir: 'content/dsa', example: 'two-sum.mdx', milestone: 3 },
  { href: '/gate', label: 'GATE', shortcut: 'g', description: 'Subject-wise progress, formulas, and revision.', contentDir: 'content/gate', example: 'operating-systems.mdx', milestone: 4 },
  { href: '/projects', label: 'Projects', shortcut: 'p', description: 'Things built, with the story behind them.', contentDir: 'content/projects', example: 'my-project.mdx', milestone: 5 },
  { href: '/writing', label: 'Writing', shortcut: 'w', description: 'Longer posts and technical write-ups.', contentDir: 'content/posts', example: 'my-first-post.mdx', milestone: 5 },
  { href: '/reading', label: 'Reading', shortcut: 'r', description: 'Books, articles, and videos with takeaways.', contentDir: 'content/reading', example: 'book-title.mdx', milestone: 5 },
  { href: '/reviews', label: 'Monthly Reviews', shortcut: 'm', description: 'Numbers and reflection, month by month.', contentDir: 'content/reviews', example: '2026-07.mdx', milestone: 6 },
  { href: '/search', label: 'Search', shortcut: 's', description: 'Find anything across every section.', milestone: 7 },
  { href: '/about', label: 'About', shortcut: 'i', description: 'What this site is and why it exists.', milestone: 5 },
]
