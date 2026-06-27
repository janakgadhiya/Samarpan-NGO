import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { getEnv } from './config/env.js'
import { connectDb } from './config/db.js'
import authRoutes from './routes/auth.js'
import campaignRoutes from './routes/campaigns.js'
import eventRoutes from './routes/events.js'
import blogRoutes from './routes/blogs.js'
import donationRoutes from './routes/donations.js'
import volunteerRoutes from './routes/volunteers.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/upload.js'
import { User } from './models/User.js'
import { connectCloudinary } from './config/cloudinary.js'

const env = getEnv()
const app = express()

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/volunteers', volunteerRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/upload', uploadRoutes)

async function promoteInitialAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase()
  if (!email) return
  const result = await User.updateMany({ email }, { $set: { role: 'admin' } })
  if (result.modifiedCount > 0) {
    console.log('[boot] Promoted admin role for', email)
  }
}

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Server error' })
})

async function main() {
  connectCloudinary()
  await connectDb()
  await promoteInitialAdmin()
  app.listen(env.port, env.host, () => {
    console.log(`API listening on http://${env.host}:${env.port}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
