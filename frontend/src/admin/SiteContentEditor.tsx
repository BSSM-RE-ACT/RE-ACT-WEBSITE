import { useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import type { SiteContent } from '../types'
import { CheckboxField, TextAreaField, TextField } from './fields'

const EMPTY: SiteContent = {
  id: 1,
  club_name: '',
  tagline: '',
  hero_marquee: '',
  about_short: '',
  about_long: '',
  founded_label: '',
  stat_extra_label: '',
  stat_extra_value: '',
  recruit_is_open: true,
  recruit_qualification: '',
  recruit_how_to_apply: '',
  recruit_schedule: '',
  recruit_apply_link: '',
  contact_email: '',
  contact_message: '',
  github_url: '',
  instagram_url: '',
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border border-border bg-surface p-6">
      <h3 className="font-mono text-xs tracking-widest text-muted uppercase">{title}</h3>
      {children}
    </div>
  )
}

export function SiteContentEditor() {
  const [form, setForm] = useState<SiteContent>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get<SiteContent>('/site-content').then((res) => {
      setForm(res.data)
      setLoading(false)
    })
  }, [])

  function set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setForm((s) => ({ ...s, [key]: value }))
  }

  async function save() {
    setSaving(true)
    setMessage('')
    try {
      await api.put('/site-content', form)
      setMessage('저장했어요.')
    } catch {
      setMessage('저장에 실패했어요.')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 2500)
    }
  }

  if (loading) return <p className="text-sm text-muted">불러오는 중…</p>

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-semibold text-fg">사이트 기본 정보</h2>

      <Group title="Hero">
        <TextField label="동아리 이름" value={form.club_name} onChange={(v) => set('club_name', v)} />
        <TextField label="한 줄 소개" value={form.tagline} onChange={(v) => set('tagline', v)} />
        <TextField
          label="상단 마퀴 태그 (쉼표 구분)"
          placeholder="REACT,FRONTEND,TEAM,WEB"
          value={form.hero_marquee}
          onChange={(v) => set('hero_marquee', v)}
        />
      </Group>

      <Group title="About">
        <TextField label="About 라벨" value={form.about_short} onChange={(v) => set('about_short', v)} />
        <TextAreaField label="동아리 소개" value={form.about_long} onChange={(v) => set('about_long', v)} />
        <TextField label="창설 시기" placeholder="2026.3 ~" value={form.founded_label} onChange={(v) => set('founded_label', v)} />
        <div className="grid grid-cols-2 gap-4">
          <TextField label="추가 통계 라벨" placeholder="수상" value={form.stat_extra_label} onChange={(v) => set('stat_extra_label', v)} />
          <TextField label="추가 통계 값" placeholder="1+" value={form.stat_extra_value} onChange={(v) => set('stat_extra_value', v)} />
        </div>
      </Group>

      <Group title="Recruit">
        <CheckboxField label="모집중" checked={form.recruit_is_open} onChange={(v) => set('recruit_is_open', v)} />
        <TextAreaField label="지원 자격" rows={2} value={form.recruit_qualification} onChange={(v) => set('recruit_qualification', v)} />
        <TextAreaField label="지원 방법" rows={2} value={form.recruit_how_to_apply} onChange={(v) => set('recruit_how_to_apply', v)} />
        <TextAreaField label="모집 일정" rows={2} value={form.recruit_schedule} onChange={(v) => set('recruit_schedule', v)} />
        <TextField label="지원 링크" placeholder="https://forms.gle/..." value={form.recruit_apply_link} onChange={(v) => set('recruit_apply_link', v)} />
      </Group>

      <Group title="Contact">
        <TextAreaField label="Contact 문구" rows={2} value={form.contact_message} onChange={(v) => set('contact_message', v)} />
        <TextField label="이메일" placeholder="team@react-club.kr" value={form.contact_email} onChange={(v) => set('contact_email', v)} />
        <TextField label="Github 링크" value={form.github_url} onChange={(v) => set('github_url', v)} />
        <TextField label="Instagram 링크" value={form.instagram_url} onChange={(v) => set('instagram_url', v)} />
      </Group>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="border border-fg bg-fg px-5 py-2.5 font-mono text-xs tracking-widest text-bg uppercase hover:opacity-80 disabled:opacity-50"
        >
          {saving ? '저장 중…' : '저장'}
        </button>
        {message && <span className="text-sm text-muted">{message}</span>}
      </div>
    </div>
  )
}
