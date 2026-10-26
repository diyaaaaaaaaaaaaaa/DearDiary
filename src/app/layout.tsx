// src/app/layout.tsx
import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { NewEntryDialog } from '@/components/journal/new-entry-dialog'
import { KeyboardNav } from '@/components/keyboard-nav'
import { MobileNav, Sidebar } from '@/components/layout/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/config/site'
import { SECTION_TEMPLATE } from '@/lib/journal-entry.mjs'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <ThemeProvider>
          <div className="min-h-dvh md:grid md:grid-cols-[232px_1fr]">
            <Sidebar />
            <div className="min-w-0">
              <MobileNav />
              <main className="mx-auto w-full max-w-5xl px-5 py-10 md:px-10 md:py-14">{children}</main>
            </div>
          </div>
          <KeyboardNav />
          {/* Writing files only works on your machine, so the button exists only in `pnpm dev`. */}
          {process.env.NODE_ENV === 'development' && <NewEntryDialog template={SECTION_TEMPLATE} />}
        </ThemeProvider>
      </body>
    </html>
  )
}