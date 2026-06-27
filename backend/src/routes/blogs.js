import { Router } from 'express'
import { BlogPost } from '../models/BlogPost.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .sort({ publishedAt: -1 })
      .lean()
    return res.json({
      posts: posts.map((p) => ({
        id: String(p._id),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        authorName: p.authorName,
        coverImageUrl: p.coverImageUrl,
        publishedAt: p.publishedAt,
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load posts' })
  }
})

router.get('/slug/:slug', async (req, res) => {
  try {
    const p = await BlogPost.findOne({
      slug: req.params.slug,
      published: true,
    }).lean()
    if (!p) return res.status(404).json({ message: 'Post not found' })
    return res.json({
      post: {
        id: String(p._id),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        authorName: p.authorName,
        coverImageUrl: p.coverImageUrl,
        publishedAt: p.publishedAt,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load post' })
  }
})

export default router
