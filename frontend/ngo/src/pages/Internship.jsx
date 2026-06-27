import { useState } from 'react'
import { api } from '../api/client.js'

export default function Internship() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

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
          kind: 'internship',
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
        <h1 className="mb-3 text-2xl font-semibold text-emerald-950">Internship</h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          Tell us your focus (programs, communications, monitoring, etc.) and availability. Our
          team typically responds within two weeks.
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
            Focus / skills
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
            {busy ? 'Sending…' : 'Submit application'}
          </button>
        </form>
      </div>
    </div>
  )
}
