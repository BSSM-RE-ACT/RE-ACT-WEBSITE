import { Link } from 'react-router-dom'
import type { Project } from '../types'
import { ProjectCard } from './ProjectCard'
import { Section, SectionHeading } from './Section'

export function Projects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  const preview = (projects.some((p) => p.is_featured) ? projects.filter((p) => p.is_featured) : projects).slice(0, 4)

  return (
    <Section id="projects">
      <SectionHeading
        label="Selected Projects"
        title="Projects"
        description="RE:ACT 부원들이 만든 프로젝트예요."
        action={
          <Link to="/projects" className="font-mono text-xs tracking-widest text-muted uppercase hover:text-fg">
            All Projects →
          </Link>
        }
      />

      <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
        {preview.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </Section>
  )
}
