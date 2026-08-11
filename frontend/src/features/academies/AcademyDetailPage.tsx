import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Input, Textarea } from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { createAcademyPeriod, getAcademy, updateAcademyPeriod } from '../../lib/api/academies'
import { listGoals } from '../../lib/api/goals'
import { listNotes } from '../../lib/api/notes'
import { listResources } from '../../lib/api/resources'

export default function AcademyDetailPage() {
  const { id } = useParams()
  const academyId = Number(id)
  const queryClient = useQueryClient()
  const [rotationOpen, setRotationOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)

  const { data: academy } = useQuery({ queryKey: ['academy', academyId], queryFn: () => getAcademy(academyId) })
  const { data: resources } = useQuery({
    queryKey: ['resources', academyId],
    queryFn: () => listResources({ academy: academyId }),
    enabled: !!academyId,
  })
  const { data: notes } = useQuery({
    queryKey: ['notes', academyId],
    queryFn: () => listNotes(academyId),
    enabled: !!academyId,
  })
  const { data: goals } = useQuery({
    queryKey: ['goals', academyId],
    queryFn: () => listGoals(academyId),
    enabled: !!academyId,
  })

  const [rotationForm, setRotationForm] = useState({ start_date: '', objective: '', expected_outcome: '' })
  const startRotation = useMutation({
    mutationFn: () => createAcademyPeriod({ academy: academyId, ...rotationForm }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy', academyId] })
      setRotationOpen(false)
    },
  })

  const [reviewForm, setReviewForm] = useState({
    end_date: '', reflection_what_learned: '', reflection_what_improved: '',
    reflection_what_needs_work: '', reflection_continue_practicing: '',
  })
  const endRotation = useMutation({
    mutationFn: () => {
      if (!academy?.current_period) throw new Error('No active period')
      return updateAcademyPeriod(academy.current_period.id, { ...reviewForm, is_current: false })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy', academyId] })
      setReviewOpen(false)
    },
  })

  if (!academy) return <p className="text-text-muted">Loading…</p>

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-1 flex items-center gap-3">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: academy.color }} />
        <h1 className="text-2xl font-semibold text-text-primary">{academy.name}</h1>
        <Badge tone={academy.academy_type === 'anchor' ? 'accent' : 'default'}>
          {academy.academy_type === 'anchor' ? 'Anchor' : 'Rotating'}
        </Badge>
      </div>
      {academy.description && <p className="mb-6 text-text-muted">{academy.description}</p>}

      {academy.academy_type === 'rotating' && (
        <Card className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted">Rotation</h3>
            {academy.current_period ? (
              <Button variant="secondary" onClick={() => setReviewOpen(true)}>End & Review</Button>
            ) : (
              <Button variant="secondary" onClick={() => setRotationOpen(true)}>Start Rotation</Button>
            )}
          </div>
          {academy.current_period ? (
            <div className="text-sm text-text-secondary">
              <p>Started {academy.current_period.start_date}</p>
              <p className="mt-1">Objective: {academy.current_period.objective}</p>
            </div>
          ) : (
            <p className="text-sm text-text-muted">Not currently in rotation.</p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">Resources</h3>
          <p className="mb-2 text-2xl font-semibold text-text-primary">{resources?.length ?? 0}</p>
          <Link to="/resources" className="text-sm text-accent hover:underline">View all →</Link>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">Notes</h3>
          <p className="mb-2 text-2xl font-semibold text-text-primary">{notes?.length ?? 0}</p>
          <Link to="/notes" className="text-sm text-accent hover:underline">View all →</Link>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">Goals</h3>
          <p className="mb-2 text-2xl font-semibold text-text-primary">{goals?.length ?? 0}</p>
          <Link to="/goals" className="text-sm text-accent hover:underline">View all →</Link>
        </Card>
      </div>

      <Modal open={rotationOpen} onClose={() => setRotationOpen(false)} title="Start Rotation">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            startRotation.mutate()
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="Start date" type="date" required
            value={rotationForm.start_date}
            onChange={(e) => setRotationForm((f) => ({ ...f, start_date: e.target.value }))}
          />
          <Textarea
            label="Objective" required
            value={rotationForm.objective}
            onChange={(e) => setRotationForm((f) => ({ ...f, objective: e.target.value }))}
          />
          <Textarea
            label="Expected outcome"
            value={rotationForm.expected_outcome}
            onChange={(e) => setRotationForm((f) => ({ ...f, expected_outcome: e.target.value }))}
          />
          <Button type="submit" disabled={startRotation.isPending}>Start</Button>
        </form>
      </Modal>

      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title="End Rotation & Review">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            endRotation.mutate()
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="End date" type="date" required
            value={reviewForm.end_date}
            onChange={(e) => setReviewForm((f) => ({ ...f, end_date: e.target.value }))}
          />
          <Textarea
            label="What did I learn?"
            value={reviewForm.reflection_what_learned}
            onChange={(e) => setReviewForm((f) => ({ ...f, reflection_what_learned: e.target.value }))}
          />
          <Textarea
            label="What improved?"
            value={reviewForm.reflection_what_improved}
            onChange={(e) => setReviewForm((f) => ({ ...f, reflection_what_improved: e.target.value }))}
          />
          <Textarea
            label="What still needs work?"
            value={reviewForm.reflection_what_needs_work}
            onChange={(e) => setReviewForm((f) => ({ ...f, reflection_what_needs_work: e.target.value }))}
          />
          <Textarea
            label="What should I continue practicing?"
            value={reviewForm.reflection_continue_practicing}
            onChange={(e) => setReviewForm((f) => ({ ...f, reflection_continue_practicing: e.target.value }))}
          />
          <Button type="submit" disabled={endRotation.isPending}>Complete Review</Button>
        </form>
      </Modal>
    </div>
  )
}
