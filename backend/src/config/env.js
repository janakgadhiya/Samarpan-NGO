/**
 * All configuration comes from `backend/.env` (loaded via dotenv in server.js).
 * Do not hardcode ports, MongoDB URI, or URLs here.
 */

function required(name) {
  const v = process.env[name]
  if (v === undefined || v === '') {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to backend/.env (see backend/.env.example).`
    )
  }
  return v
}

let cached

export function getEnv() {
  if (cached) return cached

  const port = Number(required('PORT'))
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('PORT in backend/.env must be a positive number')
  }

  cached = {
    port,
    host: required('HOST'),
    mongodbUri: required('MONGODB_URI'),
    clientOrigin: required('CLIENT_ORIGIN'),
    jwtSecret: required('JWT_SECRET'),
  }
  return cached
}
