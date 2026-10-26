import { cn } from '@/lib/utils'

export function DashboardCard({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-lg border border-border bg-surface p-5', className)}>
      <h2 className="text-sm font-medium text-muted">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function Metric({ value, detail }: { value: string | number; detail?: string }) {
  return (
    <>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      {detail && <p className="mt-1 text-sm text-muted">{detail}</p>}
    </>
  )
}

export function CardEmpty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>
}
