import { useQuery } from '@tanstack/react-query'
import Card from '../../components/ui/Card'
import { getDashboard } from '../../lib/api/misc'

const LABELS: Record<string, string> = {
  books_completed: 'Books completed',
  podcasts_completed: 'Podcasts completed',
  videos_completed: 'Videos completed',
  notes_created: 'Notes created',
  goals_completed: 'Goals completed',
  goals_in_progress: 'Goals in progress',
}

export default function ProgressPage() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard })

  if (isLoading || !data) return <p className="text-text-muted">Loading…</p>

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-semibold text-text-primary">Progress</h1>
      <p className="mb-6 text-text-muted">
        For awareness, not competition — a record of what's accumulated over time.
      </p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Object.entries(data.counts).map(([key, value]) => (
          <Card key={key}>
            <p className="text-3xl font-semibold text-text-primary">{value}</p>
            <p className="mt-1 text-sm text-text-muted">{LABELS[key] ?? key}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
