import { useRef, useState } from 'react'
import { api, assetUrl } from '../lib/api'

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs tracking-widest text-muted uppercase">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-fg"
      />
    </label>
  )
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs tracking-widest text-muted uppercase">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-fg"
      />
    </label>
  )
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-fg"
      />
      <span className="font-mono text-xs tracking-widest text-muted uppercase">{label}</span>
    </label>
  )
}

export function ListField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs tracking-widest text-muted uppercase">{label} (쉼표로 구분)</span>
      <input
        value={value.join(', ')}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean),
          )
        }
        className="border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-fg"
      />
    </label>
  )
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await api.post('/uploads', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(res.data.url)
    } catch {
      setError('업로드에 실패했어요. (이미지 5MB 이하)')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-xs tracking-widest text-muted uppercase">{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden border border-border bg-surface">
          {value && <img src={assetUrl(value)} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="border border-border px-3 py-1.5 font-mono text-xs tracking-widest text-fg uppercase hover:border-fg disabled:opacity-50"
          >
            {uploading ? '업로드 중…' : '이미지 선택'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-left font-mono text-xs tracking-widest text-muted uppercase hover:text-fg"
            >
              제거
            </button>
          )}
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}
