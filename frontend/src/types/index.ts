export type AcademyType = 'anchor' | 'rotating'

export interface AcademyPeriod {
  id: number
  academy: number
  academy_name: string
  start_date: string
  end_date: string | null
  objective: string
  expected_outcome: string
  is_current: boolean
  reflection_what_learned: string
  reflection_what_improved: string
  reflection_what_needs_work: string
  reflection_continue_practicing: string
}

export interface Academy {
  id: number
  name: string
  slug: string
  description: string
  academy_type: AcademyType
  color: string
  icon: string
  is_active: boolean
  drive_folder_id: string
  current_period: AcademyPeriod | null
  resource_count: number
  goal_count: number
}

export type ResourceStatus =
  | 'discovered' | 'want_to_learn' | 'currently_learning'
  | 'completed' | 'applied' | 'reviewed' | 'mastered'

export interface Resource {
  id: number
  title: string
  resource_type: string
  url: string
  academy: number | null
  academy_name: string | null
  status: ResourceStatus
  tags: string[]
  started_at: string | null
  completed_at: string | null
  notes: string
  key_lessons: string
}

export interface Book extends Resource {
  author: string
  cover_url: string
  category: string
  pages: number | null
  current_page: number
  rating: number | null
  key_ideas: string
  quotes: string
  reflections: string
  progress_percent: number
}

export interface Podcast extends Resource {
  episode: string
  speaker: string
  platform: string
  duration_minutes: number | null
  date_listened: string | null
  quotes: string
  questions: string
  reflection: string
}

export interface Video extends Resource {
  channel: string
  platform: string
  duration_minutes: number | null
  date_watched: string | null
  bookmarks: string
  questions: string
}

export interface Note {
  id: number
  title: string
  body: string
  academy: number | null
  academy_name: string | null
  tags: string[]
  related_resources: number[]
  related_goals: number[]
  related_notes: number[]
  created_at: string
  updated_at: string
}

export type GoalTimeframe = 'long_term' | 'yearly' | 'quarterly' | 'monthly' | 'learning'
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned'

export interface Milestone {
  id: number
  goal: number
  title: string
  is_complete: boolean
  order: number
}

export interface Goal {
  id: number
  title: string
  why: string
  description: string
  academy: number | null
  academy_name: string | null
  timeframe: GoalTimeframe
  status: GoalStatus
  deadline: string | null
  reflection: string
  milestones: Milestone[]
  progress_percent: number
}

export type JournalEntryType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export interface JournalEntry {
  id: number
  entry_type: JournalEntryType
  period_start: string
  period_end: string | null
  what_did_i_learn: string
  what_did_i_build: string
  what_challenged_me: string
  what_mistake_did_i_make: string
  what_did_i_understand_better: string
  what_am_i_grateful_for: string
  what_should_i_improve: string
  what_did_i_avoid: string
  what_should_i_do_differently: string
  free_write: string
}

export interface Habit {
  id: number
  name: string
  academy: number | null
  academy_name: string | null
  is_anchor: boolean
  is_active: boolean
  completed_today: boolean
}

export interface Person {
  id: number
  name: string
  role: string
  where_met: string
  notes: string
  last_contact: string | null
  follow_up_notes: string
}

export interface Tag {
  id: number
  name: string
}

export interface DashboardSummary {
  software_engineering: AcademySnapshot | null
  rotating_academy: AcademySnapshot | null
  anchor_habits: { id: number; name: string; completed_today: boolean }[]
  journal_today_exists: boolean
  counts: {
    books_completed: number
    podcasts_completed: number
    videos_completed: number
    notes_created: number
    goals_completed: number
    goals_in_progress: number
  }
}

export interface AcademySnapshot {
  id: number
  name: string
  current_resource: string | null
  current_resource_progress: number | null
  period_objective: string | null
  period_start: string | null
  period_end: string | null
}

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
