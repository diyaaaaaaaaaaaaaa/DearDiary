# Engineering Journal

A public learning OS. Write markdown in `content/`, push, and the site rebuilds its own stats.

## Run

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm typecheck
```

## Layout

```
content/        MDX source of truth (journal, dsa, gate, projects, posts, reading, reviews)
velite.config.ts  Frontmatter schemas — a bad field fails the build with a clear message
src/app/        Routes
src/components/ UI (layout/, dashboard/, shared pieces)
src/config/     site.ts: site metadata and the section list that drives nav + shortcuts
src/lib/        content access, stats, streak math, dates
```

## Notes

- Streaks use the `SITE_TIMEZONE` env var (default `Asia/Kolkata`). Write dates as plain days: `2026-07-08`.
- The dashboard revalidates hourly so streaks reset correctly without a push.
- Keyboard: press `g`, then `d j a g p w r m s i` to jump between sections.
- Nothing in the dashboard is hardcoded. Empty cards mean no matching content exists yet.
