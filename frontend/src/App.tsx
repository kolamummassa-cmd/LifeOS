import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './app/AuthProvider'
import ProtectedRoute from './app/ProtectedRoute'
import { ThemeProvider } from './app/ThemeProvider'
import AppLayout from './components/layout/AppLayout'
import AcademiesListPage from './features/academies/AcademiesListPage'
import AcademyDetailPage from './features/academies/AcademyDetailPage'
import LoginPage from './features/auth/LoginPage'
import DashboardPage from './features/dashboard/DashboardPage'
import GoalsPage from './features/goals/GoalsPage'
import JournalPage from './features/journal/JournalPage'
import NotesPage from './features/notes/NotesPage'
import ProgressPage from './features/progress/ProgressPage'
import ResourcesPage from './features/resources/ResourcesPage'
import SearchPage from './features/search/SearchPage'
import SettingsPage from './features/settings/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="academies" element={<AcademiesListPage />} />
                <Route path="academies/:id" element={<AcademyDetailPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="notes" element={<NotesPage />} />
                <Route path="goals" element={<GoalsPage />} />
                <Route path="journal" element={<JournalPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
