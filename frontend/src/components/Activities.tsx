import type { ActivityEvent } from '../types'
import { Section, SectionHeading } from './Section'

export function Activities({ activities }: { activities: ActivityEvent[] }) {
  if (activities.length === 0) return null

  return (
    <Section id="activities">
      <SectionHeading label="Activities" title="Timeline" description="RE:ACT의 활동 연혁이에요." />

      <div className="flex flex-col">
        {activities.map((a) => (
          <a
            key={a.id}
            href={a.link || undefined}
            target={a.link ? '_blank' : undefined}
            rel="noreferrer"
            className={`group grid grid-cols-1 gap-2 border-b border-border py-6 sm:grid-cols-[140px_1fr_auto] sm:items-center sm:gap-6 ${
              a.link ? 'cursor-pointer' : ''
            }`}
          >
            <span className="font-mono text-xs tracking-widest text-muted uppercase">{a.period}</span>
            <div>
              <h3 className="text-lg font-medium text-fg">{a.title}</h3>
              <p className="text-sm text-muted">
                {[a.organization, a.role].filter(Boolean).join(' · ')}
              </p>
              {a.description && <p className="mt-1 text-sm text-muted">{a.description}</p>}
            </div>
            {a.link && (
              <span className="font-mono text-xs text-fg opacity-0 transition-opacity group-hover:opacity-100">
                ↗
              </span>
            )}
          </a>
        ))}
      </div>
    </Section>
  )
}
