import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminDashboard } from './admin/AdminDashboard'
import { AdminLogin } from './admin/AdminLogin'
import { ProtectedRoute } from './admin/ProtectedRoute'
import { AuthProvider } from './lib/auth'
import { ContactPage } from './pages/ContactPage'
import { Home } from './pages/Home'
import { ProjectDetail } from './pages/ProjectDetail'
import { ProjectsPage } from './pages/ProjectsPage'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

function Routed() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

function App() {
  if (!GOOGLE_CLIENT_ID) return <Routed />
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Routed />
    </GoogleOAuthProvider>
  )
}

export default App
