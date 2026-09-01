import type { SiteContent } from '../types'
import { Section, SectionHeading } from './Section'

export function About({
  content,
  memberCount,
  projectCount,
}: {
  content: SiteContent
  memberCount: number
  projectCount: number
}) {
  const stats = [
    { label: '부원', value: `${memberCount}+` },
    { label: 'Projects', value: `${projectCount}+` },
    ...(content.stat_extra_label
      ? [{ label: content.stat_extra_label, value: content.stat_extra_value }]
      : []),
  ]

  return (
    <Section id="about">
      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <SectionHeading label="About" title={content.about_short || 'Who We Are'} />
          <p className="max-w-md leading-relaxed text-muted">{content.about_long}</p>
          {content.founded_label && (
            <p className="mt-6 font-mono text-xs tracking-widest text-muted uppercase">
              Since {content.founded_label}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 self-start sm:grid-cols-3 md:grid-cols-2">
          {stats.map((s) => (
            <div key={s.label} className="border border-border p-6">
              <p className="text-3xl font-semibold text-fg md:text-4xl">{s.value}</p>
              <p className="mt-2 font-mono text-xs tracking-widest text-muted uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
