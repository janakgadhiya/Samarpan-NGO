import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, setToken, getToken } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadMe = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { user: u } = await api('/api/auth/me')
      setUser(u)
    } catch {
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMe()
  }, [loadMe])

  const register = useCallback(async (payload) => {
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (data.token) {
      setToken(data.token)
      setUser(data.user)
    } else {
      // Registration no longer logs the user in; OTP login is required.
      setToken(null)
      setUser(null)
    }
    return data
  }, [])

  /** After correct email+password, sends OTP; returns challengeToken for /otp/verify */
  const requestLoginOtp = useCallback(async (email, password) => {
    return api('/api/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }, [])

  const verifyLoginOtp = useCallback(async (email, otp, challengeToken, remember = false) => {
    const data = await api('/api/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp, challengeToken }),
    })
    setToken(data.token, remember)
    setUser(data.user)
    return data
  }, [])

  const loginAdmin = useCallback(async (username, password, remember = false) => {
    const data = await api('/api/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    setToken(data.token, remember)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const { user: u } = await api('/api/auth/me')
      setUser(u)
    } catch {
      setToken(null)
      setUser(null)
    }
  }, [])

  const updateProfile = useCallback(async (payload) => {
    const data = await api('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    setUser(data.user)
    return data
  }, [])

  const isAdmin = Boolean(user?.role === 'admin')

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin,
      register,
      requestLoginOtp,
      verifyLoginOtp,
      loginAdmin,
      logout,
      refreshUser,
      updateProfile,
    }),
    [
      user,
      loading,
      isAdmin,
      register,
      requestLoginOtp,
      verifyLoginOtp,
      loginAdmin,
      logout,
      refreshUser,
      updateProfile,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
