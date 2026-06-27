import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client.js'

export default function VolunteerRegister() {
  const [searchParams] = useSearchParams()
  const urlEventId = searchParams.get('eventId')
  const urlEventTitle = searchParams.get('eventTitle')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(urlEventId || '')

  useEffect(() => {
    ; (async () => {
      try {
        const res = await api('/api/events')
        const now = new Date()
        const upcoming = (res.events || []).filter(e => new Date(e.startsAt) >= now)
        setEvents(upcoming)

        // If urlEventId is provided but not in upcoming (e.g. past or hidden), we can inject it just to be safe
        if (urlEventId && !upcoming.find(e => e.id === urlEventId)) {
          setEvents([{ id: urlEventId, title: urlEventTitle || 'Selected Event', startsAt: new Date().toISOString() }, ...upcoming])
        }
      } catch (err) {
        console.error('Failed to fetch events', err)
      }
    })()
  }, [urlEventId, urlEventTitle])

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    setStatus('')
    setBusy(true)
    try {
      await api('/api/volunteers/apply', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          phone,
          interest,
          message,
          kind: 'volunteer',
          eventId: selectedEventId || null,
        }),
      })
      setStatus('Thank you — we will contact you soon.')
      setName('')
      setEmail('')
      setPhone('')
      setInterest('')
      setMessage('')
    } catch (ex) {
      setErr(ex.message || 'Could not submit')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-slate-50 px-5 py-10 pb-16">
      <div className="mx-auto max-w-[520px] rounded-2xl border border-slate-200 bg-white p-8 pb-9">
        <h1 className="mb-3 text-2xl font-semibold text-emerald-950">Register as volunteer</h1>

        <p className="mb-6 text-[0.95rem] leading-relaxed text-slate-600">
          Share your availability and interests. You can onboard as a general volunteer or target a specific upcoming event below!
        </p>

        <form onSubmit={onSubmit}>
          {err ? (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-800">{err}</p>
          ) : null}
          {status ? (
            <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
              {status}
            </p>
          ) : null}

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Which Event would you like to Volunteer for? (Optional)
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base bg-white focus:outline-emerald-500"
            >
              <option value="">General Volunteer (No specific event)</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} {ev.startsAt ? `— ${new Date(ev.startsAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Full name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base"
            />
          </label>

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base"
            />
          </label>

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Phone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base"
            />
          </label>

          <label className="mb-4 block text-sm font-semibold text-slate-700">
            Interests
            <input
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base"
            />
          </label>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mt-3 w-full cursor-pointer rounded-[10px] border-none bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-65"
          >
            {busy ? 'Sending…' : 'Submit registration'}
          </button>
        </form>
      </div>
    </div>
  )
}
