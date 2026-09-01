import { useState } from 'react'
import type { SkillCategory } from '../types'
import { Section, SectionHeading } from './Section'

export function Skills({ categories }: { categories: SkillCategory[] }) {
  const [open, setOpen] = useState<number | null>(categories[0]?.id ?? null)

  if (categories.length === 0) return null

  return (
    <Section id="skills">
      <SectionHeading label="Expertise" title="Skills" description="RE:ACT가 다루는 기술이에요. 카테고리를 눌러보세요." />

      <div className="border-t border-border">
        {categories.map((c) => {
          const isOpen = open === c.id
          return (
            <div key={c.id} className="border-b border-border">
              <button
                onClick={() => setOpen(isOpen ? null : c.id)}
                className="flex w-full items-center justify-between py-6 text-left"
              >
                <span className="font-mono text-sm tracking-widest text-fg uppercase">{c.name}</span>
                <span className={`text-muted transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              {isOpen && (
                <div className="animate-fade-up flex flex-wrap gap-2 pb-6">
                  {c.items.map((item) => (
                    <span key={item} className="border border-border px-3 py-1.5 text-sm text-muted">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
