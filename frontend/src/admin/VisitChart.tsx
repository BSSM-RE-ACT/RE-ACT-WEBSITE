import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'
import type { VisitStats } from '../types'

const RANGES = [7, 30, 90] as const

export function VisitChart() {
  const { isRoot } = useAuth()
  const [days, setDays] = useState<(typeof RANGES)[number]>(30)
  const [stats, setStats] = useState<VisitStats>({ today: 0, total: 0, daily: [] })
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const res = await api.get<VisitStats>('/visits/stats', { params: { days } })
    setStats(res.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days])

  async function reset() {
    if (!confirm('방문자 기록을 전부 초기화할까요? 되돌릴 수 없어요.')) return
    await api.delete('/visits')
    await load()
  }

  const max = Math.max(1, ...stats.daily.map((d) => d.count))
  const labelEvery = days <= 7 ? 1 : days <= 30 ? 3 : 10

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end gap-10">
        <div>
          <p className="text-4xl font-semibold text-fg md:text-5xl">{stats.today}</p>
          <p className="mt-1 font-mono text-xs tracking-widest text-muted uppercase">오늘</p>
        </div>
        <div className="h-12 w-px bg-border" />
        <div>
          <p className="text-4xl font-semibold text-fg md:text-5xl">{stats.total}</p>
          <p className="mt-1 font-mono text-xs tracking-widest text-muted uppercase">전체</p>
        </div>
      </div>

      <div className="border border-border p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-xs tracking-widest text-muted uppercase">일별 방문자</span>
          <div className="flex gap-1 font-mono text-xs tracking-widest uppercase">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setDays(r)}
                className={`border px-3 py-1.5 ${
                  days === r ? 'border-fg bg-fg text-bg' : 'border-border text-muted hover:text-fg'
                }`}
              >
                {r}일
              </button>
            ))}
          </div>
        </div>

        <div className={`flex h-56 items-end gap-1 ${loading ? 'opacity-40' : ''}`}>
          {stats.daily.map((d, i) => (
            <div key={d.date + i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              {d.count > 0 && <span className="text-xs text-muted">{d.count}</span>}
              <div
                className="w-full bg-muted/70"
                style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1">
          {stats.daily.map((d, i) => (
            <div key={d.date + i} className="flex-1 text-center font-mono text-[10px] text-muted">
              {i % labelEvery === 0 ? d.date : ''}
            </div>
          ))}
        </div>

        {isRoot && (
          <div className="mt-4 text-right">
            <button onClick={reset} className="font-mono text-xs tracking-widest text-red-400 uppercase hover:text-red-300">
              방문자 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
