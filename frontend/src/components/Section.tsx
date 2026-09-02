import type { ReactNode } from 'react'

export function Section({
  id,
  children,
  className = '',
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`relative border-t border-border px-6 py-24 md:px-12 lg:px-20 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

export function SectionHeading({
  label,
  title,
  description,
  action,
}: {
  label: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-14 flex animate-fade-up flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-muted uppercase">{label}</p>
        <h2 className="text-4xl font-semibold tracking-tight text-fg md:text-5xl">{title}</h2>
        {description && <p className="mt-4 max-w-xl text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
