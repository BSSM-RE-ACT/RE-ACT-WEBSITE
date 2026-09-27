import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import type { Member } from '../types'
import { ImageField, TextAreaField, TextField } from './fields'

export function MemberSelfEditor() {
  const { logout, memberId, isAdmin } = useAuth()
  const [member, setMember] = useState<Member | null>(null)
  const [form, setForm] = useState<Pick<Member, 'bio' | 'image_url' | 'github_url' | 'portfolio_url' | 'slug'>>({
    bio: '',
    image_url: '',
    github_url: '',
    portfolio_url: '',
    slug: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<Member>('/members/me')
      .then((res) => {
        setMember(res.data)
        setForm({
          bio: res.data.bio,
          image_url: res.data.image_url,
          github_url: res.data.github_url,
          portfolio_url: res.data.portfolio_url,
          slug: res.data.slug,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  if (!memberId && !isAdmin && !loading) return <Navigate to="/admin/login" replace />
  if (isAdmin) return <Navigate to="/admin" replace />

  async function save() {
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const res = await api.put<Member>('/members/me', form)
      setMember(res.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('저장에 실패했어요. 값을 확인해 주세요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">내 프로필</p>
          <div className="flex items-center gap-5 font-mono text-xs tracking-widest text-muted uppercase">
            <a href="/" className="hover:text-fg">
              사이트 보기 ↗
            </a>
            <button onClick={logout} className="hover:text-fg">
              로그아웃 →
            </button>
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-bold text-fg">{member?.name ?? '...'}</h1>
        <p className="mb-10 font-mono text-xs tracking-widest text-muted uppercase">
          {[member?.role, member?.generation].filter(Boolean).join(' · ')}
        </p>

        {loading ? (
          <p className="text-sm text-muted">불러오는 중…</p>
        ) : (
          <div className="flex flex-col gap-4 border border-border bg-surface p-6">
            <p className="text-xs text-muted">
              이름/역할/기수는 root가 관리해요. 여기선 소개, 사진, 링크, 개인 페이지 주소만 바꿀 수 있어요.
            </p>
            <TextAreaField label="소개" value={form.bio} onChange={(v) => setForm((s) => ({ ...s, bio: v }))} />
            <ImageField label="사진" value={form.image_url} onChange={(v) => setForm((s) => ({ ...s, image_url: v }))} />
            <TextField
              label="Github 링크"
              value={form.github_url}
              onChange={(v) => setForm((s) => ({ ...s, github_url: v }))}
            />
            <TextField
              label="개인 포트폴리오 링크 (외부)"
              placeholder="https://example.com"
              value={form.portfolio_url}
              onChange={(v) => setForm((s) => ({ ...s, portfolio_url: v }))}
            />
            <TextField
              label={`개인 페이지 주소 (/member/${form.slug || '슬러그'})`}
              placeholder="jm"
              value={form.slug}
              onChange={(v) => setForm((s) => ({ ...s, slug: v }))}
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={save}
              disabled={saving}
              className="border border-fg bg-fg px-4 py-2 font-mono text-xs tracking-widest text-bg uppercase hover:opacity-80 disabled:opacity-50"
            >
              {saving ? '저장 중…' : saved ? '저장됨 ✓' : '저장'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
