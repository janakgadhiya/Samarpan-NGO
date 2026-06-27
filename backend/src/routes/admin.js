import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/admin.js'
import { Campaign } from '../models/Campaign.js'
import { Event } from '../models/Event.js'
import { BlogPost } from '../models/BlogPost.js'
import { Donation } from '../models/Donation.js'
import { VolunteerApplication } from '../models/VolunteerApplication.js'
import { slugify } from '../utils/ids.js'

const router = Router()
router.use(requireAuth, requireAdmin)

router.get('/stats', async (_req, res) => {
  try {
    const [totalAgg, countCamp, countEvents, countPosts] = await Promise.all([
      Donation.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Campaign.countDocuments(),
      Event.countDocuments(),
      BlogPost.countDocuments(),
    ])

    const totalRaised = totalAgg[0]?.total || 0
    const donationCount = totalAgg[0]?.count || 0

    const start = new Date()
    start.setUTCDate(1)
    start.setUTCHours(0, 0, 0, 0)
    start.setUTCMonth(start.getUTCMonth() - 11)

    const monthlyRaw = await Donation.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
          },
          total: { $sum: '$amount' },
          donations: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ])

    const salesSeries = monthlyRaw.map((r) => ({
      year: r._id.y,
      month: r._id.m,
      label: `${String(r._id.m).padStart(2, '0')}/${r._id.y}`,
      total: r.total,
      donations: r.donations,
    }))

    const salesByCategoryRaw = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $lookup: { from: 'campaigns', localField: 'campaignId', foreignField: '_id', as: 'campaign' } },
      { $unwind: { path: '$campaign', preserveNullAndEmptyArrays: true } },
      { $group: { _id: { $ifNull: ['$campaign.category', 'general'] }, total: { $sum: '$amount' } } }
    ])

    const salesByCategory = salesByCategoryRaw.map(r => ({
      name: String(r._id).replace('-', ' ').toUpperCase(),
      value: r.total
    }))

    return res.json({
      overview: {
        totalRaised,
        donationCount,
        campaigns: countCamp,
        events: countEvents,
        blogPosts: countPosts,
      },
      salesByMonth: salesSeries,
      salesByCategory,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load stats' })
  }
})

router.get('/donations', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 200, 500)
    const list = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'email name')
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
        donor: d.userId
          ? { email: d.userId.email, name: d.userId.name }
          : null,
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

router.get('/reports/sales.csv', async (_req, res) => {
  try {
    const rows = await Donation.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .populate('userId', 'email name')
      .populate('campaignId', 'title')
      .lean()

    const header = [
      'invoiceId',
      'createdAt',
      'amount',
      'currency',
      'frequency',
      'paymentMethod',
      'donorEmail',
      'donorName',
      'campaign',
    ]
    const lines = [header.join(',')]
    for (const d of rows) {
      const line = [
        d.invoiceId,
        new Date(d.createdAt).toISOString(),
        d.amount,
        d.currency,
        d.frequency,
        d.paymentMethod,
        csvEscape(d.userId?.email),
        csvEscape(d.userId?.name),
        csvEscape(d.campaignId?.title),
      ].join(',')
      lines.push(line)
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="donation-report.csv"')
    return res.send(lines.join('\n'))
  } catch (err) {
    console.error(err)
    return res.status(500).send('Could not generate report')
  }
})

function csvEscape(val) {
  const s = val == null ? '' : String(val)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

/** Campaigns */
router.get('/campaigns', async (_req, res) => {
  try {
    const list = await Campaign.find().sort({ updatedAt: -1 }).lean()
    return res.json({
      campaigns: list.map((c) => ({
        id: String(c._id),
        title: c.title,
        slug: c.slug,
        summary: c.summary,
        description: c.description,
        goalAmount: c.goalAmount,
        coverImageUrl: c.coverImageUrl,
        imageUrls: c.imageUrls || [],
        category: c.category || 'general',
        isActive: c.isActive,
        startDate: c.startDate,
        endDate: c.endDate,
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load campaigns' })
  }
})

router.post('/campaigns', async (req, res) => {
  try {
    const title = String(req.body.title || '').trim()
    if (!title) return res.status(400).json({ message: 'Title is required' })
    let slug = String(req.body.slug || '').trim().toLowerCase() || slugify(title)
    const existing = await Campaign.findOne({ slug })
    if (existing) slug = `${slug}-${Date.now().toString(36)}`

    const c = await Campaign.create({
      title,
      slug,
      summary: String(req.body.summary || '').trim(),
      description: String(req.body.description || '').trim(),
      goalAmount: Number(req.body.goalAmount) || 0,
      coverImageUrl: String(req.body.coverImageUrl || '').trim(),
      imageUrls: Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [],
      category: String(req.body.category || 'general').trim(),
      isActive: req.body.isActive !== false,
      startDate: req.body.startDate ? new Date(req.body.startDate) : null,
      endDate: req.body.endDate ? new Date(req.body.endDate) : null,
    })
    return res.status(201).json({ campaign: { id: String(c._id), ...c.toObject() } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not create campaign' })
  }
})

router.patch('/campaigns/:id', async (req, res) => {
  try {
    const c = await Campaign.findById(req.params.id)
    if (!c) return res.status(404).json({ message: 'Not found' })
    const fields = [
      'title',
      'summary',
      'description',
      'goalAmount',
      'coverImageUrl',
      'category',
      'isActive',
      'startDate',
      'endDate',
    ]
    for (const k of fields) {
      if (k === 'isActive' && req.body.isActive !== undefined) {
        c.isActive = Boolean(req.body.isActive)
      } else if (k === 'goalAmount' && req.body.goalAmount !== undefined) {
        c.goalAmount = Number(req.body.goalAmount) || 0
      } else if (req.body[k] !== undefined && k !== 'isActive' && k !== 'goalAmount') {
        if ((k === 'startDate' || k === 'endDate') && req.body[k]) {
          c[k] = new Date(req.body[k])
        } else if (k === 'imageUrls' && Array.isArray(req.body[k])) {
          c[k] = req.body[k]
        } else if (typeof req.body[k] === 'string') {
          c[k] = req.body[k].trim()
        }
      }
    }
    if (req.body.slug) {
      c.slug = String(req.body.slug).trim().toLowerCase()
    }
    await c.save()
    return res.json({ campaign: { id: String(c._id), ...c.toObject() } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not update campaign' })
  }
})

router.delete('/campaigns/:id', async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id)
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not delete' })
  }
})

/** Events */
router.get('/events', async (_req, res) => {
  try {
    const list = await Event.find().sort({ startsAt: -1 }).lean()
    return res.json({
      events: list.map((e) => ({
        id: String(e._id),
        title: e.title,
        description: e.description,
        venue: e.venue,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        coverImageUrl: e.coverImageUrl,
        imageUrls: e.imageUrls || [],
        published: e.published,
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load events' })
  }
})

router.post('/events', async (req, res) => {
  try {
    const title = String(req.body.title || '').trim()
    if (!title) return res.status(400).json({ message: 'Title is required' })
    const startsAt = req.body.startsAt ? new Date(req.body.startsAt) : null
    if (!startsAt || Number.isNaN(+startsAt)) {
      return res.status(400).json({ message: 'Start date is required' })
    }
    const e = await Event.create({
      title,
      description: String(req.body.description || '').trim(),
      venue: String(req.body.venue || '').trim(),
      startsAt,
      endsAt: req.body.endsAt ? new Date(req.body.endsAt) : null,
      coverImageUrl: String(req.body.coverImageUrl || '').trim(),
      imageUrls: Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [],
      published: req.body.published !== false,
    })
    return res.status(201).json({ event: { id: String(e._id), ...e.toObject() } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not create event' })
  }
})

router.patch('/events/:id', async (req, res) => {
  try {
    const e = await Event.findById(req.params.id)
    if (!e) return res.status(404).json({ message: 'Not found' })
    if (req.body.title !== undefined) e.title = String(req.body.title).trim()
    if (req.body.description !== undefined) e.description = String(req.body.description).trim()
    if (req.body.venue !== undefined) e.venue = String(req.body.venue).trim()
    if (req.body.startsAt) e.startsAt = new Date(req.body.startsAt)
    if (req.body.endsAt !== undefined) {
      e.endsAt = req.body.endsAt ? new Date(req.body.endsAt) : null
    }
    if (req.body.coverImageUrl !== undefined) e.coverImageUrl = String(req.body.coverImageUrl).trim()
    if (req.body.imageUrls !== undefined && Array.isArray(req.body.imageUrls)) e.imageUrls = req.body.imageUrls
    if (req.body.published !== undefined) e.published = Boolean(req.body.published)
    await e.save()
    return res.json({ event: { id: String(e._id), ...e.toObject() } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not update event' })
  }
})

router.delete('/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not delete' })
  }
})

/** Blogs */
router.get('/blogs', async (_req, res) => {
  try {
    const list = await BlogPost.find().sort({ publishedAt: -1 }).lean()
    return res.json({
      posts: list.map((p) => ({
        id: String(p._id),
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        authorName: p.authorName,
        coverImageUrl: p.coverImageUrl,
        imageUrls: p.imageUrls || [],
        published: p.published,
        publishedAt: p.publishedAt,
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load posts' })
  }
})

router.post('/blogs', async (req, res) => {
  try {
    const title = String(req.body.title || '').trim()
    if (!title) return res.status(400).json({ message: 'Title is required' })
    let slug = String(req.body.slug || '').trim().toLowerCase() || slugify(title)
    if (await BlogPost.findOne({ slug })) slug = `${slug}-${Date.now().toString(36)}`

    const p = await BlogPost.create({
      title,
      slug,
      excerpt: String(req.body.excerpt || '').trim(),
      content: String(req.body.content || '').trim(),
      authorName: String(req.body.authorName || '').trim() || 'NGO Editorial',
      coverImageUrl: String(req.body.coverImageUrl || '').trim(),
      imageUrls: Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [],
      published: req.body.published !== false,
      publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
    })
    return res.status(201).json({ post: { id: String(p._id), ...p.toObject() } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not create post' })
  }
})

router.patch('/blogs/:id', async (req, res) => {
  try {
    const p = await BlogPost.findById(req.params.id)
    if (!p) return res.status(404).json({ message: 'Not found' })
    const str = ['title', 'slug', 'excerpt', 'content', 'authorName', 'coverImageUrl']
    for (const k of str) {
      if (req.body[k] !== undefined) p[k] = String(req.body[k]).trim()
    }
    if (req.body.imageUrls !== undefined && Array.isArray(req.body.imageUrls)) p.imageUrls = req.body.imageUrls
    if (req.body.published !== undefined) p.published = Boolean(req.body.published)
    if (req.body.publishedAt) p.publishedAt = new Date(req.body.publishedAt)
    await p.save()
    return res.json({ post: { id: String(p._id), ...p.toObject() } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not update post' })
  }
})

router.delete('/blogs/:id', async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id)
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not delete' })
  }
})

router.get('/applications', async (_req, res) => {
  try {
    const list = await VolunteerApplication.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .populate('eventId', 'title')
      .lean()
    return res.json({
      applications: list.map((a) => ({
        id: String(a._id),
        name: a.name,
        email: a.email,
        phone: a.phone,
        interest: a.interest,
        message: a.message,
        kind: a.kind,
        event: a.eventId ? { id: String(a.eventId._id), title: a.eventId.title } : null,
        createdAt: a.createdAt,
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load applications' })
  }
})

export default router
