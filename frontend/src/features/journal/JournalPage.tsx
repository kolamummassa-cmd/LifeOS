import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Select, Textarea } from '../../components/ui/Input'
import { createJournalEntry, listJournalEntries } from '../../lib/api/journal'

const ENTRY_TYPES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]

const PROMPTS: { key: string; label: string }[] = [
  { key: 'what_did_i_learn', label: 'What did I learn today?' },
  { key: 'what_did_i_build', label: 'What did I build?' },
  { key: 'what_challenged_me', label: 'What challenged me?' },
  { key: 'what_mistake_did_i_make', label: 'What mistake did I make?' },
  { key: 'what_did_i_understand_better', label: 'What did I understand better?' },
  { key: 'what_am_i_grateful_for', label: 'What am I grateful for?' },
  { key: 'what_should_i_improve', label: 'What should I improve?' },
  { key: 'what_did_i_avoid', label: 'What did I avoid?' },
  { key: 'what_should_i_do_differently', label: 'What should I do differently tomorrow?' },
]

const today = new Date().toISOString().slice(0, 10)
const emptyForm: Record<string, string> = {
  entry_type: 'daily',
  period_start: today,
  ...Object.fromEntries(PROMPTS.map((p) => [p.key, ''])),
  free_write: '',
}

export default function JournalPage() {
  const queryClient = useQueryClient()
  const [entryType, setEntryType] = useState('daily')
  const { data: entries, isLoading } = useQuery({
    queryKey: ['journal-entries', entryType],
    queryFn: () => listJournalEntries(entryType),
  })
  const [form, setForm] = useState(emptyForm)

  const createMutation = useMutation({
    mutationFn: () => createJournalEntry(form as never),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] })
      setForm(emptyForm)
    },
  })

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <h1 className="mb-4 text-2xl font-semibold text-text-primary">New Entry</h1>
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createMutation.mutate()
            }}
            className="flex flex-col gap-4"
          >
            <Select
              label="Type"
              value={form.entry_type}
              onChange={(e) => setForm((f) => ({ ...f, entry_type: e.target.value }))}
            >
              {ENTRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
            {PROMPTS.map((p) => (
              <Textarea
                key={p.key}
                label={p.label}
                value={form[p.key]}
                onChange={(e) => setForm((f) => ({ ...f, [p.key]: e.target.value }))}
              />
            ))}
            <Textarea
              label="Free write"
              value={form.free_write}
              onChange={(e) => setForm((f) => ({ ...f, free_write: e.target.value }))}
            />
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving…' : 'Save Entry'}
            </Button>
          </form>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Past Entries</h2>
          <Select value={entryType} onChange={(e) => setEntryType(e.target.value)} className="w-40">
            {ENTRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </div>
        {isLoading ? (
          <p className="text-text-muted">Loading…</p>
        ) : (
          <div className="flex flex-col gap-3">
            {entries?.map((entry) => (
              <Card key={entry.id}>
                <p className="mb-2 text-sm font-medium text-text-primary">{entry.period_start}</p>
                {entry.what_did_i_learn && (
                  <p className="text-sm text-text-secondary">{entry.what_did_i_learn}</p>
                )}
              </Card>
            ))}
            {entries?.length === 0 && <p className="text-text-muted">No entries yet.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
