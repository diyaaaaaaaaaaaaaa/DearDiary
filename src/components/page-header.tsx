export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-10">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="mt-2 max-w-prose text-muted">{description}</p>}
    </header>
  )
}
