import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const LINKS = [
  { to: '/#about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/#skills', label: 'Skills' },
  { to: '/#activities', label: 'Activities' },
  { to: '/#members', label: 'Members' },
  { to: '/#recruit', label: 'Recruit' },
  { to: '/contact', label: 'Contact' },
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
        <Link to="/" className="flex items-center gap-2 font-mono text-base font-bold tracking-[0.1em] text-fg">
          <img src="/logo.png" alt="" className="h-6 w-6" />
          {clubName || 'RE:ACT'}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="font-mono text-xs tracking-widest text-muted uppercase transition-colors hover:text-fg"
            >
              {l.label}
            </Link>
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
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="py-2 font-mono text-xs tracking-widest text-muted uppercase hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
