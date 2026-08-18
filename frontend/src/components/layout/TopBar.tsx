import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthProvider'
import Button from '../ui/Button'

interface TopBarProps {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-4 sm:px-8">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={onMenuClick}
          className="shrink-0 rounded-lg p-2 text-text-muted hover:bg-card hover:text-text-primary md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
        <div className="truncate text-sm text-text-muted">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden text-sm text-text-secondary sm:inline">{user?.username}</span>
        <Button
          variant="ghost"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          Sign out
        </Button>
      </div>
    </header>
  )
}
