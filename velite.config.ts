import { defineCollection, defineConfig, s } from 'velite'

/**
 * Content schemas — the contract between your markdown and the site.
 * Frontmatter that doesn't match fails the build with a clear error,
 * so a typo never silently breaks a page or skews a stat.
 *
 * Dates are written as plain days (2026-07-08). Slugs come from the file path.
 */

const confidence = s.number().int().min(1).max(5)

const journal = defineCollection({
  name: 'JournalEntry',
  pattern: 'journal/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(120),
      date: s.isodate(),
      mood: confidence.optional(),
      energy: confidence.optional(),
      tags: s.array(s.string()).default([]),
      path: s.path(),
      body: s.mdx(),
    })
    .transform((d) => ({ ...d, slug: d.path.replace(/^journal\//, '') })),
})

const dsa = defineCollection({
  name: 'DsaProblem',
  pattern: 'dsa/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(120),
      platform: s.enum(['leetcode', 'gfg', 'codeforces', 'codechef', 'other']),
      url: s.string().url().optional(),
      difficulty: s.enum(['easy', 'medium', 'hard']),
      topic: s.string(),
      pattern: s.string().optional(),
      timeComplexity: s.string(),
      spaceComplexity: s.string(),
      confidence,
      firstSolved: s.isodate(),
      revised: s.array(s.isodate()).default([]),
      related: s.array(s.string()).default([]),
      tags: s.array(s.string()).default([]),
      path: s.path(),
      body: s.mdx(),
    })
    .transform((d) => ({ ...d, slug: d.path.replace(/^dsa\//, '') })),
})

const gate = defineCollection({
  name: 'GateSubject',
  pattern: 'gate/**/*.mdx',
  schema: s
    .object({
      title: s.string(),
      subject: s.enum([
        'programming',
        'data-structures',
        'algorithms',
        'operating-systems',
        'dbms',
        'computer-networks',
        'digital-logic',
        'toc',
        'compiler-design',
        'coa',
        'engineering-mathematics',
        'aptitude',
      ]),
      topics: s.array(s.object({ name: s.string(), done: s.boolean().default(false) })).default([]),
      weakTopics: s.array(s.string()).default([]),
      revisionCount: s.number().int().min(0).default(0),
      confidence: confidence.optional(),
      path: s.path(),
      body: s.mdx(),
    })
    .transform((d) => ({ ...d, slug: d.path.replace(/^gate\//, '') })),
})

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/**/*.mdx',
  schema: s
    .object({
      title: s.string(),
      summary: s.string().max(200),
      status: s.enum(['idea', 'in-progress', 'shipped', 'archived']),
      stack: s.array(s.string()).default([]),
      startedAt: s.isodate(),
      github: s.string().url().optional(),
      demo: s.string().url().optional(),
      hero: s.string().optional(),
      path: s.path(),
      body: s.mdx(),
    })
    .transform((d) => ({ ...d, slug: d.path.replace(/^projects\//, '') })),
})

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.mdx',
  schema: s
    .object({
      title: s.string(),
      summary: s.string().max(240),
      date: s.isodate(),
      tags: s.array(s.string()).default([]),
      draft: s.boolean().default(false),
      path: s.path(),
      metadata: s.metadata(),
      toc: s.toc(),
      body: s.mdx(),
    })
    .transform((d) => ({ ...d, slug: d.path.replace(/^posts\//, '') })),
})

const reading = defineCollection({
  name: 'ReadingEntry',
  pattern: 'reading/**/*.mdx',
  schema: s
    .object({
      title: s.string(),
      author: s.string(),
      kind: s.enum(['book', 'article', 'video']),
      status: s.enum(['queued', 'reading', 'finished']),
      date: s.isodate(),
      quote: s.string().optional(),
      path: s.path(),
      body: s.mdx(),
    })
    .transform((d) => ({ ...d, slug: d.path.replace(/^reading\//, '') })),
})

const reviews = defineCollection({
  name: 'MonthlyReview',
  pattern: 'reviews/**/*.mdx',
  schema: s
    .object({
      title: s.string(),
      month: s.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM'),
      path: s.path(),
      body: s.mdx(),
    })
    .transform((d) => ({ ...d, slug: d.path.replace(/^reviews\//, '') })),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { journal, dsa, gate, projects, posts, reading, reviews },
})
