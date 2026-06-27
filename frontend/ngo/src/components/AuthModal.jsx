import { useState, useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaArrowLeft, FaEnvelope, FaClock, FaCheck, FaTimes } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { requestLoginOtp, verifyLoginOtp, register, loginAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [mode, setMode] = useState(initialMode) // 'login', 'register', 'otp', 'admin'
  
  // Login State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Admin Login State
  const [adminUsername, setAdminUsername] = useState('')
  
  // Register State
  const [name, setName] = useState('')
  
  // Forgot Password State
  const [newPassword, setNewPassword] = useState('')
  const [remember, setRemember] = useState(false)
  
  // OTP State
  const [challengeToken, setChallengeToken] = useState('')
  const [expiresInSeconds, setExpiresInSeconds] = useState(120)
  const otpId = useId().replace(/:/g, '')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(expiresInSeconds)
  const [canResend, setCanResend] = useState(false)
  
  // Common State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setError('')
      setInfo('')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen, initialMode])

  useEffect(() => {
    if (mode === 'otp') {
      setTimeLeft(expiresInSeconds)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
    }
  }, [mode, expiresInSeconds])

  useEffect(() => {
    if (mode !== 'otp') return
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, mode])

  if (!isOpen) return null

  const formatTime = (seconds) => {
    const s = Math.max(0, seconds)
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // --- Handlers ---
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      const data = await requestLoginOtp(email, password)
      setChallengeToken(data.challengeToken || '')
      setExpiresInSeconds(typeof data.expiresInSeconds === 'number' ? data.expiresInSeconds : 2 * 60)
      setMode('otp')
      setInfo('OTP sent to your email.')
    } catch (err) {
      setError(err.message || 'Could not send code')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await loginAdmin(adminUsername, password)
      onClose()
      navigate(location.pathname)
    } catch (err) {
      setError(err.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ name, email, password })
      setInfo('Account created! Please log in.')
      setMode('login')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the full 6-digit code')
      return
    }
    if (!challengeToken) {
      setError('Session expired. Go back and send the code again.')
      return
    }
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (mode === 'reset') {
         // Submitting password reset
         const res = await fetch('/api/auth/password/reset', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email, otp: otpString, challengeToken, newPassword })
         })
         const data = await res.json()
         if (!res.ok) throw new Error(data.message || 'Could not reset password')
         setInfo('Password successfully reset. You can now log in.')
         setMode('login')
      } else {
         // Submitting Login OTP
         await verifyLoginOtp(email, otpString, challengeToken, remember)
         onClose() // Success! Close modal.
         navigate(location.pathname) // refresh ui
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/password/forgot', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error requesting reset')
      setChallengeToken(data.challengeToken || '')
      setExpiresInSeconds(typeof data.expiresInSeconds === 'number' ? data.expiresInSeconds : 2 * 60)
      setMode('reset')
    } catch (err) {
      setError(err.message || 'Could not send reset code')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend || loading) return
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (mode === 'reset') {
         const res = await fetch('/api/auth/password/forgot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
         })
         const data = await res.json()
         if (!res.ok) throw new Error(data.message || 'Error requesting reset')
         setChallengeToken(data.challengeToken || '')
         setExpiresInSeconds(typeof data.expiresInSeconds === 'number' ? data.expiresInSeconds : 2 * 60)
         setInfo(data.message || 'A new reset code was sent.')
      } else {
         const data = await requestLoginOtp(email, password)
         setChallengeToken(data.challengeToken || '')
         setExpiresInSeconds(typeof data.expiresInSeconds === 'number' ? data.expiresInSeconds : 2 * 60)
         setInfo(data.message || 'A new code was sent to your email.')
      }
    } catch (err) {
      setError(err.message || 'Could not resend code')
    } finally {
      setLoading(false)
    }
  }

  // --- OTP Inputs logic ---
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    if (digit && index < 5) {
      document.getElementById(`ngo-otp-${otpId}-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`ngo-otp-${otpId}-${index - 1}`)?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = ['', '', '', '', '', '']
    for (let i = 0; i < 6; i += 1) next[i] = text[i] || ''
    setOtp(next)
    const focusAt = Math.min(text.length, 5)
    document.getElementById(`ngo-otp-${otpId}-${focusAt}`)?.focus()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-[420px] rounded-3xl bg-white shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
        >
          <FaTimes />
        </button>

        <div className="p-8 pb-9">
          <AnimatePresence mode="wait">
            
            {/* LOGIN MODE */}
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-full uppercase tracking-wider">Samarpan</span>
                  <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
                  <p className="mt-2 text-sm text-gray-500">Enter your credentials to access your dashboard and make donations.</p>
                </div>

                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                {info && <p className="mb-4 text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">{info}</p>}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input
                      type="password" required
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 mb-2">
                    {/* Remember Me Toggle Button */}
                    <button 
                      type="button" 
                      onClick={() => setRemember(!remember)}
                      className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                    >
                      <div className={`w-10 h-5 flex items-center rounded-full px-0.5 transition-colors duration-300 ${remember ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${remember ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                      Remember me
                    </button>
                    
                    {/* Forgot Password Pill Button */}
                    <button 
                      type="button" 
                      onClick={() => { setMode('forgot'); setError(''); setInfo(''); setOtp(['','','','','','']); }} 
                      className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70 mt-2"
                  >
                    {loading ? 'Sending Verification...' : 'Continue'}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                  New to Samarpan?{' '}
                  <button onClick={() => { setMode('register'); setError(''); setInfo(''); }} className="font-semibold text-emerald-600 hover:underline">
                    Create an account
                  </button>
                </p>

                <div className="mt-6 flex justify-center">
                  <button onClick={() => { setMode('admin'); setError(''); setInfo(''); }} className="text-xs text-gray-400 hover:text-emerald-600 transition-colors">
                    Staff Login
                  </button>
                </div>
              </motion.div>
            )}

            {/* REGISTER MODE */}
            {mode === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-full uppercase tracking-wider">Join Us</span>
                  <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                  <p className="mt-2 text-sm text-gray-500">Join Samarpan as a supporter to manage impact.</p>
                </div>

                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text" required
                      value={name} onChange={e => setName(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input
                      type="password" required minLength={8}
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70 mt-2"
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                  Already a member?{' '}
                  <button onClick={() => { setMode('login'); setError(''); setInfo(''); }} className="font-semibold text-emerald-600 hover:underline">
                    Sign in here
                  </button>
                </p>
              </motion.div>
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-full uppercase tracking-wider">Recovery</span>
                  <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                  <p className="mt-2 text-sm text-gray-500">We will send a secure 6-digit code to your email.</p>
                </div>

                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70 mt-2"
                  >
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <FaArrowLeft /> Back to login
                </button>
              </motion.div>
            )}

            {/* OTP MODE & RESET MODE */}
            {(mode === 'otp' || mode === 'reset') && (
              <motion.div
                key="otp-overlay"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                  <FaEnvelope />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">{mode === 'reset' ? 'Reset Password' : 'Check your email'}</h2>
                <p className="text-sm text-gray-500 mb-6">We've sent a 6-digit code to <strong className="text-gray-800">{email}</strong></p>

                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded-lg text-center">{error}</p>}
                {info && <p className="mb-4 text-sm text-emerald-700 bg-emerald-50 p-2 rounded-lg text-center">{info}</p>}

                <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
                  {mode === 'reset' && (
                    <div className="text-left w-full mb-2">
                       <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                       <input
                         type="password" required minLength={8}
                         value={newPassword} onChange={e => setNewPassword(e.target.value)}
                         className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                         placeholder="Enter new 8+ character password"
                       />
                       <label className="block text-sm font-semibold text-gray-700 mb-1 mt-4">Reset Code</label>
                    </div>
                  )}

                  <div className="flex justify-between gap-2" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`ngo-otp-${otpId}-${index}`}
                        type="text" inputMode="numeric" maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="h-12 w-10 sm:w-12 rounded-xl border-2 border-gray-200 text-center text-xl font-bold tracking-widest text-gray-900 outline-none transition-all focus:border-emerald-500 focus:bg-emerald-50"
                      />
                    ))}
                  </div>

                  <div className="flex justify-center items-center gap-2 text-sm text-gray-500 font-medium">
                    <FaClock />
                    {timeLeft > 0 ? <span>Expires in {formatTime(timeLeft)}</span> : <span className="text-red-500">Code expired</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6 || !challengeToken || (mode === 'reset' && newPassword.length < 8)}
                    className="flex justify-center items-center gap-2 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                  >
                    {loading ? (mode === 'reset' ? 'Saving...' : 'Verifying...') : (mode === 'reset' ? <><FaCheck /> Set New Password</> : <><FaCheck /> Verify &amp; login</>)}
                  </button>
                  
                  <div>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={!canResend || loading}
                      className={`text-sm font-semibold transition-colors ${canResend && !loading ? 'text-emerald-600 hover:text-emerald-800' : 'text-gray-400'}`}
                    >
                      {loading && canResend ? 'Sending...' : canResend ? 'Resend verification code' : `Resend available in ${formatTime(timeLeft)}`}
                    </button>
                  </div>
                </form>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <FaArrowLeft /> Back to login
                </button>
              </motion.div>
            )}

            {/* ADMIN MODE */}
            {mode === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-gray-800 bg-gray-200 rounded-full uppercase tracking-wider">Admin</span>
                  <h2 className="text-2xl font-bold text-gray-900">Staff Access</h2>
                  <p className="mt-2 text-sm text-gray-500">Sign in to the management dashboard.</p>
                </div>

                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                    <input
                      type="text" required
                      value={adminUsername} onChange={e => setAdminUsername(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input
                      type="password" required
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    className="w-full rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-70 mt-2"
                  >
                    {loading ? 'Authenticating...' : 'Secure Login'}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <FaArrowLeft /> Back to user login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
