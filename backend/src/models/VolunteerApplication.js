import mongoose from 'mongoose'

const volunteerApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    interest: { type: String, trim: true, default: '' },
    message: { type: String, trim: true, default: '' },
    kind: { type: String, enum: ['volunteer', 'internship'], default: 'volunteer' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
  },
  { timestamps: true }
)

export const VolunteerApplication = mongoose.model(
  'VolunteerApplication',
  volunteerApplicationSchema
)
