import { Link } from 'react-router-dom'
import type { SiteContent } from '../types'
import { Marquee } from './Marquee'

export function Hero({ content }: { content: SiteContent }) {
  const words = (content.hero_marquee || '')
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean)

  return (
    <div id="top" className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 md:px-12 md:pt-28 lg:px-20">
        <div className="flex items-center justify-between font-mono text-xs tracking-widest text-muted uppercase">
          <span>Club 2026</span>
          <span>Scroll ↓</span>
        </div>

        <h1 className="animate-fade-up mt-6 text-[15vw] leading-[0.9] font-extrabold tracking-tighter text-fg uppercase sm:text-[11vw] md:text-[9rem]">
          {content.club_name || 'RE:ACT'}
        </h1>

        <p className="animate-fade-up mt-6 max-w-md font-mono text-sm text-muted">{content.tagline}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 border border-fg bg-fg px-6 py-3 font-mono text-xs tracking-widest text-bg uppercase transition-opacity hover:opacity-80"
          >
            Projects <span aria-hidden>→</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-xs tracking-widest text-fg uppercase transition-colors hover:border-fg"
          >
            Contact
          </Link>
        </div>
      </div>

      <Marquee words={words} />
    </div>
  )
}
