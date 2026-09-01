import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import type { AdminAllowedEmail } from '../types'

export function AdminEmails() {
  const { isRoot } = useAuth()
  const [items, setItems] = useState<AdminAllowedEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const res = await api.get<AdminAllowedEmail[]>('/admin-emails')
    setItems(res.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function add(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/admin-emails', { email, name })
      setEmail('')
      setName('')
      await load()
    } catch {
      setError('추가에 실패했어요. 이미 등록된 이메일인지 확인해 주세요.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    if (!confirm('이 계정의 관리자 권한을 없앨까요?')) return
    await api.delete(`/admin-emails/${id}`)
    await load()
  }

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold text-fg">관리자 계정</h2>
      <p className="mb-6 text-sm text-muted">
        구글 로그인으로 관리자 페이지에 들어올 수 있는 이메일 목록이에요.
        {!isRoot && ' root 계정만 추가/삭제할 수 있어요.'}
      </p>

      {isRoot && (
        <form onSubmit={add} className="mb-8 flex flex-col gap-4 border border-border bg-surface p-6 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="font-mono text-xs tracking-widest text-muted uppercase">구글 이메일</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@gmail.com"
              className="border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-fg"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="font-mono text-xs tracking-widest text-muted uppercase">이름 (선택)</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-fg"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="border border-fg bg-fg px-5 py-2.5 font-mono text-xs tracking-widest text-bg uppercase hover:opacity-80 disabled:opacity-50"
          >
            추가
          </button>
        </form>
      )}
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">등록된 관리자 이메일이 없어요.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border border-border">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="truncate text-sm text-fg">
                {item.name ? `${item.name} · ` : ''}
                {item.email}
              </span>
              {isRoot && (
                <button onClick={() => remove(item.id)} className="shrink-0 font-mono text-xs tracking-widest text-red-400 uppercase hover:text-red-300">
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
