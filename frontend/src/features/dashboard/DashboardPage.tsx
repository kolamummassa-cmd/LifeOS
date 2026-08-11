import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import { toggleHabitToday } from '../../lib/api/habits'
import { getDashboard } from '../../lib/api/misc'

function AcademyBlock({
  title,
  snapshot,
}: {
  title: string
  snapshot: NonNullable<Awaited<ReturnType<typeof getDashboard>>['software_engineering']> | null
}) {
  if (!snapshot) {
    return (
      <Card>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">{title}</h3>
        <p className="text-sm text-text-muted">Not set up yet — add this Academy to get started.</p>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">{title}</h3>
      <p className="mb-3 text-lg font-medium text-text-primary">{snapshot.name}</p>
      {snapshot.current_resource ? (
        <>
          <p className="mb-2 text-sm text-text-secondary">
            Currently learning: <span className="text-text-primary">{snapshot.current_resource}</span>
          </p>
          {snapshot.current_resource_progress !== null && (
            <ProgressBar value={snapshot.current_resource_progress} />
          )}
        </>
      ) : (
        <p className="text-sm text-text-muted">Nothing marked "Currently Learning" yet.</p>
      )}
      {snapshot.period_objective && (
        <p className="mt-3 text-xs text-text-muted">Rotation objective: {snapshot.period_objective}</p>
      )}
    </Card>
  )
}

export default function DashboardPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard })

  const handleToggle = async (id: number) => {
    await toggleHabitToday(id)
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  if (isLoading || !data) {
    return <p className="text-text-muted">Loading dashboard…</p>
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 text-2xl font-semibold text-text-primary">Good day, Kolamu.</h1>
      <p className="mb-8 text-text-muted">Here's today's focus.</p>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <AcademyBlock title="Software Engineering" snapshot={data.software_engineering} />
        <AcademyBlock title="Current Academy" snapshot={data.rotating_academy} />
      </div>

      <Card className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">Anchor Habits</h3>
        {data.anchor_habits.length === 0 ? (
          <p className="text-sm text-text-muted">
            No anchor habits yet. Add some in Settings — Prayer, Bible Reading, Exercise, Journal.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.anchor_habits.map((h) => (
              <button
                key={h.id}
                onClick={() => handleToggle(h.id)}
                className="focus:outline-none"
              >
                <Badge tone={h.completed_today ? 'success' : 'default'}>
                  {h.completed_today ? '✓ ' : '○ '}
                  {h.name}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <p className="text-2xl font-semibold text-text-primary">{data.counts.books_completed}</p>
          <p className="text-xs text-text-muted">Books completed</p>
        </Card>
        <Card>
          <p className="text-2xl font-semibold text-text-primary">{data.counts.podcasts_completed}</p>
          <p className="text-xs text-text-muted">Podcasts completed</p>
        </Card>
        <Card>
          <p className="text-2xl font-semibold text-text-primary">{data.counts.videos_completed}</p>
          <p className="text-xs text-text-muted">Videos completed</p>
        </Card>
        <Card>
          <p className="text-2xl font-semibold text-text-primary">{data.counts.notes_created}</p>
          <p className="text-xs text-text-muted">Notes created</p>
        </Card>
      </div>

      <Card>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">Reflection</h3>
        {data.journal_today_exists ? (
          <p className="text-sm text-text-secondary">You've already journaled today. Well done.</p>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">"What did I learn today?"</p>
            <Link to="/journal" className="text-sm text-accent hover:underline">
              Write today's entry →
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
