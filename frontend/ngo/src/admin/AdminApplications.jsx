import { useEffect, useState } from 'react'
import { api } from '../api/client.js'

export default function AdminApplications() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api('/api/admin/applications')
        setRows(data.applications || [])
      } catch {
        setRows([])
      }
    })()
  }, [])

  return (
    <div className="min-w-0">
      <h1 className="mb-2 text-[1.6rem] font-semibold text-green-900">
        Volunteer &amp; internship applications
      </h1>
      <p className="mb-5 text-sm text-slate-600">
        Submissions from public registration forms.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Date
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Kind
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Name
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Email
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Phone
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Interest
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Target Event
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {a.createdAt ? new Date(a.createdAt).toLocaleString('en-IN') : ''}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">{a.kind}</td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">{a.name}</td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">{a.email}</td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">{a.phone || '—'}</td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {a.interest || a.message || '—'}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top font-medium text-emerald-700">
                  {a.event?.title || 'General / None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
