export function Marquee({ words }: { words: string[] }) {
  const base = words.length ? words : ['REACT', 'FRONTEND', 'TEAM', 'WEB']
  const content = Array.from({ length: 6 }).flatMap(() => base)

  return (
    <div className="overflow-hidden border-y border-border py-4">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((rep) => (
          <div key={rep} className="flex gap-8 pr-8">
            {content.map((w, i) => (
              <span
                key={`${rep}-${i}`}
                className="flex items-center gap-8 font-mono text-sm tracking-widest text-muted uppercase"
              >
                {w}
                <span className="text-fg">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
