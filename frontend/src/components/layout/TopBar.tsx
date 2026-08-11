import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthProvider'
import Button from '../ui/Button'

export default function TopBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between border-b border-border px-8 py-4">
      <div className="text-sm text-text-muted">
        {new Date().toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-secondary">{user?.username}</span>
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
