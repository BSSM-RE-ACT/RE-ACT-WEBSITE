import { useState, type FormEvent } from 'react'
import { api } from '../lib/api'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await api.post('/contact', { name, email, message, website })
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(detail || '메시지 전송에 실패했어요. 잠시 후 다시 시도해 주세요.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-border bg-surface p-8 text-center">
        <p className="text-fg">메시지를 보냈어요! 곧 답장 드릴게요.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 font-mono text-xs tracking-widest text-muted uppercase hover:text-fg"
        >
          새 메시지 보내기
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          required
          maxLength={64}
          className="border border-border bg-surface px-4 py-3 text-sm text-fg outline-none focus:border-fg"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          required
          className="border border-border bg-surface px-4 py-3 text-sm text-fg outline-none focus:border-fg"
        />
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지"
        required
        maxLength={2000}
        rows={5}
        className="resize-none border border-border bg-surface px-4 py-3 text-sm text-fg outline-none focus:border-fg"
      />
      {/* honeypot — hidden from real visitors, bots tend to fill every field */}
      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center justify-center gap-2 border border-fg bg-fg px-6 py-3 font-mono text-xs tracking-widest text-bg uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {status === 'sending' ? '보내는 중…' : '보내기'} <span aria-hidden>→</span>
      </button>

      {status === 'error' && <p className="text-sm text-red-400">{error}</p>}
    </form>
  )
}
