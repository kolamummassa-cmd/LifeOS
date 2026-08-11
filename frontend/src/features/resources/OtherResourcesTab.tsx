import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Input, Select } from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { listAcademies } from '../../lib/api/academies'
import { createResource, listResources, updateResource } from '../../lib/api/resources'
import { STATUS_LABELS, STATUS_OPTIONS } from './statusOptions'

const TYPE_OPTIONS = [
  { value: 'course', label: 'Course' },
  { value: 'article', label: 'Article' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'pdf', label: 'PDF' },
  { value: 'website', label: 'Website' },
]

const emptyForm = { title: '', resource_type: 'course', url: '', academy: '', status: 'want_to_learn' }

export default function OtherResourcesTab() {
  const queryClient = useQueryClient()
  const { data: resources, isLoading } = useQuery({ queryKey: ['generic-resources'], queryFn: () => listResources() })
  const { data: academies } = useQuery({ queryKey: ['academies'], queryFn: listAcademies })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const createMutation = useMutation({
    mutationFn: () =>
      createResource({
        title: form.title,
        resource_type: form.resource_type,
        url: form.url,
        academy: form.academy ? Number(form.academy) : null,
        status: form.status as never,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generic-resources'] })
      setOpen(false)
      setForm(emptyForm)
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateResource(id, { status: status as never }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['generic-resources'] }),
  })

  if (isLoading) return <p className="text-text-muted">Loading…</p>

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpen(true)}>+ Add Resource</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {resources?.map((r) => (
          <Card key={r.id}>
            <div className="mb-1 flex items-start justify-between">
              <p className="font-medium text-text-primary">{r.title}</p>
              <Badge>{STATUS_LABELS[r.status]}</Badge>
            </div>
            <p className="mb-2 text-xs uppercase text-text-muted">{r.resource_type}</p>
            {r.url && (
              <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
                {r.url}
              </a>
            )}
            <select
              className="mt-3 w-full rounded-lg border border-border bg-bg-secondary px-2 py-1 text-xs text-text-secondary"
              value={r.status}
              onChange={(e) => statusMutation.mutate({ id: r.id, status: e.target.value })}
            >
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Card>
        ))}
        {resources?.length === 0 && <p className="text-text-muted">Nothing here yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Resource">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate()
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <Select label="Type" value={form.resource_type} onChange={(e) => setForm((f) => ({ ...f, resource_type: e.target.value }))}>
            {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
          <Input label="URL" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} />
          <Select label="Academy" value={form.academy} onChange={(e) => setForm((f) => ({ ...f, academy: e.target.value }))}>
            <option value="">— None —</option>
            {academies?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
          <Select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Adding…' : 'Add Resource'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
