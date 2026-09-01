import { GoogleLogin } from '@react-oauth/google'
import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export function AdminLogin() {
  const { token, login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(!GOOGLE_CLIENT_ID)

  if (token) return <Navigate to="/admin" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username, password)
      navigate('/admin')
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않아요.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle(credential?: string) {
    if (!credential) return
    setError('')
    try {
      await loginWithGoogle(credential)
      navigate('/admin')
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 403) setError('관리자로 등록되지 않은 구글 계정이에요. root 계정에 문의해 주세요.')
      else setError('구글 로그인에 실패했어요.')
    }
  }

  return (
    <div className="bg-grid flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm border border-border bg-surface p-8">
        <p className="mb-1 font-mono text-xs tracking-widest text-muted uppercase">RE:ACT</p>
        <h1 className="mb-6 text-2xl font-semibold text-fg">관리자 로그인</h1>

        {GOOGLE_CLIENT_ID && (
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(res) => handleGoogle(res.credential)}
                onError={() => setError('구글 로그인에 실패했어요.')}
                theme="filled_black"
                text="signin_with"
                shape="rectangular"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordForm((v) => !v)}
              className="font-mono text-xs tracking-widest text-muted uppercase hover:text-fg"
            >
              {showPasswordForm ? '숨기기' : 'root 계정으로 로그인'}
            </button>
          </div>
        )}

        {showPasswordForm && (
          <form onSubmit={handleSubmit}>
            <label className="mb-4 flex flex-col gap-1.5">
              <span className="font-mono text-xs tracking-widest text-muted uppercase">아이디</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                className="border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-fg"
              />
            </label>

            <label className="mb-6 flex flex-col gap-1.5">
              <span className="font-mono text-xs tracking-widest text-muted uppercase">비밀번호</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-fg"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-fg bg-fg py-2.5 font-mono text-xs tracking-widest text-bg uppercase hover:opacity-80 disabled:opacity-50"
            >
              {loading ? '로그인 중…' : '로그인'}
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <a href="/" className="mt-6 block text-center font-mono text-xs tracking-widest text-muted uppercase hover:text-fg">
          ← 사이트로 돌아가기
        </a>
      </div>
    </div>
  )
}
