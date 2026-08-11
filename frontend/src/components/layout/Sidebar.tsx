import { NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listAcademies } from '../../lib/api/academies'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/academies', label: 'Academies' },
  { to: '/resources', label: 'Resources' },
  { to: '/notes', label: 'Notes' },
  { to: '/goals', label: 'Goals' },
  { to: '/journal', label: 'Journal' },
  { to: '/progress', label: 'Progress' },
  { to: '/search', label: 'Search' },
  { to: '/settings', label: 'Settings' },
]

export default function Sidebar() {
  const { data: academies } = useQuery({ queryKey: ['academies'], queryFn: listAcademies })
  const rotating = academies?.find((a) => a.academy_type === 'rotating' && a.is_active)

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-bg-secondary p-4">
      <div className="mb-6 px-2">
        <h1 className="text-lg font-semibold text-text-primary">LifeOS</h1>
        {rotating && (
          <p className="mt-1 text-xs text-text-muted">
            Focus: <span className="text-accent-secondary">{rotating.name}</span>
          </p>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-secondary hover:bg-card hover:text-text-primary'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
