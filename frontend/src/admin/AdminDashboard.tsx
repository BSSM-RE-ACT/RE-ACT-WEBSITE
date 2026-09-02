import { useState } from 'react'
import { useAuth } from '../lib/auth'
import type { ActivityEvent, GoalItem, Member, Project, SkillCategory } from '../types'
import { AdminEmails } from './AdminEmails'
import { EntityManager } from './EntityManager'
import { SiteContentEditor } from './SiteContentEditor'
import { VisitChart } from './VisitChart'

const TABS = [
  { key: 'content', label: '프로필' },
  { key: 'members', label: '부원' },
  { key: 'projects', label: '프로젝트' },
  { key: 'skills', label: '기술 스택' },
  { key: 'activities', label: '활동' },
  { key: 'goals', label: '목표' },
  { key: 'admins', label: '관리자 계정' },
] as const

type TabKey = (typeof TABS)[number]['key']

export function AdminDashboard() {
  const { logout, me } = useAuth()
  const [tab, setTab] = useState<TabKey>('content')

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">대시보드</p>
          <div className="flex items-center gap-5 font-mono text-xs tracking-widest text-muted uppercase">
            {me && <span>{me.is_root ? 'root' : me.name || me.subject}</span>}
            <a href="/" className="hover:text-fg">
              사이트 보기 ↗
            </a>
            <button onClick={logout} className="hover:text-fg">
              로그아웃 →
            </button>
          </div>
        </div>
        <h1 className="mb-12 text-5xl font-bold text-fg">관리자</h1>

        <VisitChart />

        <nav className="mt-14 mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-border pb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-1 font-mono text-xs tracking-widest uppercase transition-colors ${
                tab === t.key ? 'border-b-2 border-fg text-fg' : 'text-muted hover:text-fg'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === 'content' && <SiteContentEditor />}

          {tab === 'members' && (
            <EntityManager<Member>
              title="부원"
              endpoint="/members"
              emptyItem={{ name: '', role: '부원', generation: '', bio: '', image_url: '', github_url: '' }}
              renderLabel={(m) => `${m.name} · ${m.role}`}
              fields={[
                { key: 'name', label: '이름', type: 'text' },
                { key: 'role', label: '역할', type: 'text', placeholder: '동아리장 / 부원' },
                { key: 'generation', label: '기수', type: 'text', placeholder: '6기' },
                { key: 'bio', label: '소개', type: 'textarea' },
                { key: 'image_url', label: '사진', type: 'image' },
                { key: 'github_url', label: 'Github 링크', type: 'text' },
              ]}
            />
          )}

          {tab === 'projects' && (
            <EntityManager<Project>
              title="프로젝트"
              endpoint="/projects"
              emptyItem={{
                title: '',
                description: '',
                content: '',
                category: '',
                tags: '',
                github_url: '',
                live_url: '',
                image_url: '',
                gallery: [],
                is_featured: false,
              }}
              renderLabel={(p) => p.title}
              fields={[
                { key: 'title', label: '제목', type: 'text' },
                { key: 'description', label: '한 줄 설명 (목록에 보여요)', type: 'textarea' },
                { key: 'content', label: '상세 내용 (상세 페이지에 보여요)', type: 'textarea' },
                { key: 'category', label: '카테고리 (프로젝트 페이지 필터용)', type: 'text', placeholder: 'WEB' },
                { key: 'tags', label: '기술 태그', type: 'text', placeholder: 'React, TypeScript, FastAPI' },
                { key: 'image_url', label: '썸네일', type: 'image' },
                { key: 'gallery', label: '상세 페이지 이미지 갤러리', type: 'gallery' },
                { key: 'github_url', label: 'Github 링크', type: 'text' },
                { key: 'live_url', label: 'Live 링크', type: 'text' },
                { key: 'is_featured', label: 'Featured', type: 'checkbox' },
              ]}
            />
          )}

          {tab === 'skills' && (
            <EntityManager<SkillCategory>
              title="기술 스택"
              endpoint="/skills"
              emptyItem={{ name: '', items: [] }}
              renderLabel={(s) => `${s.name} (${s.items.length})`}
              fields={[
                { key: 'name', label: '카테고리 이름', type: 'text', placeholder: 'FRONTEND' },
                { key: 'items', label: '기술 목록', type: 'list', placeholder: 'React, TypeScript' },
              ]}
            />
          )}

          {tab === 'activities' && (
            <EntityManager<ActivityEvent>
              title="활동 연혁"
              endpoint="/activities"
              emptyItem={{ title: '', organization: '', period: '', role: '', description: '', link: '' }}
              renderLabel={(a) => `${a.period} · ${a.title}`}
              fields={[
                { key: 'title', label: '제목', type: 'text' },
                { key: 'organization', label: '기관/장소', type: 'text' },
                { key: 'period', label: '기간', type: 'text', placeholder: '2026.3 ~' },
                { key: 'role', label: '역할', type: 'text' },
                { key: 'description', label: '설명', type: 'textarea' },
                { key: 'link', label: '링크', type: 'text' },
              ]}
            />
          )}

          {tab === 'goals' && (
            <EntityManager<GoalItem>
              title="올해의 목표"
              endpoint="/goals"
              emptyItem={{ text: '', done: false }}
              renderLabel={(g) => `${g.done ? '✓' : '○'} ${g.text}`}
              fields={[
                { key: 'text', label: '목표', type: 'text' },
                { key: 'done', label: '완료', type: 'checkbox' },
              ]}
            />
          )}

          {tab === 'admins' && <AdminEmails />}
        </div>
      </div>
    </div>
  )
}
