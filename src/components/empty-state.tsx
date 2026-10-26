export function EmptyState({ title, description, hint }: { title: string; description?: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {hint && <code className="mt-4 inline-block rounded-md bg-surface px-2 py-1 font-mono text-xs text-muted">{hint}</code>}
    </div>
  )
}
