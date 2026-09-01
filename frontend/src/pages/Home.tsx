import { useEffect } from 'react'
import { api } from '../lib/api'
import { useApiData } from '../lib/useApiData'
import type {
  ActivityEvent,
  GoalItem,
  Member,
  Project,
  SiteContent,
  SkillCategory,
} from '../types'
import { About } from '../components/About'
import { Activities } from '../components/Activities'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { Goals } from '../components/Goals'
import { Hero } from '../components/Hero'
import { Members } from '../components/Members'
import { Nav } from '../components/Nav'
import { Projects } from '../components/Projects'
import { Recruit } from '../components/Recruit'
import { Skills } from '../components/Skills'

const DEFAULT_CONTENT: SiteContent = {
  id: 1,
  club_name: 'RE:ACT',
  tagline: '부산소프트웨어마이스터고 리액트 개발 동아리',
  hero_marquee: 'REACT,FRONTEND,TEAM,WEB',
  about_short: 'Who We Are',
  about_long: '',
  founded_label: '',
  stat_extra_label: '',
  stat_extra_value: '',
  recruit_is_open: false,
  recruit_qualification: '',
  recruit_how_to_apply: '',
  recruit_schedule: '',
  recruit_apply_link: '',
  contact_email: '',
  contact_message: '함께 만들어가요.',
  github_url: '',
  instagram_url: '',
}

export function Home() {
  const { data: content } = useApiData<SiteContent>('/site-content', DEFAULT_CONTENT)
  const { data: members } = useApiData<Member[]>('/members', [])
  const { data: projects } = useApiData<Project[]>('/projects', [])
  const { data: skills } = useApiData<SkillCategory[]>('/skills', [])
  const { data: activities } = useApiData<ActivityEvent[]>('/activities', [])
  const { data: goals } = useApiData<GoalItem[]>('/goals', [])

  useEffect(() => {
    if (!sessionStorage.getItem('react_visit_logged')) {
      api.post('/visits').catch(() => {})
      sessionStorage.setItem('react_visit_logged', '1')
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Nav clubName={content.club_name} />
      <Hero content={content} />
      <About content={content} memberCount={members.length} projectCount={projects.length} />
      <Projects projects={projects} />
      <Skills categories={skills} />
      <Activities activities={activities} />
      <Members members={members} />
      <Recruit content={content} />
      <Goals goals={goals} year={new Date().getFullYear()} />
      <Contact content={content} />
      <Footer clubName={content.club_name} />
    </div>
  )
}
