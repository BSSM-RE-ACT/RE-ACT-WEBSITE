import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { assetUrl } from '../lib/api'
import { useApiData } from '../lib/useApiData'
import type { Member, SiteContent } from '../types'

const DEFAULT_CONTENT: Partial<SiteContent> = { club_name: 'RE:ACT' }

export function MemberPortfolio() {
  const { slug = '' } = useParams()
  const { data: content } = useApiData<SiteContent>('/site-content', DEFAULT_CONTENT as SiteContent)
  const { data: members, loading } = useApiData<Member[]>('/members', [])
  const [member, setMember] = useState<Member | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (loading) return
    const found = members.find((m) => m.slug.toLowerCase() === slug.toLowerCase())
    if (found) setMember(found)
    else setNotFound(true)
    window.scrollTo(0, 0)
  }, [loading, members, slug])

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav clubName={content.club_name} />

      <div className="mx-auto max-w-3xl px-6 py-16 md:px-12 lg:px-20">
        {loading && <p className="text-sm text-muted">불러오는 중…</p>}

        {!loading && notFound && (
          <div>
            <h1 className="text-3xl font-semibold text-fg">이 페이지를 찾을 수 없어요</h1>
            <p className="mt-3 text-muted">
              <span className="font-mono">{slug}</span>는 등록된 부원 페이지 주소가 아니에요.
            </p>
            <Link
              to="/#members"
              className="mt-6 inline-block font-mono text-xs tracking-widest text-fg uppercase hover:text-muted"
            >
              ← 부원 목록으로
            </Link>
          </div>
        )}

        {!loading && member && (
          <article className="animate-fade-up">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border border-border bg-surface">
                {member.image_url && (
                  <img src={assetUrl(member.image_url)} alt={member.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-fg">{member.name}</h1>
                <p className="mt-2 font-mono text-xs tracking-widest text-muted uppercase">
                  {[member.role, member.generation].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>

            {member.bio && <p className="mt-10 max-w-xl leading-relaxed text-fg">{member.bio}</p>}

            <div className="mt-10 flex flex-wrap gap-4 font-mono text-xs tracking-widest uppercase">
              {member.github_url && (
                <a
                  href={member.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-border px-6 py-3 text-fg hover:border-fg"
                >
                  Github ↗
                </a>
              )}
              {member.portfolio_url && (
                <a
                  href={member.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-fg bg-fg px-6 py-3 text-bg hover:opacity-80"
                >
                  Portfolio ↗
                </a>
              )}
            </div>
          </article>
        )}
      </div>

      <Footer clubName={content.club_name} />
    </div>
  )
}
