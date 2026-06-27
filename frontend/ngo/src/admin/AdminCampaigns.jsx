import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import ImageUpload from '../components/ImageUpload.jsx'
import MultiImageUpload from '../components/MultiImageUpload.jsx'
import toast from 'react-hot-toast'

export default function AdminCampaigns() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [goalAmount, setGoalAmount] = useState('0')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [imageUrls, setImageUrls] = useState([])
  const [category, setCategory] = useState('general')
  const [busy, setBusy] = useState(false)

  async function load() {
    const data = await api('/api/admin/campaigns')
    setItems(data.campaigns || [])
  }

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function onCreate(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await api('/api/admin/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          title,
          summary,
          goalAmount: Number(goalAmount) || 0,
          coverImageUrl,
          imageUrls,
          category,
        }),
      })
      setTitle('')
      setSummary('')
      setGoalAmount('0')
      setCoverImageUrl('')
      setImageUrls([])
      setCategory('general')
      toast.success(`Successfully created campaign!`)
      await load()
    } catch (err) {
      toast.error(err.message || 'Error creating campaign')
    } finally {
      setBusy(false)
    }
  }

  async function toggleActive(c) {
    try {
      await api(`/api/admin/campaigns/${c.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !c.isActive }),
      })
      toast.success(c.isActive ? 'Campaign deactivated' : 'Campaign activated')
      await load()
    } catch (e) {
      toast.error('Failed to update status')
    }
  }

  async function remove(c) {
    if (!window.confirm(`Delete campaign “${c.title}”?`)) return
    try {
      await api(`/api/admin/campaigns/${c.id}`, { method: 'DELETE' })
      toast.success('Campaign deleted permanently')
      await load()
    } catch (e) {
      toast.error('Failed to delete campaign')
    }
  }

  return (
    <div className="min-w-0">
      <h1 className="mb-2 text-[1.6rem] font-semibold text-green-900">Campaign management</h1>

      <form
        className="mb-5 flex flex-wrap items-end gap-3"
        onSubmit={onCreate}
      >
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
          Summary
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="min-w-[200px] rounded-lg border border-slate-300 px-2 py-2 font-inherit text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Goal (₹)
          <input
            type="number"
            min={0}
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="min-w-[200px] rounded-lg border border-slate-300 px-2 py-2 font-inherit text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-w-[150px] rounded-lg border border-slate-300 px-2 py-2 font-inherit text-sm"
          >
            <option value="general">General</option>
            <option value="education">Education</option>
            <option value="disaster">Disaster</option>
            <option value="healthcare">Healthcare</option>
            <option value="womens-safety">Women's Safety</option>
          </select>
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
          Add campaign
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
                Category
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Goal
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Active
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">{c.title}</td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top capitalize">
                  {c.category?.replace('-', ' ')}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  ₹{Number(c.goalAmount || 0).toLocaleString('en-IN')}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {c.isActive ? 'Yes' : 'No'}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  <button
                    type="button"
                    className="cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-teal-600 hover:underline"
                    onClick={() => toggleActive(c)}
                  >
                    {c.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    className="ml-2 cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-red-700 hover:underline"
                    onClick={() => remove(c)}
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
