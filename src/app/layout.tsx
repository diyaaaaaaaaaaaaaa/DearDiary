import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { KeyboardNav } from '@/components/keyboard-nav'
import { MobileNav, Sidebar } from '@/components/layout/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/config/site'
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
        </ThemeProvider>
      </body>
    </html>
  )
}
