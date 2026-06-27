import mongoose from 'mongoose'
import { getEnv } from './env.js'

export async function connectDb() {
  await mongoose.connect(getEnv().mongodbUri)
}
