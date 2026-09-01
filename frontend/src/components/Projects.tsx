import type { Project } from '../types'
import { assetUrl } from '../lib/api'
import { Section, SectionHeading } from './Section'

export function Projects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  return (
    <Section id="projects">
      <SectionHeading label="Selected Projects" title="Projects" description="RE:ACT 부원들이 만든 프로젝트예요." />

      <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
        {projects.map((p, i) => (
          <div key={p.id} className="group flex flex-col justify-between gap-6 bg-bg p-8">
            <div>
              <div className="flex items-center justify-between font-mono text-xs tracking-widest text-muted uppercase">
                <span>{String(i + 1).padStart(2, '0')}</span>
                {p.is_featured && <span className="text-fg">Featured</span>}
              </div>

              {p.image_url && (
                <img
                  src={assetUrl(p.image_url)}
                  alt={p.title}
                  className="mt-4 aspect-video w-full rounded object-cover"
                />
              )}

              <h3 className="mt-5 text-2xl font-semibold text-fg">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
            </div>

            <div>
              {p.tags && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {p.tags.split(',').map((t) => (
                    <span
                      key={t}
                      className="border border-border px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted uppercase"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-4 font-mono text-xs tracking-widest uppercase">
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noreferrer" className="text-fg hover:text-muted">
                    Github ↗
                  </a>
                )}
                {p.live_url && (
                  <a href={p.live_url} target="_blank" rel="noreferrer" className="text-fg hover:text-muted">
                    Live ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
