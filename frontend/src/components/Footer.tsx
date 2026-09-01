export function Footer({ clubName }: { clubName: string }) {
  return (
    <footer className="border-t border-border px-6 py-8 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-xs tracking-widest text-muted uppercase sm:flex-row">
        <span>
          {clubName || 'RE:ACT'} © {new Date().getFullYear()}
        </span>
        <a href="/admin/login" className="hover:text-fg">
          Admin
        </a>
      </div>
    </footer>
  )
}
