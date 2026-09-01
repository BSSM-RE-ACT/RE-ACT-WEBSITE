import type { GoalItem } from '../types'
import { Section, SectionHeading } from './Section'

export function Goals({ goals, year }: { goals: GoalItem[]; year: number }) {
  if (goals.length === 0) return null

  const done = goals.filter((g) => g.done).length
  const pct = Math.round((done / goals.length) * 100)

  return (
    <Section id="goals">
      <SectionHeading label={String(year)} title="올해의 목표" />

      <div className="mb-8">
        <div className="mb-2 flex justify-between font-mono text-xs tracking-widest text-muted uppercase">
          <span>{done}/{goals.length} 완료</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden border border-border">
          <div className="h-full bg-fg transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {goals.map((g) => (
          <li key={g.id} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center border text-xs ${
                g.done ? 'border-fg bg-fg text-bg' : 'border-border text-muted'
              }`}
            >
              {g.done ? '✓' : ''}
            </span>
            <span className={g.done ? 'text-muted line-through' : 'text-fg'}>{g.text}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
