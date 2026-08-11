import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Input, Select } from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { listAcademies } from '../../lib/api/academies'
import { createPodcast, listPodcasts, updatePodcast } from '../../lib/api/resources'
import { STATUS_LABELS, STATUS_OPTIONS } from './statusOptions'

const emptyForm = { title: '', episode: '', speaker: '', academy: '', status: 'want_to_learn' }

export default function PodcastsTab() {
  const queryClient = useQueryClient()
  const { data: podcasts, isLoading } = useQuery({ queryKey: ['podcasts'], queryFn: () => listPodcasts() })
  const { data: academies } = useQuery({ queryKey: ['academies'], queryFn: listAcademies })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const createMutation = useMutation({
    mutationFn: () =>
      createPodcast({
        title: form.title,
        episode: form.episode,
        speaker: form.speaker,
        academy: form.academy ? Number(form.academy) : null,
        status: form.status as never,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcasts'] })
      setOpen(false)
      setForm(emptyForm)
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updatePodcast(id, { status: status as never }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['podcasts'] }),
  })

  if (isLoading) return <p className="text-text-muted">Loading podcasts…</p>

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpen(true)}>+ Add Podcast</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {podcasts?.map((p) => (
          <Card key={p.id}>
            <div className="mb-1 flex items-start justify-between">
              <p className="font-medium text-text-primary">{p.title}</p>
              <Badge>{STATUS_LABELS[p.status]}</Badge>
            </div>
            {p.episode && <p className="text-sm text-text-muted">{p.episode}</p>}
            {p.speaker && <p className="text-sm text-text-muted">with {p.speaker}</p>}
            <select
              className="mt-3 w-full rounded-lg border border-border bg-bg-secondary px-2 py-1 text-xs text-text-secondary"
              value={p.status}
              onChange={(e) => statusMutation.mutate({ id: p.id, status: e.target.value })}
            >
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Card>
        ))}
        {podcasts?.length === 0 && <p className="text-text-muted">No podcasts yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Podcast">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate()
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <Input label="Episode" value={form.episode} onChange={(e) => setForm((f) => ({ ...f, episode: e.target.value }))} />
          <Input label="Speaker" value={form.speaker} onChange={(e) => setForm((f) => ({ ...f, speaker: e.target.value }))} />
          <Select label="Academy" value={form.academy} onChange={(e) => setForm((f) => ({ ...f, academy: e.target.value }))}>
            <option value="">— None —</option>
            {academies?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
          <Select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Adding…' : 'Add Podcast'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
