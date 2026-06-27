import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../api/client.js'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [donations, setDonations] = useState([])
  const [err, setErr] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api('/api/donations/me')
        setDonations(data.donations || [])
      } catch (e) {
        setErr(e.message || 'Could not load giving history')
      }
    })()
  }, [])

  return (
    <div className="min-h-[60svh] bg-slate-50 px-5 py-8 pb-16">
      <div className="mx-auto max-w-[640px]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 text-[1.65rem] font-semibold text-emerald-950">
              My dashboard
            </h1>
            <p className="m-0 text-sm text-slate-500">Signed in as {user?.email}</p>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            Sign out
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-white px-5 py-5">
          <h2 className="mb-3 text-base font-semibold text-green-900">Profile</h2>
          <dl className="m-0">
            <dt className="mt-2.5 text-[0.7rem] font-medium uppercase tracking-[0.06em] text-slate-500 first:mt-0">
              Name
            </dt>
            <dd className="m-0 mt-0.5 text-slate-800">{user?.name || '—'}</dd>
            <dt className="mt-2.5 text-[0.7rem] font-medium uppercase tracking-[0.06em] text-slate-500">
              Role
            </dt>
            <dd className="m-0 mt-0.5 text-slate-800">
              {user?.role === 'admin' ? 'Administrator' : 'Supporter'}
            </dd>
          </dl>
          <Link to="/profile" className="mt-3 inline-block text-sm font-semibold text-teal-600 no-underline">
            Update profile →
          </Link>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-white px-5 py-5">
          <h2 className="mb-3 text-base font-semibold text-green-900">Email</h2>
          <p className="m-0 text-sm leading-relaxed text-slate-500">
            OTP-based access: your account is ready to sign in and donate securely.
          </p>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-white px-5 py-5">
          <h2 className="mb-3 text-base font-semibold text-green-900">Donation history</h2>
          {err ? <p className="text-sm text-red-700">{err}</p> : null}

          {!err && donations.length === 0 ? (
            <p className="m-0 text-sm leading-relaxed text-slate-500">
              No donations yet.{' '}
              <Link to="/donate" className="font-semibold text-teal-600">
                Support a campaign →
              </Link>
            </p>
          ) : null}

          {donations.length > 0 ? (
            <ul className="m-0 list-disc pl-[1.1rem] text-sm leading-relaxed text-slate-600">
              {donations.map((d) => (
                <li key={d.id}>
                  <strong>{d.invoiceId}</strong> · ₹{Number(d.amount).toLocaleString('en-IN')} ·{' '}
                  {d.campaign?.title || 'Campaign'} · {d.frequency}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <p className="mt-6">
          <Link to="/" className="font-semibold text-teal-600 no-underline">
            ← Home
          </Link>
        </p>
      </div>
    </div>
  )
}
