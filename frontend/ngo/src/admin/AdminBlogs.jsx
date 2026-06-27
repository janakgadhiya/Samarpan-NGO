import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import ImageUpload from '../components/ImageUpload.jsx'
import MultiImageUpload from '../components/MultiImageUpload.jsx'
import toast from 'react-hot-toast'

export default function AdminBlogs() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [imageUrls, setImageUrls] = useState([])
  const [busy, setBusy] = useState(false)

  async function load() {
    const data = await api('/api/admin/blogs')
    setItems(data.posts || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function onCreate(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await api('/api/admin/blogs', {
        method: 'POST',
        body: JSON.stringify({ title, excerpt, content, coverImageUrl, imageUrls }),
      })
      setTitle('')
      setExcerpt('')
      setContent('')
      setCoverImageUrl('')
      setImageUrls([])
      toast.success('Successfully published blog post!')
      await load()
    } catch (err) {
      toast.error(err.message || 'Error publishing blog post')
    } finally {
      setBusy(false)
    }
  }

  async function togglePublished(p) {
    try {
      await api(`/api/admin/blogs/${p.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ published: !p.published }),
      })
      toast.success(p.published ? 'Blog unpublished' : 'Blog published')
      await load()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  async function remove(p) {
    if (!window.confirm(`Delete post “${p.title}”?`)) return
    try {
      await api(`/api/admin/blogs/${p.id}`, { method: 'DELETE' })
      toast.success('Blog deleted permanently')
      await load()
    } catch (err) {
      toast.error('Failed to delete blog post')
    }
  }

  return (
    <div className="min-w-0">
      <h1 className="mb-2 text-[1.6rem] font-semibold text-green-900">Blog management</h1>

      <form className="mb-5 flex max-w-2xl flex-col gap-3" onSubmit={onCreate}>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-lg border border-slate-300 px-2 py-2 font-inherit text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Excerpt
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-2 font-inherit text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Content
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-y rounded-lg border border-slate-300 px-2 py-2 font-inherit text-sm"
          />
        </label>
        
        <div className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Cover Image
          <ImageUpload 
            currentImageUrl={coverImageUrl} 
            onUploadComplete={(url) => setCoverImageUrl(url)} 
          />
        </div>

        <div className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Additional Gallery Images
          <MultiImageUpload 
            imageUrls={imageUrls} 
            onChange={setImageUrls} 
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-fit cursor-pointer rounded-lg border-none bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-65"
        >
          Publish post
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Title
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Slug
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Published
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">{p.title}</td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">{p.slug}</td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {p.published ? 'Yes' : 'No'}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  <button
                    type="button"
                    className="cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-teal-600 hover:underline"
                    onClick={() => togglePublished(p)}
                  >
                    {p.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    className="ml-2 cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-red-700 hover:underline"
                    onClick={() => remove(p)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
