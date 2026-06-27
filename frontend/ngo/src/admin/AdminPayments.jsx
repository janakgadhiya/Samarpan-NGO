import { useEffect, useState } from 'react'
import { api } from '../api/client.js'

export default function AdminPayments() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api('/api/admin/donations')
        setRows(data.donations || [])
      } catch {
        setRows([])
      }
    })()
  }, [])

  return (
    <div className="min-w-0">
      <h1 className="mb-2 text-[1.6rem] font-semibold text-green-900">Payment records</h1>
      <p className="mb-5 text-slate-500">Recent donations logged in the system.</p>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Invoice
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Date
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Donor
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Campaign
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Amount
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Method
              </th>
              <th className="border-b border-slate-100 bg-slate-50 px-3.5 py-2.5 text-left text-xs font-semibold text-slate-600">
                Frequency
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id}>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {d.invoiceId}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {d.createdAt ? new Date(d.createdAt).toLocaleString('en-IN') : ''}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {d.donor?.email || '—'}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {d.campaign?.title || '—'}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  ₹{Number(d.amount).toLocaleString('en-IN')} {d.currency}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {d.paymentMethod}
                </td>
                <td className="border-b border-slate-100 px-3.5 py-2.5 align-top">
                  {d.frequency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
