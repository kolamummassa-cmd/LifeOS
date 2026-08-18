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

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: academies } = useQuery({ queryKey: ['academies'], queryFn: listAcademies })
  const rotating = academies?.find((a) => a.academy_type === 'rotating' && a.is_active)

  return (
    <>
      {/* Backdrop — mobile only, shown while the drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-border
          bg-bg-secondary p-4 transition-transform duration-200 ease-in-out
          md:static md:z-auto md:w-60 md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-6 flex items-start justify-between px-2">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">LifeOS</h1>
            {rotating && (
              <p className="mt-1 text-xs text-text-muted">
                Focus: <span className="text-accent-secondary">{rotating.name}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="-mr-1 rounded-lg p-1 text-text-muted hover:bg-card hover:text-text-primary md:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
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
    </>
  )
}
