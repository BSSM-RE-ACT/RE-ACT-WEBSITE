import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { SiteContent } from '../types'
import { Section } from './Section'

export function Contact({ content }: { content: SiteContent }) {
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
    <Section id="contact" className="text-center">
      <p className="mb-4 font-mono text-xs tracking-[0.2em] text-muted uppercase">Let's Talk</p>
      <h2 className="text-4xl leading-tight font-semibold tracking-tight text-fg md:text-6xl">
        {content.contact_message || '함께 만들어가요.'}
      </h2>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 border border-fg bg-fg px-6 py-3 font-mono text-xs tracking-widest text-bg uppercase transition-opacity hover:opacity-80"
        >
          Get In Touch <span aria-hidden>→</span>
        </Link>
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
