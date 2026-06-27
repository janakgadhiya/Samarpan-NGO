import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import ImageUpload from '../components/ImageUpload.jsx'
import MultiImageUpload from '../components/MultiImageUpload.jsx'
import toast from 'react-hot-toast'

export default function AdminEvents() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [venue, setVenue] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [description, setDescription] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [imageUrls, setImageUrls] = useState([])
  const [busy, setBusy] = useState(false)

  async function load() {
    const data = await api('/api/admin/events')
    setItems(data.events || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function onCreate(e) {
    e.preventDefault()
    if (!startsAt) return
    setBusy(true)
    try {
      await api('/api/admin/events', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          startsAt,
          venue,
          coverImageUrl,
          imageUrls,
        }),
      })
      setTitle('')
      setVenue('')
      setStartsAt('')
      setDescription('')
      setCoverImageUrl('')
      setImageUrls([])
      toast.success('Successfully created event!')
      await load()
    } catch (err) {
      toast.error(err.message || 'Error creating event')
    } finally {
      setBusy(false)
    }
  }

  async function togglePublished(ev) {
    try {
      await api(`/api/admin/events/${ev.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ published: !ev.published }),
      })
      toast.success(ev.published ? 'Event unpublished' : 'Event published')
      await load()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  async function remove(ev) {
    if (!window.confirm(`Delete event “${ev.title}”?`)) return
    try {
      await api(`/api/admin/events/${ev.id}`, { method: 'DELETE' })
      toast.success('Event deleted permanently')
      await load()
    } catch (err) {
      toast.error('Failed to delete event')
    }
  }

  return (
    <div className="min-w-0">
      <h1 className="mb-2 text-[1.6rem] font-semibold text-green-900">Event management</h1>

      <form className="mb-5 flex flex-wrap items-end gap-3" onSubmit={onCreate}>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="min-w-[200px] rounded-lg border border-slate-300 px-2 py-2 font-inherit text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Venue
          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="min-w-[200px] rounded-lg border border-slate-300 px-2 py-2 font-inherit text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Starts at (local)
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
            className="min-w-[200px] rounded-lg border border-slate-300 px-2 py-2 font-inherit text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-w-[200px] rounded-lg border border-slate-300 px-2 py-2 font-inherit text-sm"
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
          className="cursor-pointer rounded-lg border-none bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-65"
        >
          Add event
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
                Starts
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
            {items.map((ev) => (
              <tr key={ev.id}>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">{ev.title}</td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {ev.startsAt ? new Date(ev.startsAt).toLocaleString('en-IN') : ''}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {ev.published ? 'Yes' : 'No'}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  <button
                    type="button"
                    className="cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-teal-600 hover:underline"
                    onClick={() => togglePublished(ev)}
                  >
                    {ev.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    className="ml-2 cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-red-700 hover:underline"
                    onClick={() => remove(ev)}
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
