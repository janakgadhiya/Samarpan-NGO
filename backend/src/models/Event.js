import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    venue: { type: String, trim: true, default: '' },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, default: null },
    coverImageUrl: { type: String, trim: true, default: '' },
    imageUrls: [{ type: String, trim: true }],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Event = mongoose.model('Event', eventSchema)
