import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#activities', label: 'Activities' },
  { href: '#members', label: 'Members' },
  { href: '#recruit', label: 'Recruit' },
  { href: '#contact', label: 'Contact' },
]

export function Nav({ clubName }: { clubName: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? 'border-border bg-bg/80 backdrop-blur' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <a href="#top" className="font-mono text-sm font-semibold tracking-[0.15em] text-fg">
          {clubName || 'RE:ACT'}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="font-mono text-xs tracking-widest text-muted uppercase transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>

        <button
          className="font-mono text-xs tracking-widest text-muted uppercase md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-6 pb-6 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 font-mono text-xs tracking-widest text-muted uppercase hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
