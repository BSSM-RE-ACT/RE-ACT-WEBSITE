import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, TOKEN_KEY } from './api'
import type { Me } from '../types'

interface AuthContextValue {
  token: string | null
  me: Me | null
  isRoot: boolean
  isAdmin: boolean
  memberId: number | null
  login: (username: string, password: string) => Promise<Me>
  loginWithGoogle: (credential: string) => Promise<Me>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY))
  const [me, setMe] = useState<Me | null>(null)

  async function refreshMe() {
    try {
      const res = await api.get<Me>('/auth/me')
      setMe(res.data)
      return res.data
    } catch {
      setMe(null)
      return null
    }
  }

  useEffect(() => {
    if (token) refreshMe()
    else setMe(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function login(username: string, password: string) {
    const res = await api.post('/auth/login', { username, password })
    localStorage.setItem(TOKEN_KEY, res.data.access_token)
    setToken(res.data.access_token)
    const fetched = await refreshMe()
    if (!fetched) throw new Error('로그인 정보를 불러오지 못했어요.')
    return fetched
  }

  async function loginWithGoogle(credential: string) {
    const res = await api.post('/auth/google', { credential })
    localStorage.setItem(TOKEN_KEY, res.data.access_token)
    setToken(res.data.access_token)
    const fetched = await refreshMe()
    if (!fetched) throw new Error('로그인 정보를 불러오지 못했어요.')
    return fetched
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setMe(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        me,
        isRoot: me?.is_root ?? false,
        isAdmin: me?.is_admin ?? false,
        memberId: me?.member_id ?? null,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
