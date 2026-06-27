// Set in frontend/ngo/.env as VITE_API_URL (empty in dev = same-origin relative `/api`)
const BASE = import.meta.env.VITE_API_URL ?? ''

export function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export function setToken(token, remember = false) {
  if (token) {
    if (remember) {
      localStorage.setItem('token', token)
      sessionStorage.removeItem('token')
    } else {
      sessionStorage.setItem('token', token)
      localStorage.removeItem('token')
    }
  } else {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
  }
}

export async function api(path, options = {}) {
  const url = `${BASE}${path}`
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(url, { ...options, headers })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { message: text || res.statusText }
  }
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}
