import jwt from 'jsonwebtoken'
import { getEnv } from '../config/env.js'

export function signAccessToken(payload) {
  return jwt.sign(payload, getEnv().jwtSecret, { expiresIn: '7d' })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getEnv().jwtSecret)
}
