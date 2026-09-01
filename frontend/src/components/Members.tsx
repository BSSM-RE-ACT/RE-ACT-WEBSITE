import type { Member } from '../types'
import { assetUrl } from '../lib/api'
import { Section, SectionHeading } from './Section'

export function Members({ members }: { members: Member[] }) {
  if (members.length === 0) return null

  return (
    <Section id="members">
      <SectionHeading label="Organizations" title="Members" description="RE:ACT를 만들어가는 사람들이에요." />

      <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 md:grid-cols-4">
        {members.map((m) => (
          <div key={m.id} className="flex flex-col items-center gap-3 bg-bg p-6 text-center">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-border bg-surface">
              {m.image_url && (
                <img src={assetUrl(m.image_url)} alt={m.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div>
              <p className="font-medium text-fg">{m.name}</p>
              <p className="font-mono text-xs tracking-widest text-muted uppercase">
                {[m.role, m.generation].filter(Boolean).join(' · ')}
              </p>
            </div>
            {m.bio && <p className="text-xs text-muted">{m.bio}</p>}
            {m.github_url && (
              <a
                href={m.github_url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] tracking-widest text-fg uppercase hover:text-muted"
              >
                Github ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}
