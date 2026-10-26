'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { sections } from '@/config/site'

/** Linear-style "go to" shortcuts: press `g`, then a section key (g j → Journal). */
export function KeyboardNav() {
  const router = useRouter()

  useEffect(() => {
    let armed = false
    let timer: ReturnType<typeof setTimeout>

    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing = el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return

      if (armed) {
        armed = false
        clearTimeout(timer)
        const target = sections.find((s) => s.shortcut === e.key.toLowerCase())
        if (target) {
          e.preventDefault()
          router.push(target.href)
        }
        return
      }
      if (e.key === 'g') {
        armed = true
        timer = setTimeout(() => (armed = false), 1000)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(timer)
    }
  }, [router])

  return null
}
