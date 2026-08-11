import { useState } from 'react'
import BooksTab from './BooksTab'
import OtherResourcesTab from './OtherResourcesTab'
import PodcastsTab from './PodcastsTab'
import VideosTab from './VideosTab'

const TABS = [
  { key: 'books', label: 'Books', component: BooksTab },
  { key: 'podcasts', label: 'Podcasts', component: PodcastsTab },
  { key: 'videos', label: 'Videos', component: VideosTab },
  { key: 'other', label: 'Other', component: OtherResourcesTab },
] as const

export default function ResourcesPage() {
  const [active, setActive] = useState<(typeof TABS)[number]['key']>('books')
  const ActiveComponent = TABS.find((t) => t.key === active)!.component

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Learning Resources</h1>
      <div className="mb-6 flex gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              active === tab.key
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ActiveComponent />
    </div>
  )
}
