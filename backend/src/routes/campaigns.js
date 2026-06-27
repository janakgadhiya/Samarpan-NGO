import { Router } from 'express'
import { Campaign } from '../models/Campaign.js'
import { Donation } from '../models/Donation.js'

const router = Router()
router.get('/', async (_req, res) => {
  try {
    const list = await Campaign.find({ isActive: true }).sort({ updatedAt: -1 }).lean()
    const ids = list.map((c) => c._id)
    const sums = await Donation.aggregate([
      { $match: { campaignId: { $in: ids }, status: 'completed' } },
      { $group: { _id: '$campaignId', raised: { $sum: '$amount' } } },
    ])
    const byId = new Map(sums.map((s) => [String(s._id), s.raised]))
    return res.json({
      campaigns: list.map((c) => ({
        id: String(c._id),
        title: c.title,
        slug: c.slug,
        summary: c.summary,
        goalAmount: c.goalAmount,
        raisedAmount: byId.get(String(c._id)) || 0,
        coverImageUrl: c.coverImageUrl,
        imageUrls: c.imageUrls || [],
        category: c.category || 'general',
        startDate: c.startDate,
        endDate: c.endDate,
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load campaigns' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const c = await Campaign.findById(req.params.id).lean()
    if (!c || !c.isActive) {
      return res.status(404).json({ message: 'Campaign not found' })
    }
    const raised = await Donation.aggregate([
      { $match: { campaignId: c._id, status: 'completed' } },
      { $group: { _id: null, raised: { $sum: '$amount' } } },
    ])
    const raisedAmount = raised[0]?.raised || 0
    return res.json({
      campaign: {
        id: String(c._id),
        title: c.title,
        slug: c.slug,
        summary: c.summary,
        description: c.description,
        goalAmount: c.goalAmount,
        raisedAmount,
        coverImageUrl: c.coverImageUrl,
        imageUrls: c.imageUrls || [],
        category: c.category || 'general',
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load campaign' })
  }
})

export default router
