// src/components/journal/new-entry-dialog.tsx
'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const field = 'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm'
const scale = [1, 2, 3, 4, 5]

/** The browser's local calendar day as YYYY-MM-DD (en-CA formats dates that way). */
const localDay = () => new Date().toLocaleDateString('en-CA')
const optionalNumber = (v: FormDataEntryValue | null) => (v ? Number(v) : undefined)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Round "+" button and the form it opens. Rendered only in development (see layout.tsx).
 * Pick any date up to today to add past days. Press `n` anywhere to open it.
 */
export function NewEntryDialog({ template }: { template: string }) {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const [date, setDate] = useState('')
  const [max, setMax] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<{ message: string; existing?: string } | null>(null)

  const open = () => {
    const today = localDay()
    setDate(today)
    setMax(today)
    setError(null)
    dialog.current?.showModal()
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing = el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
      if (e.key === 'n' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey && !dialog.current?.open) {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  /** After saving, Velite needs a moment to rebuild. Wait until the new page exists before navigating. */
  async function waitForEntry(slug: string) {
    for (let i = 0; i < 20; i++) {
      const res = await fetch(`/journal/${slug}`, { cache: 'no-store' })
      if (res.ok) return
      await sleep(500)
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: form.get('date'),
          title: String(form.get('title')).trim() || undefined,
          mood: optionalNumber(form.get('mood')),
          energy: optionalNumber(form.get('energy')),
          tags: String(form.get('tags')).split(',').map((t) => t.trim()).filter(Boolean),
          body: String(form.get('body')),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError({ message: data.error ?? 'Could not save the entry.', existing: res.status === 409 ? String(form.get('date')) : undefined })
        return
      }
      await waitForEntry(data.slug)
      dialog.current?.close()
      router.push(`/journal/${data.slug}`)
    } catch {
      setError({ message: 'Could not reach the dev server.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="New journal entry"
        title="New entry (n)"
        className="fixed right-6 bottom-6 z-20 flex size-12 items-center justify-center rounded-full bg-accent text-bg shadow-lg hover:opacity-90"
      >
        <Plus className="size-6" />
      </button>

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto max-h-[90dvh] w-[min(40rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-border bg-bg p-6 text-fg backdrop:bg-black/60"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold">New journal entry</h2>

          <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Date</span>
              <input type="date" name="date" required value={date} max={max} onChange={(e) => setDate(e.target.value)} className={field} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Title (optional)</span>
              <input type="text" name="title" maxLength={120} placeholder="Defaults to the date" className={field} />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {(['mood', 'energy'] as const).map((name) => (
              <label key={name} className="block text-sm">
                <span className="mb-1 block text-muted capitalize">{name} (optional)</span>
                <select name={name} defaultValue="" className={field}>
                  <option value="">—</option>
                  {scale.map((n) => (
                    <option key={n} value={n}>
                      {n} / 5
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <label className="block text-sm">
              <span className="mb-1 block text-muted">Tags (comma separated)</span>
              <input type="text" name="tags" placeholder="dsa, nextjs" className={field} />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block text-muted">Entry (markdown)</span>
            <textarea name="body" rows={14} defaultValue={template} className={`${field} font-mono`} />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error.message}{' '}
              {error.existing && (
                <Link href={`/journal/${error.existing}`} onClick={() => dialog.current?.close()} className="underline">
                  Open it
                </Link>
              )}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => dialog.current?.close()} className="rounded-md px-3 py-2 text-sm text-muted hover:text-fg">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg disabled:opacity-60">
              {saving ? 'Saving…' : 'Save entry'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}