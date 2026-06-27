import { Router } from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { requireAuth } from '../middleware/auth.js'
import { User } from '../models/User.js'
import { Campaign } from '../models/Campaign.js'
import { Donation } from '../models/Donation.js'
import { makeInvoiceId } from '../utils/ids.js'
import { buildInvoiceEmailHtml } from '../utils/invoiceMail.js'
import { sendMail } from '../config/mailer.js'

const router = Router()

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
  })
}

router.get('/me', requireAuth, async (req, res) => {
  try {
    const list = await Donation.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate('campaignId', 'title slug')
      .lean()
    return res.json({
      donations: list.map((d) => ({
        id: String(d._id),
        invoiceId: d.invoiceId,
        amount: d.amount,
        currency: d.currency,
        frequency: d.frequency,
        paymentMethod: d.paymentMethod,
        status: d.status,
        createdAt: d.createdAt,
        campaign: d.campaignId
          ? { title: d.campaignId.title, slug: d.campaignId.slug }
          : null,
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load donations' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const campaignId = String(req.body.campaignId || '').trim()
    const amount = Number(req.body.amount)
    const frequency = req.body.frequency === 'monthly' ? 'monthly' : 'once'
    const paymentMethod = String(req.body.paymentMethod || 'card')
    const pm = ['card', 'upi', 'netbanking', 'wallet'].includes(paymentMethod)
      ? paymentMethod
      : 'card'

    if (!campaignId || !Number.isFinite(amount) || amount < 1) {
      return res.status(400).json({ message: 'Valid campaign and amount are required' })
    }

    const campaign = await Campaign.findOne({ _id: campaignId, isActive: true })
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found or inactive' })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (campaign.goalAmount > 0) {
      if (campaign.raisedAmount >= campaign.goalAmount) {
        return res.status(400).json({ message: 'Campaign has already reached its fully funded goal! Thank you!' })
      }
      if (campaign.raisedAmount + amount > campaign.goalAmount) {
        const remaining = campaign.goalAmount - campaign.raisedAmount
        return res.status(400).json({ message: `This donation exceeds the limit. Only ₹${remaining} left to reach our goal!` })
      }
    }

    const invoiceId = makeInvoiceId()

    // Create Razorpay Order
    let razorpayOrder = null
    try {
      const razorpay = getRazorpay()
      razorpayOrder = await razorpay.orders.create({
        amount: amount * 100, // strictly in paise
        currency: 'INR',
        receipt: invoiceId,
      })
    } catch (rzpErr) {
      console.error('Razorpay order creation failed:', rzpErr)
      return res.status(500).json({ message: 'Failed to initiate payment with provider' })
    }

    const donation = await Donation.create({
      invoiceId,
      userId: user._id,
      campaignId: campaign._id,
      amount,
      currency: 'INR',
      frequency,
      paymentMethod: pm,
      status: 'pending', // Save as pending first
      donorSnapshot: { name: user.name, email: user.email },
    })

    return res.status(201).json({
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: razorpayOrder.id,
      donation: {
        id: String(donation._id),
        invoiceId: donation.invoiceId,
        amount: donation.amount,
        currency: donation.currency,
        frequency: donation.frequency,
        paymentMethod: donation.paymentMethod,
        status: donation.status,
        campaignTitle: campaign.title,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Payment could not be initiated' })
  }
})

router.post('/verify', requireAuth, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, donationId } = req.body

    const donation = await Donation.findById(donationId).populate('campaignId')
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' })
    }

    if (donation.status === 'completed') {
      return res.status(400).json({ message: 'Payment already verified' })
    }

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const digest = shasum.digest('hex')

    if (digest !== razorpay_signature) {
      donation.status = 'failed'
      await donation.save()
      return res.status(400).json({ message: 'Transaction not legit!' })
    }

    // Payment legit
    donation.status = 'completed'
    await donation.save()

    const campaign = donation.campaignId
    if (campaign) {
      campaign.raisedAmount += donation.amount
      await campaign.save()
    }

    const user = await User.findById(donation.userId)

    const paidAt = new Date(donation.createdAt).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    try {
      const html = buildInvoiceEmailHtml({
        invoiceId: donation.invoiceId,
        donorName: user.name,
        donorEmail: user.email,
        campaignTitle: campaign ? campaign.title : 'General Fund',
        amount: donation.amount,
        currency: 'INR',
        frequency: donation.frequency,
        paymentMethod: donation.paymentMethod,
        paidAt,
      })
      await sendMail({
        to: user.email,
        subject: `Donation receipt ${donation.invoiceId}`,
        text: `Thank you. Invoice ${donation.invoiceId} for INR ${donation.amount}.`,
        html,
      })
    } catch (mailErr) {
      console.error('Invoice email failed', mailErr)
    }

    return res.status(200).json({
      success: true,
      donation: {
        id: String(donation._id),
        invoiceId: donation.invoiceId,
        amount: donation.amount,
        currency: donation.currency,
        frequency: donation.frequency,
        paymentMethod: donation.paymentMethod,
        status: donation.status,
        campaignTitle: campaign ? campaign.title : '',
      },
    })
  } catch (err) {
    console.error('Verification error:', err)
    return res.status(500).json({ message: 'Verification failed' })
  }
})

export default router
