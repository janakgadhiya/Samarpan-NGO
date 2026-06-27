import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { User } from '../models/User.js'
import { signAccessToken } from '../utils/jwt.js'
import { sendMail } from '../config/mailer.js'
import { requireAuth } from '../middleware/auth.js'
import { getEnv } from '../config/env.js'

const router = Router()

function accessPayload(user) {
  return {
    sub: user._id.toString(),
    email: user.email,
    role: user.role || 'user',
  }
}

const SALT_ROUNDS = 12
const VERIFY_HOURS = 48
/** Email OTP validity for sign-in */
const OTP_MINUTES = 2

function hashOtp(code) {
  return crypto.createHash('sha256').update(String(code).trim(), 'utf8').digest('hex')
}

function hashChallenge(token) {
  return crypto.createHash('sha256').update(String(token).trim(), 'utf8').digest('hex')
}

function randomSixDigitOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
}

router.post('/register', async (req, res) => {
  try {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase()
    const password = String(req.body.password || '')
    const name = String(req.body.name || '').trim()

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const initialAdmin =
      process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase() || ''
    const role = initialAdmin && email === initialAdmin ? 'admin' : 'user'

    const user = await User.create({
      email,
      passwordHash,
      name,
      // Email verification link removed; access is granted after successful OTP login.
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      role,
    })

    return res.status(201).json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
      },
      message: 'Account created. Sign in to receive your OTP code.',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Registration failed' })
  }
})

/**
 * Step 1: verify email + password, then send 6-digit OTP (valid OTP_MINUTES).
 * Returns challengeToken — required with OTP in step 2 so only this browser/session can complete login.
 */
router.post('/otp/request', async (req, res) => {
  try {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase()
    const password = String(req.body.password || '')

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash)
    if (!passwordOk) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const plainChallenge = crypto.randomBytes(32).toString('hex')
    const challengeHash = hashChallenge(plainChallenge)
    const plainOtp = randomSixDigitOtp()
    const otpHash = hashOtp(plainOtp)
    const expires = new Date(Date.now() + OTP_MINUTES * 60 * 1000)

    user.loginChallengeHash = challengeHash
    user.loginChallengeExpires = expires
    user.emailOtpHash = otpHash
    user.emailOtpExpires = expires
    await user.save()

    await sendMail({
      to: email,
      subject: 'Your Samarpan Sign-in Code',
      text: `Your sign-in code is ${plainOtp}. It expires in ${OTP_MINUTES} minutes.\n\nIf you did not request this, you can ignore this email.`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #111827;">
          <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <div style="background-color: #059669; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">SAMARPAN</h1>
            </div>
            <div style="padding: 40px 32px;">
              <h2 style="margin-top: 0; font-size: 20px; font-weight: 600; color: #1f2937;">Secure Sign In</h2>
              <p style="font-size: 16px; line-height: 1.5; color: #4b5563; margin-bottom: 32px;">
                You are trying to sign in to your Samarpan account. Please use the following One-Time Password to complete your login securely.
              </p>
              
              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
                <span style="display: block; font-size: 12px; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Your Authentication Code</span>
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #065f46;">
                  ${plainOtp}
                </div>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; text-align: center;">
                This code will expire in <strong>${OTP_MINUTES} minutes</strong>.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
              
              <p style="font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
                If you did not request this OTP, please ignore this email. Your account remains secure.
                <br /><br />
                &copy; ${new Date().getFullYear()} Samarpan NGO. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    })

    return res.json({
      message: 'Check your email for the 6-digit code.',
      challengeToken: plainChallenge,
      expiresInSeconds: OTP_MINUTES * 60,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not send sign-in code' })
  }
})

router.post('/otp/verify', async (req, res) => {
  try {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase()
    const otp = String(req.body.otp || '').replace(/\s/g, '')
    const challengeToken = String(req.body.challengeToken || '').trim()

    if (!email || !otp || !challengeToken) {
      return res.status(400).json({ message: 'Email, password step token, and code are required' })
    }
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ message: 'Enter the 6-digit code from your email' })
    }

    const otpHash = hashOtp(otp)
    const challengeHash = hashChallenge(challengeToken)
    const now = new Date()
    const user = await User.findOne({
      email,
      emailOtpHash: otpHash,
      emailOtpExpires: { $gt: now },
      loginChallengeHash: challengeHash,
      loginChallengeExpires: { $gt: now },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code. Request a new code from the login form.' })
    }

    user.emailOtpHash = null
    user.emailOtpExpires = null
    user.loginChallengeHash = null
    user.loginChallengeExpires = null
    await user.save()

    const token = signAccessToken(accessPayload(user))

    return res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Sign-in failed' })
  }
})

// === FORGOT PASSWORD FLOW ===

router.post('/password/forgot', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address.' })
    }

    const plainChallenge = crypto.randomBytes(32).toString('hex')
    const challengeHash = hashChallenge(plainChallenge)
    const plainOtp = randomSixDigitOtp()
    const otpHash = hashOtp(plainOtp)
    const expires = new Date(Date.now() + OTP_MINUTES * 60 * 1000)

    user.loginChallengeHash = challengeHash
    user.loginChallengeExpires = expires
    user.emailOtpHash = otpHash
    user.emailOtpExpires = expires
    await user.save()

    await sendMail({
      to: email,
      subject: 'Password Reset Code - Samarpan',
      text: `Your password reset code is ${plainOtp}. It expires in ${OTP_MINUTES} minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Use the following code:</p>
          <div style="font-size: 32px; font-weight: bold; background: #f3f4f6; padding: 16px; width: max-content; letter-spacing: 4px;">${plainOtp}</div>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    })

    return res.json({
      message: 'Check your email for the reset code.',
      challengeToken: plainChallenge,
      expiresInSeconds: OTP_MINUTES * 60,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not send reset code' })
  }
})

router.post('/password/reset', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const otp = String(req.body.otp || '').replace(/\s/g, '')
    const challengeToken = String(req.body.challengeToken || '').trim()
    const newPassword = String(req.body.newPassword || '')

    if (!email || !otp || !challengeToken || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' })
    }

    const otpHash = hashOtp(otp)
    const challengeHash = hashChallenge(challengeToken)
    const now = new Date()
    
    const user = await User.findOne({
      email,
      emailOtpHash: otpHash,
      emailOtpExpires: { $gt: now },
      loginChallengeHash: challengeHash,
      loginChallengeExpires: { $gt: now },
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code.' })
    }

    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)
    user.emailOtpHash = null
    user.emailOtpExpires = null
    user.loginChallengeHash = null
    user.loginChallengeExpires = null
    await user.save()

    return res.json({ message: 'Password has been successfully reset. You can now log in.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not reset password' })
  }
})

router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (username !== 'samarpan' || password !== 'samarpan') {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }
    
    // We need to return a token. If there's an existing admin user, use their ID.
    // Otherwise, we create a placeholder admin user.
    let adminUser = await User.findOne({ role: 'admin', email: 'samarpan@samarpan.org' })
    if (!adminUser) {
      adminUser = await User.create({
        email: 'samarpan@samarpan.org',
        passwordHash: 'dummy',
        name: 'Admin',
        isEmailVerified: true,
        role: 'admin',
      })
    }

    const token = signAccessToken(accessPayload(adminUser))
    return res.json({
      token,
      user: {
        id: adminUser._id.toString(),
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        isEmailVerified: true,
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Admin login failed' })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      'email name isEmailVerified createdAt role phone profileImageUrl'
    )
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        role: user.role,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load profile' })
  }
})

router.patch('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (req.body.name !== undefined) user.name = String(req.body.name).trim()
    if (req.body.phone !== undefined) user.phone = String(req.body.phone).trim()
    if (req.body.profileImageUrl !== undefined) {
      user.profileImageUrl = String(req.body.profileImageUrl).trim()
    }
    await user.save()
    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not update profile' })
  }
})

router.get('/verify-email', async (req, res) => {
  try {
    return res.status(410).json({
      message:
        'Email verification has been disabled. Sign in using your email OTP code instead.',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Verification failed' })
  }
})

export default router
