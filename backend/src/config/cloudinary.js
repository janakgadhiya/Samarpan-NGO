import { v2 as cloudinary } from 'cloudinary'

export function connectCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    })
    console.log('[boot] Cloudinary configured')
  } else {
    console.log('[boot] Cloudinary credentials missing, uploads might fail if attempted.')
  }
}

export default cloudinary
