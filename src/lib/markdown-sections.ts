/** Reduce inline markdown to plain text: [label](url) -> label, and drop emphasis/code markers. */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(\*|_)(.+?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

/**
 * Pull the bullet items out of one `## Heading` section of raw markdown.
 * Used at build time (see velite.config.ts) to turn the "Tomorrow" section of a
 * journal entry into structured goals for the dashboard.
 *
 * - Matches the heading case-insensitively, at level 2 only.
 * - Stops at the next `##` heading.
 * - Ignores anything inside fenced code blocks.
 * - Strips task-list checkboxes ("- [ ] Do X" -> "Do X") and inline markdown, so items are plain text.
 */
export function extractBullets(markdown: string, heading: string): string[] {
  const target = heading.trim().toLowerCase()
  const bullets: string[] = []
  let inSection = false
  let inFence = false

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const h2 = /^##\s+(.+?)\s*#*\s*$/.exec(line)
    if (h2) {
      if (inSection) break
      inSection = h2[1]?.toLowerCase() === target
      continue
    }
    if (!inSection) continue

    const bullet = /^\s*[-*+]\s+(?:\[[ xX]\]\s+)?(.+)$/.exec(line)
    if (bullet?.[1]) bullets.push(stripInlineMarkdown(bullet[1]))
  }
  return bullets
}