import { Router } from 'express'
import { Event } from '../models/Event.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const events = await Event.find({ published: true })
      .sort({ startsAt: 1 })
      .lean()
    return res.json({
      events: events.map((e) => ({
        id: String(e._id),
        title: e.title,
        description: e.description,
        venue: e.venue,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        coverImageUrl: e.coverImageUrl,
        imageUrls: e.imageUrls || [],
      })),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load events' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const e = await Event.findOne({ _id: req.params.id, published: true }).lean()
    if (!e) return res.status(404).json({ message: 'Event not found' })
    return res.json({
      event: {
        id: String(e._id),
        title: e.title,
        description: e.description,
        venue: e.venue,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        coverImageUrl: e.coverImageUrl,
        imageUrls: e.imageUrls || [],
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Could not load event' })
  }
})

export default router
