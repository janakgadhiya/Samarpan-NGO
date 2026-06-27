import { useState } from 'react'

export default function ImageUpload({ onUploadComplete, currentImageUrl, className }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)

      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onUploadComplete(data.url)
    } catch (err) {
      setError(err.message || 'Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {currentImageUrl && (
        <div className="relative w-24 h-24 overflow-hidden rounded-xl border border-slate-200">
          <img src={currentImageUrl} alt="Uploaded preview" className="object-cover w-full h-full" />
        </div>
      )}
      
      <div className="flex flex-col gap-1">
        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-300 w-fit transition-colors">
          {uploading ? 'Uploading...' : currentImageUrl ? 'Change Image' : 'Upload Image'}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      </div>
    </div>
  )
}
