import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { CheckboxField, GalleryField, ImageField, ListField, TextAreaField, TextField } from './fields'

type FieldType = 'text' | 'textarea' | 'checkbox' | 'image' | 'list' | 'gallery'

export interface FieldConfig {
  key: string
  label: string
  type: FieldType
  placeholder?: string
}

interface BaseItem {
  id: number
  order: number
}

export function EntityManager<T extends BaseItem>({
  title,
  endpoint,
  fields,
  emptyItem,
  renderLabel,
}: {
  title: string
  endpoint: string
  fields: FieldConfig[]
  emptyItem: Omit<T, 'id' | 'order'>
  renderLabel: (item: T) => string
}) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const res = await api.get<T[]>(endpoint)
    setItems(res.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint])

  function startCreate() {
    setForm({ ...emptyItem, order: items.length })
    setEditingId('new')
    setError('')
  }

  function startEdit(item: T) {
    setForm({ ...item } as Record<string, unknown>)
    setEditingId(item.id)
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm({})
    setError('')
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      if (editingId === 'new') {
        await api.post(endpoint, form)
      } else {
        await api.put(`${endpoint}/${editingId}`, form)
      }
      await load()
      cancelEdit()
    } catch {
      setError('저장에 실패했어요. 값을 확인해 주세요.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: number) {
    if (!confirm('삭제할까요? 되돌릴 수 없어요.')) return
    await api.delete(`${endpoint}/${id}`)
    await load()
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= items.length) return
    const a = items[index]
    const b = items[target]
    await Promise.all([
      api.put(`${endpoint}/${a.id}`, { ...a, order: b.order }),
      api.put(`${endpoint}/${b.id}`, { ...b, order: a.order }),
    ])
    await load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-fg">{title}</h2>
        {editingId === null && (
          <button
            onClick={startCreate}
            className="border border-fg bg-fg px-4 py-2 font-mono text-xs tracking-widest text-bg uppercase hover:opacity-80"
          >
            + 추가
          </button>
        )}
      </div>

      {editingId !== null && (
        <div key={editingId} className="mb-8 flex flex-col gap-4 border border-border bg-surface p-6">
          {fields.map((f) => {
            const value = form[f.key]
            if (f.type === 'text')
              return (
                <TextField
                  key={f.key}
                  label={f.label}
                  placeholder={f.placeholder}
                  value={(value as string) ?? ''}
                  onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
                />
              )
            if (f.type === 'textarea')
              return (
                <TextAreaField
                  key={f.key}
                  label={f.label}
                  placeholder={f.placeholder}
                  value={(value as string) ?? ''}
                  onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
                />
              )
            if (f.type === 'checkbox')
              return (
                <CheckboxField
                  key={f.key}
                  label={f.label}
                  checked={Boolean(value)}
                  onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
                />
              )
            if (f.type === 'image')
              return (
                <ImageField
                  key={f.key}
                  label={f.label}
                  value={(value as string) ?? ''}
                  onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
                />
              )
            if (f.type === 'list')
              return (
                <ListField
                  key={f.key}
                  label={f.label}
                  placeholder={f.placeholder}
                  value={(value as string[]) ?? []}
                  onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
                />
              )
            if (f.type === 'gallery')
              return (
                <GalleryField
                  key={f.key}
                  label={f.label}
                  value={(value as string[]) ?? []}
                  onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
                />
              )
            return null
          })}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="border border-fg bg-fg px-4 py-2 font-mono text-xs tracking-widest text-bg uppercase hover:opacity-80 disabled:opacity-50"
            >
              {saving ? '저장 중…' : '저장'}
            </button>
            <button
              onClick={cancelEdit}
              className="border border-border px-4 py-2 font-mono text-xs tracking-widest text-fg uppercase hover:border-fg"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">불러오는 중…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted">아직 항목이 없어요.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border border border-border">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="truncate text-sm text-fg">{renderLabel(item)}</span>
              <div className="flex shrink-0 items-center gap-2 font-mono text-xs tracking-widest uppercase">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-muted hover:text-fg disabled:opacity-30">
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="text-muted hover:text-fg disabled:opacity-30"
                >
                  ↓
                </button>
                <button onClick={() => startEdit(item)} className="text-fg hover:text-muted">
                  편집
                </button>
                <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-300">
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
