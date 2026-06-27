import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true, default: '' },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    emailOtpHash: { type: String, default: null },
    emailOtpExpires: { type: Date, default: null },
    loginChallengeHash: { type: String, default: null },
    loginChallengeExpires: { type: Date, default: null },
    phone: { type: String, trim: true, default: '' },
    profileImageUrl: { type: String, trim: true, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', userSchema)
