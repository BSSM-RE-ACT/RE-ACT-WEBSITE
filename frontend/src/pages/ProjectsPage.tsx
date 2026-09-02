import { useMemo, useState } from 'react'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { ProjectCard } from '../components/ProjectCard'
import { useApiData } from '../lib/useApiData'
import type { Project, SiteContent } from '../types'

const DEFAULT_CONTENT: Partial<SiteContent> = { club_name: 'RE:ACT' }

export function ProjectsPage() {
  const { data: content } = useApiData<SiteContent>('/site-content', DEFAULT_CONTENT as SiteContent)
  const { data: projects, loading } = useApiData<Project[]>('/projects', [])
  const [category, setCategory] = useState('ALL')

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean))
    return ['ALL', ...set]
  }, [projects])

  const filtered = category === 'ALL' ? projects : projects.filter((p) => p.category === category)

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav clubName={content.club_name} />

      <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 lg:px-20">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-muted uppercase">Portfolio</p>
        <h1 className="text-5xl font-semibold tracking-tight text-fg md:text-6xl">Projects</h1>

        {categories.length > 1 && (
          <div className="mt-10 flex flex-wrap gap-2 font-mono text-xs tracking-widest uppercase">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`border px-4 py-2 ${
                  category === c ? 'border-fg bg-fg text-bg' : 'border-border text-muted hover:text-fg'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="mt-14">
          {loading ? (
            <p className="text-sm text-muted">불러오는 중…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted">아직 등록된 프로젝트가 없어요.</p>
          ) : (
            <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer clubName={content.club_name} />
    </div>
  )
}
