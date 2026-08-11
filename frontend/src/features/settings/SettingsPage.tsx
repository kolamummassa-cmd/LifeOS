import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTheme } from '../../app/ThemeProvider'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { createHabit, deleteHabit, listHabits } from '../../lib/api/habits'
import { createPerson, deletePerson, getDriveStatus, listPeople } from '../../lib/api/misc'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const queryClient = useQueryClient()

  const { data: habits } = useQuery({ queryKey: ['habits'], queryFn: listHabits })
  const [habitName, setHabitName] = useState('')
  const addHabit = useMutation({
    mutationFn: () => createHabit({ name: habitName, is_anchor: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setHabitName('')
    },
  })
  const removeHabit = useMutation({
    mutationFn: (id: number) => deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const { data: people } = useQuery({ queryKey: ['people'], queryFn: listPeople })
  const [personName, setPersonName] = useState('')
  const addPerson = useMutation({
    mutationFn: () => createPerson({ name: personName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] })
      setPersonName('')
    },
  })
  const removePerson = useMutation({
    mutationFn: (id: number) => deletePerson(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people'] }),
  })

  const { data: driveStatus } = useQuery({ queryKey: ['drive-status'], queryFn: getDriveStatus })

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>

      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">Appearance</h2>
        <div className="flex gap-2">
          {(['dark', 'light', 'system'] as const).map((t) => (
            <Button key={t} variant={theme === t ? 'primary' : 'secondary'} onClick={() => setTheme(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">Anchor Habits</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {habits?.map((h) => (
            <span key={h.id} className="flex items-center gap-1">
              <Badge>{h.name}</Badge>
              <button
                onClick={() => removeHabit.mutate(h.id)}
                className="text-xs text-text-muted hover:text-danger"
                aria-label={`Remove ${h.name}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (habitName.trim()) addHabit.mutate()
          }}
        >
          <Input placeholder="e.g. Prayer" value={habitName} onChange={(e) => setHabitName(e.target.value)} />
          <Button type="submit">Add</Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
          Networking — People
        </h2>
        <div className="mb-3 flex flex-col gap-2">
          {people?.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{p.name}</span>
              <button
                onClick={() => removePerson.mutate(p.id)}
                className="text-xs text-text-muted hover:text-danger"
              >
                Remove
              </button>
            </div>
          ))}
          {people?.length === 0 && <p className="text-sm text-text-muted">No contacts yet.</p>}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (personName.trim()) addPerson.mutate()
          }}
        >
          <Input placeholder="Name" value={personName} onChange={(e) => setPersonName(e.target.value)} />
          <Button type="submit">Add</Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
          Google Drive (Milestone 18)
        </h2>
        {driveStatus?.connected ? (
          <Badge tone="success">Connected</Badge>
        ) : driveStatus?.configured ? (
          <div className="flex items-center gap-3">
            <Badge tone="warning">Not connected yet</Badge>
            <a href={`${import.meta.env.VITE_API_URL}/integrations/drive/auth/`}>
              <Button variant="secondary">Connect Google Drive</Button>
            </a>
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            Not set up yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env — see
            docs/Roadmap.md for the steps.
          </p>
        )}
      </Card>
    </div>
  )
}
