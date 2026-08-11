import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Input, Select, Textarea } from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import ProgressBar from '../../components/ui/ProgressBar'
import { listAcademies } from '../../lib/api/academies'
import { createGoal, createMilestone, listGoals, updateMilestone } from '../../lib/api/goals'

const TIMEFRAME_OPTIONS = [
  { value: 'learning', label: 'Learning' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'long_term', label: 'Long-term' },
]

const emptyForm = { title: '', why: '', academy: '', timeframe: 'learning', deadline: '' }

export default function GoalsPage() {
  const queryClient = useQueryClient()
  const { data: goals, isLoading } = useQuery({ queryKey: ['goals'], queryFn: () => listGoals() })
  const { data: academies } = useQuery({ queryKey: ['academies'], queryFn: listAcademies })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<Record<number, string>>({})

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['goals'] })

  const createMutation = useMutation({
    mutationFn: () =>
      createGoal({
        title: form.title,
        why: form.why,
        academy: form.academy ? Number(form.academy) : null,
        timeframe: form.timeframe as never,
        deadline: form.deadline || null,
      }),
    onSuccess: () => {
      invalidate()
      setOpen(false)
      setForm(emptyForm)
    },
  })

  const addMilestone = useMutation({
    mutationFn: ({ goalId, title }: { goalId: number; title: string }) =>
      createMilestone({ goal: goalId, title }),
    onSuccess: invalidate,
  })

  const toggleMilestone = useMutation({
    mutationFn: ({ id, is_complete }: { id: number; is_complete: boolean }) =>
      updateMilestone(id, { is_complete }),
    onSuccess: invalidate,
  })

  if (isLoading) return <p className="text-text-muted">Loading goals…</p>

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Goals</h1>
        <Button onClick={() => setOpen(true)}>+ New Goal</Button>
      </div>

      <div className="flex flex-col gap-4">
        {goals?.map((goal) => (
          <Card key={goal.id}>
            <div className="mb-1 flex items-start justify-between">
              <div>
                <p className="font-medium text-text-primary">{goal.title}</p>
                {goal.academy_name && <p className="text-xs text-text-muted">{goal.academy_name} · {goal.timeframe}</p>}
              </div>
              {goal.deadline && <span className="text-xs text-text-muted">Due {goal.deadline}</span>}
            </div>
            {goal.why && <p className="mb-3 text-sm text-text-secondary">{goal.why}</p>}
            <ProgressBar value={goal.progress_percent} label="Milestones" />

            <div className="mt-3 flex flex-col gap-1">
              {goal.milestones.map((m) => (
                <label key={m.id} className="flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={m.is_complete}
                    onChange={(e) => toggleMilestone.mutate({ id: m.id, is_complete: e.target.checked })}
                  />
                  <span className={m.is_complete ? 'line-through text-text-muted' : ''}>{m.title}</span>
                </label>
              ))}
            </div>

            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                const title = newMilestoneTitle[goal.id]?.trim()
                if (!title) return
                addMilestone.mutate({ goalId: goal.id, title })
                setNewMilestoneTitle((s) => ({ ...s, [goal.id]: '' }))
              }}
            >
              <input
                className="flex-1 rounded-lg border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                placeholder="Add a milestone…"
                value={newMilestoneTitle[goal.id] || ''}
                onChange={(e) => setNewMilestoneTitle((s) => ({ ...s, [goal.id]: e.target.value }))}
              />
              <Button type="submit" variant="secondary">Add</Button>
            </form>
          </Card>
        ))}
        {goals?.length === 0 && <p className="text-text-muted">No goals yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Goal">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate()
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <Textarea label="Why does this matter?" value={form.why} onChange={(e) => setForm((f) => ({ ...f, why: e.target.value }))} />
          <Select label="Academy" value={form.academy} onChange={(e) => setForm((f) => ({ ...f, academy: e.target.value }))}>
            <option value="">— None —</option>
            {academies?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
          <Select label="Timeframe" value={form.timeframe} onChange={(e) => setForm((f) => ({ ...f, timeframe: e.target.value }))}>
            {TIMEFRAME_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
          <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating…' : 'Create Goal'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
