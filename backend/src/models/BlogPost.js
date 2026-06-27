import mongoose from 'mongoose'

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, trim: true, default: '' },
    content: { type: String, trim: true, default: '' },
    authorName: { type: String, trim: true, default: 'NGO Editorial' },
    coverImageUrl: { type: String, trim: true, default: '' },
    imageUrls: [{ type: String, trim: true }],
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const BlogPost = mongoose.model('BlogPost', blogPostSchema)
