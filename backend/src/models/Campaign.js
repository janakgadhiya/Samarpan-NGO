import mongoose from 'mongoose'

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    summary: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    goalAmount: { type: Number, default: 0 },
    coverImageUrl: { type: String, trim: true, default: '' },
    imageUrls: [{ type: String, trim: true }],
    category: { 
      type: String, 
      enum: ['education', 'disaster', 'healthcare', 'womens-safety', 'general'], 
      default: 'general' 
    },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true }
)

export const Campaign = mongoose.model('Campaign', campaignSchema)
