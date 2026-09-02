import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { api, assetUrl } from '../lib/api'
import type { Project, SiteContent } from '../types'

export function ProjectDetail() {
  const { id } = useParams()
  const [clubName, setClubName] = useState('RE:ACT')
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get<SiteContent>('/site-content').then((res) => setClubName(res.data.club_name)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    api
      .get<Project>(`/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
    window.scrollTo(0, 0)
  }, [id])

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav clubName={clubName} />

      <div className="mx-auto max-w-4xl px-6 py-16 md:px-12 lg:px-20">
        <Link to="/projects" className="mb-10 inline-block font-mono text-xs tracking-widest text-muted uppercase hover:text-fg">
          ← Projects
        </Link>

        {loading && <p className="text-sm text-muted">불러오는 중…</p>}

        {!loading && notFound && (
          <div>
            <h1 className="text-3xl font-semibold text-fg">프로젝트를 찾을 수 없어요</h1>
            <Link to="/projects" className="mt-4 inline-block text-sm text-muted hover:text-fg">
              프로젝트 목록으로 돌아가기 →
            </Link>
          </div>
        )}

        {!loading && project && (
          <article className="animate-fade-up">
            {project.is_featured && (
              <p className="mb-3 font-mono text-xs tracking-widest text-muted uppercase">Featured</p>
            )}
            <h1 className="text-4xl font-semibold tracking-tight text-fg md:text-5xl">{project.title}</h1>
            {project.description && <p className="mt-4 max-w-xl text-muted">{project.description}</p>}

            {project.tags && (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.split(',').map((t) => (
                  <span
                    key={t}
                    className="border border-border px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted uppercase"
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex gap-4 font-mono text-xs tracking-widest uppercase">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="text-fg hover:text-muted">
                  Github ↗
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noreferrer" className="text-fg hover:text-muted">
                  Live ↗
                </a>
              )}
            </div>

            {project.image_url && (
              <img
                src={assetUrl(project.image_url)}
                alt={project.title}
                className="mt-10 aspect-video w-full rounded object-cover"
              />
            )}

            {project.content && (
              <p className="mt-10 max-w-2xl leading-relaxed whitespace-pre-line text-fg">{project.content}</p>
            )}

            {project.gallery.length > 0 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {project.gallery.map((url, i) => (
                  <img
                    key={url + i}
                    src={assetUrl(url)}
                    alt={`${project.title} ${i + 1}`}
                    className="aspect-video w-full rounded object-cover"
                  />
                ))}
              </div>
            )}
          </article>
        )}
      </div>

      <Footer clubName={clubName} />
    </div>
  )
}
