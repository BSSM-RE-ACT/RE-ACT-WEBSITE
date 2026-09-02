import { useState } from 'react'
import { ContactForm } from '../components/ContactForm'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'
import { useApiData } from '../lib/useApiData'
import type { SiteContent } from '../types'

const DEFAULT_CONTENT: Partial<SiteContent> = { club_name: 'RE:ACT' }

export function ContactPage() {
  const { data: content } = useApiData<SiteContent>('/site-content', DEFAULT_CONTENT as SiteContent)
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

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav clubName={content.club_name} />

      <div className="mx-auto max-w-5xl px-6 py-20 md:px-12 lg:px-20">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-muted uppercase">Get In Touch</p>
        <h1 className="text-5xl font-semibold tracking-tight text-fg md:text-6xl">연락하기</h1>
        <p className="mt-4 max-w-md text-muted">
          {content.contact_message || '궁금한 점이나 협업 제안이 있으시면 편하게 연락 주세요.'}
        </p>

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,220px)_1fr]">
          <div className="flex flex-col gap-8">
            {content.contact_email && (
              <div>
                <p className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">Email</p>
                <button onClick={copyEmail} className="text-left text-sm text-fg hover:underline">
                  {copied ? '복사됨 ✓' : content.contact_email}
                </button>
              </div>
            )}
            {content.github_url && (
              <div>
                <p className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">Github</p>
                <a href={content.github_url} target="_blank" rel="noreferrer" className="text-sm text-fg hover:underline">
                  {content.github_url.replace(/^https?:\/\//, '')} ↗
                </a>
              </div>
            )}
            {content.instagram_url && (
              <div>
                <p className="mb-2 font-mono text-xs tracking-widest text-muted uppercase">Instagram</p>
                <a href={content.instagram_url} target="_blank" rel="noreferrer" className="text-sm text-fg hover:underline">
                  {content.instagram_url.replace(/^https?:\/\//, '')} ↗
                </a>
              </div>
            )}
          </div>

          <ContactForm />
        </div>
      </div>

      <Footer clubName={content.club_name} />
    </div>
  )
}
