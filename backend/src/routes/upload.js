import { Router } from 'express'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ngo_uploads',
    // No format restrictions as requested by the user
    // format: async (req, file) => 'webp', 
  },
})

const upload = multer({ storage })

router.post('/', requireAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' })
    }
    // multer-storage-cloudinary attaches the path property holding the cloudinary secure URL
    return res.json({ url: req.file.path })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Image upload failed' })
  }
})

export default router
