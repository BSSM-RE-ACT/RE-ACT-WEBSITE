import axios from 'axios'

export const TOKEN_KEY = 'react_admin_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      if (!location.pathname.startsWith('/admin/login')) {
        location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  },
)

export function assetUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/api\/?$/, '')
  return `${base}${path}`
}
