'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sections } from '@/config/site'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '../theme-toggle'

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border px-3 py-5 md:flex">
      <Link href="/" className="mb-6 px-2 text-sm font-semibold tracking-tight">
        {siteConfig.name}
      </Link>
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-0.5">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            aria-current={isActive(pathname, s.href) ? 'page' : undefined}
            className={cn(
              'group flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-muted hover:bg-surface hover:text-fg',
              isActive(pathname, s.href) && 'bg-surface text-fg',
            )}
          >
            {s.label}
            <kbd className="font-mono text-xs opacity-0 group-hover:opacity-60">g {s.shortcut}</kbd>
          </Link>
        ))}
      </nav>
      <div className="flex items-center justify-between px-2 pt-4">
        <span className="text-xs text-muted">
          <kbd className="font-mono">g</kbd> then a key to jump
        </span>
        <ThemeToggle />
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg md:hidden">
      <div className="flex items-center justify-between px-4 pt-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <ThemeToggle />
      </div>
      <nav aria-label="Primary" className="flex gap-1 overflow-x-auto px-3 py-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            aria-current={isActive(pathname, s.href) ? 'page' : undefined}
            className={cn(
              'shrink-0 rounded-md px-2.5 py-1 text-sm text-muted',
              isActive(pathname, s.href) && 'bg-surface text-fg',
            )}
          >
            {s.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
