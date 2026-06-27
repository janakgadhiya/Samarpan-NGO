import { useState } from 'react'

export default function MultiImageUpload({ imageUrls = [], onChange, className }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    setError('')
    try {
      const newUrls = []
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('image', file)
        
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        })
        if (!response.ok) throw new Error('Upload failed')
        const data = await response.json()
        newUrls.push(data.url)
      })

      await Promise.all(uploadPromises)
      onChange([...imageUrls, ...newUrls])
    } catch (err) {
      setError(err.message || 'Error uploading file(s)')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (index) => {
    const newUrls = [...imageUrls]
    newUrls.splice(index, 1)
    onChange(newUrls)
  }

  return (
    <div className={`flex flex-col gap-3 ${className || ''}`}>
      {imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="group relative w-16 h-16 overflow-hidden rounded-lg border border-slate-200">
              <img src={url} alt={`Preview ${i}`} className="object-cover w-full h-full" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 bg-red-600/90 text-white rounded-bl-md px-1.5 py-0.5 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex flex-col gap-1">
        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-300 w-fit transition-colors">
          {uploading ? 'Uploading...' : 'Add Gallery Image'}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            multiple
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      </div>
    </div>
  )
}
