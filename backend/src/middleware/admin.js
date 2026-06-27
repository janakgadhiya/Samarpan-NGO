import { User } from '../models/User.js'

export async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('role')
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    next()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Authorization check failed' })
  }
}
