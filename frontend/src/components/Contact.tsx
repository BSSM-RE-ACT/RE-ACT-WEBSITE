import { useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import type { SiteContent } from '../types'
import { Section } from './Section'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function Contact({ content }: { content: SiteContent }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(content.contact_email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — the email is still visible to copy manually
    }
  }

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

  return (
    <Section id="contact" className="text-center">
      <p className="mb-4 font-mono text-xs tracking-[0.2em] text-muted uppercase">Let's Talk</p>
      <h2 className="text-4xl leading-tight font-semibold tracking-tight text-fg md:text-6xl">
        {content.contact_message || '함께 만들어가요.'}
      </h2>

      <div className="mx-auto mt-12 max-w-lg text-left">
        {status === 'sent' ? (
          <div className="border border-border bg-surface p-8 text-center">
            <p className="text-fg">메시지를 보냈어요! 곧 답장 드릴게요.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 font-mono text-xs tracking-widest text-muted uppercase hover:text-fg"
            >
              새 메시지 보내기
            </button>
          </div>
        ) : (
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
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {content.github_url && (
          <a
            href={content.github_url}
            target="_blank"
            rel="noreferrer"
            className="border border-border px-6 py-3 font-mono text-xs tracking-widest text-fg uppercase hover:border-fg"
          >
            Github
          </a>
        )}
        {content.instagram_url && (
          <a
            href={content.instagram_url}
            target="_blank"
            rel="noreferrer"
            className="border border-border px-6 py-3 font-mono text-xs tracking-widest text-fg uppercase hover:border-fg"
          >
            Instagram
          </a>
        )}
      </div>

      {content.contact_email && (
        <button onClick={copyEmail} className="mt-6 font-mono text-xs tracking-widest text-muted uppercase hover:text-fg">
          {copied ? '복사됨 ✓' : content.contact_email}
        </button>
      )}
    </Section>
  )
}
