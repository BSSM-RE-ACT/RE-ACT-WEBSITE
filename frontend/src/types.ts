export interface SiteContent {
  id: number
  club_name: string
  tagline: string
  hero_marquee: string
  about_short: string
  about_long: string
  founded_label: string
  stat_extra_label: string
  stat_extra_value: string
  recruit_is_open: boolean
  recruit_qualification: string
  recruit_how_to_apply: string
  recruit_schedule: string
  recruit_apply_link: string
  contact_email: string
  contact_message: string
  github_url: string
  instagram_url: string
}

export interface Member {
  id: number
  name: string
  role: string
  generation: string
  bio: string
  image_url: string
  github_url: string
  order: number
}

export interface Project {
  id: number
  title: string
  description: string
  content: string
  category: string
  tags: string
  github_url: string
  live_url: string
  image_url: string
  gallery: string[]
  is_featured: boolean
  order: number
}

export interface SkillCategory {
  id: number
  name: string
  items: string[]
  order: number
}

export interface ActivityEvent {
  id: number
  title: string
  organization: string
  period: string
  role: string
  description: string
  link: string
  order: number
}

export interface GoalItem {
  id: number
  text: string
  done: boolean
  order: number
}

export interface AdminAllowedEmail {
  id: number
  email: string
  name: string
}

export interface VisitStats {
  today: number
  total: number
  daily: { date: string; count: number }[]
}

export interface Me {
  subject: string
  is_root: boolean
  name: string
}
