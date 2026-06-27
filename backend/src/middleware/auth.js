import { verifyAccessToken } from '../utils/jwt.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' })
  }
  const token = header.slice('Bearer '.length).trim()
  if (!token) {
    return res.status(401).json({ message: 'Token required' })
  }
  try {
    const decoded = verifyAccessToken(token)
    req.userId = decoded.sub
    req.userEmail = decoded.email
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
