import type { SiteContent } from '../types'
import { Section, SectionHeading } from './Section'

export function Recruit({ content }: { content: SiteContent }) {
  const rows = [
    { label: '지원 자격', value: content.recruit_qualification },
    { label: '지원 방법', value: content.recruit_how_to_apply },
    { label: '모집 일정', value: content.recruit_schedule },
  ].filter((r) => r.value)

  return (
    <Section id="recruit">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeading label="Join Us" title="Recruit" />
        <span
          className={`mb-14 font-mono text-xs tracking-widest uppercase ${
            content.recruit_is_open ? 'text-fg' : 'text-muted'
          }`}
        >
          {content.recruit_is_open ? '● 모집중' : '○ 모집 마감'}
        </span>
      </div>

      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label} className="bg-bg p-6">
            <p className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">{r.label}</p>
            <p className="text-sm whitespace-pre-line text-fg">{r.value}</p>
          </div>
        ))}
      </div>

      {content.recruit_is_open && content.recruit_apply_link && (
        <a
          href={content.recruit_apply_link}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 border border-fg bg-fg px-6 py-3 font-mono text-xs tracking-widest text-bg uppercase transition-opacity hover:opacity-80"
        >
          지원하기 <span aria-hidden>→</span>
        </a>
      )}
    </Section>
  )
}
