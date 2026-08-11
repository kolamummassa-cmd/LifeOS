import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Input, Select, Textarea } from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { createAcademy, listAcademies } from '../../lib/api/academies'
import type { Academy } from '../../types'

export default function AcademiesListPage() {
  const queryClient = useQueryClient()
  const { data: academies, isLoading } = useQuery({ queryKey: ['academies'], queryFn: listAcademies })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', academy_type: 'rotating', description: '' })

  const createMutation = useMutation({
    mutationFn: createAcademy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academies'] })
      setOpen(false)
      setForm({ name: '', slug: '', academy_type: 'rotating', description: '' })
    },
  })

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))
  }

  if (isLoading) return <p className="text-text-muted">Loading academies…</p>

  const anchors = academies?.filter((a) => a.academy_type === 'anchor') ?? []
  const rotating = academies?.filter((a) => a.academy_type === 'rotating') ?? []

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Academies</h1>
        <Button onClick={() => setOpen(true)}>+ New Academy</Button>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">Anchors (continuous)</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {anchors.map((a) => (
          <Link key={a.id} to={`/academies/${a.id}`}>
            <Card className="h-full transition-colors hover:border-accent">
              <div className="mb-2 h-2 w-8 rounded-full" style={{ backgroundColor: a.color }} />
              <p className="font-medium text-text-primary">{a.name}</p>
              <p className="mt-1 text-xs text-text-muted">{a.resource_count} resources · {a.goal_count} goals</p>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">Rotating</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {rotating.map((a) => (
          <Link key={a.id} to={`/academies/${a.id}`}>
            <Card className="h-full transition-colors hover:border-accent">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-2 w-8 rounded-full" style={{ backgroundColor: a.color }} />
                {a.is_active && a.current_period && <Badge tone="accent">In focus</Badge>}
              </div>
              <p className="font-medium text-text-primary">{a.name}</p>
              <p className="mt-1 text-xs text-text-muted">{a.resource_count} resources · {a.goal_count} goals</p>
            </Card>
          </Link>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Academy">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate({ ...form, academy_type: form.academy_type as Academy['academy_type'] })
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Name" value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
          <Select
            label="Type"
            value={form.academy_type}
            onChange={(e) => setForm((f) => ({ ...f, academy_type: e.target.value }))}
          >
            <option value="rotating">Rotating (one at a time)</option>
            <option value="anchor">Anchor (continuous)</option>
          </Select>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating…' : 'Create Academy'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
