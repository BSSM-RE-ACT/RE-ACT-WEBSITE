import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminDashboard } from './admin/AdminDashboard'
import { AdminLogin } from './admin/AdminLogin'
import { ProtectedRoute } from './admin/ProtectedRoute'
import { AuthProvider } from './lib/auth'
import { Home } from './pages/Home'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

function Routed() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
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
