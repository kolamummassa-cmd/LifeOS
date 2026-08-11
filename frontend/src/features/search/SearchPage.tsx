import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Card from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { search } from '../../lib/api/misc'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const { data, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => search(query),
    enabled: query.trim().length > 1,
  })

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold text-text-primary">Search</h1>
      <Input
        placeholder="Search resources, notes, and goals…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {isFetching && <p className="mt-4 text-text-muted">Searching…</p>}

      {data && (
        <div className="mt-6 flex flex-col gap-6">
          {(['resources', 'notes', 'goals'] as const).map((section) => (
            <div key={section}>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">{section}</h2>
              {data[section].length === 0 ? (
                <p className="text-sm text-text-muted">No matches.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {data[section].map((item) => (
                    <Card key={item.id}>
                      <p className="text-text-primary">{item.title}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
