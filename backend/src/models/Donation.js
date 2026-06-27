import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true, unique: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: 'INR', trim: true },
    frequency: { type: String, enum: ['once', 'monthly'], required: true },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet'],
      required: true,
    },
    status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
    donorSnapshot: {
      name: String,
      email: String,
    },
  },
  { timestamps: true }
)

export const Donation = mongoose.model('Donation', donationSchema)
