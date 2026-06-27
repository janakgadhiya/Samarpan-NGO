import { useState } from 'react'
import { getToken } from '../api/client.js'

const BASE = import.meta.env.VITE_API_URL ?? ''

export default function AdminReports() {
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function downloadCsv() {
    setErr('')
    setBusy(true)
    try {
      const token = getToken()
      const res = await fetch(`${BASE}/api/admin/reports/sales.csv`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) {
        throw new Error(res.status === 401 ? 'Sign in again as admin' : 'Download failed')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'donation-report.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setErr(e.message || 'Could not download')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-w-0">
      <h1 className="mb-2 text-[1.6rem] font-semibold text-green-900">Reports</h1>
      <p className="mb-4 max-w-2xl text-sm text-slate-600">
        Export all completed donations as CSV for accounting, reconciliation, or external BI tools.
      </p>
      {err ? <p className="mb-4 text-sm font-medium text-red-700">{err}</p> : null}
      <p>
        <button
          type="button"
          onClick={downloadCsv}
          disabled={busy}
          className="cursor-pointer rounded-lg border-none bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-65"
        >
          {busy ? 'Preparing…' : 'Download sales report (CSV)'}
        </button>
      </p>
    </div>
  )
}
