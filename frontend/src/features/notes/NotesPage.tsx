import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { listAcademies } from '../../lib/api/academies'
import { createNote, deleteNote, listNotes, updateNote } from '../../lib/api/notes'
import type { Note } from '../../types'

const emptyDraft = { title: '', body: '', academy: '', tags: '' }

export default function NotesPage() {
  const queryClient = useQueryClient()
  const { data: notes, isLoading } = useQuery({ queryKey: ['notes'], queryFn: () => listNotes() })
  const { data: academies } = useQuery({ queryKey: ['academies'], queryFn: listAcademies })
  const [selected, setSelected] = useState<Note | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [creating, setCreating] = useState(false)

  const select = (note: Note) => {
    setSelected(note)
    setCreating(false)
    setDraft({
      title: note.title,
      body: note.body,
      academy: note.academy ? String(note.academy) : '',
      tags: note.tags.join(', '),
    })
  }

  const startNew = () => {
    setSelected(null)
    setCreating(true)
    setDraft(emptyDraft)
  }

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['notes'] })

  const createMutation = useMutation({
    mutationFn: () =>
      createNote({
        title: draft.title,
        body: draft.body,
        academy: draft.academy ? Number(draft.academy) : null,
        tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean),
      }),
    onSuccess: (note) => {
      invalidate()
      select(note)
    },
  })

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!selected) throw new Error('no note selected')
      return updateNote(selected.id, {
        title: draft.title,
        body: draft.body,
        academy: draft.academy ? Number(draft.academy) : null,
        tags: draft.tags.split(',').map((t) => t.trim()).filter(Boolean),
      })
    },
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(selected!.id),
    onSuccess: () => {
      invalidate()
      setSelected(null)
      setDraft(emptyDraft)
    },
  })

  return (
    <div className="mx-auto flex h-full max-w-5xl gap-6">
      <div className="w-64 shrink-0">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-primary">Notes</h1>
          <Button onClick={startNew}>+ New</Button>
        </div>
        {isLoading ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : (
          <div className="flex flex-col gap-2">
            {notes?.map((note) => (
              <button
                key={note.id}
                onClick={() => select(note)}
                className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                  selected?.id === note.id
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-card hover:border-accent/50'
                }`}
              >
                <p className="font-medium text-text-primary">{note.title || 'Untitled'}</p>
                {note.academy_name && <p className="text-xs text-text-muted">{note.academy_name}</p>}
              </button>
            ))}
          </div>
        )}
      </div>

      <Card className="flex-1">
        {!selected && !creating ? (
          <p className="text-text-muted">Select a note, or create a new one.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              label="Title"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
            <Select
              label="Academy"
              value={draft.academy}
              onChange={(e) => setDraft((d) => ({ ...d, academy: e.target.value }))}
            >
              <option value="">— None —</option>
              {academies?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </Select>
            <Input
              label="Tags (comma-separated)"
              value={draft.tags}
              onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
            />
            {selected && selected.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selected.tags.map((t) => <Badge key={t}>{t}</Badge>)}
              </div>
            )}
            <Textarea
              label="Body (Markdown supported)"
              className="min-h-64"
              value={draft.body}
              onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => (creating ? createMutation.mutate() : updateMutation.mutate())}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {creating ? 'Create Note' : 'Save Changes'}
              </Button>
              {selected && (
                <Button variant="danger" onClick={() => deleteMutation.mutate()}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
