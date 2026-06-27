import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { api } from '../api/client.js'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    ; (async () => {
      try {
        const res = await api('/api/admin/stats')
        setData(res)
      } catch (e) {
        setErr(e.message || 'Could not load dashboard')
      }
    })()
  }, [])

  if (err) {
    return <p className="text-red-700">{err}</p>
  }

  if (!data) {
    return <p className="text-slate-500">Loading dashboard…</p>
  }

  const { overview, salesByMonth, salesByCategory } = data
  const chartData = (salesByMonth || []).map((r) => ({
    name: r.label,
    amount: r.total,
  }))

  return (
    <div className="min-w-0">
      <h1 className="mb-1 text-[1.6rem] font-semibold text-green-900">Dashboard</h1>
      <p className="mb-6 text-slate-500">Overview of fundraising and content footprint.</p>

      <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
        <div className="rounded-xl border border-emerald-200 bg-white px-4 py-4">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-emerald-700">
            Total raised
          </span>
          <strong className="text-xl font-semibold text-green-900">
            ₹{Number(overview.totalRaised || 0).toLocaleString('en-IN')}
          </strong>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white px-4 py-4">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-emerald-700">
            Donations
          </span>
          <strong className="text-xl font-semibold text-green-900">
            {overview.donationCount}
          </strong>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white px-4 py-4">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-emerald-700">
            Campaigns
          </span>
          <strong className="text-xl font-semibold text-green-900">{overview.campaigns}</strong>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white px-4 py-4">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-emerald-700">
            Events
          </span>
          <strong className="text-xl font-semibold text-green-900">{overview.events}</strong>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white px-4 py-4">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-emerald-700">
            Blog posts
          </span>
          <strong className="text-xl font-semibold text-green-900">{overview.blogPosts}</strong>
        </div>
      </div>

      <section>
        <h2 className="mb-1 text-lg font-semibold text-green-800">Sales by month</h2>
        <p className="text-slate-500">Completed donation amounts aggregated by calendar month.</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-800">Monthly Performance</h3>
            {chartData.length === 0 ? (
              <p className="text-slate-500">No donations yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Raised']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="amount" fill="#059669" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-800">Revenue by Category</h3>
            {!salesByCategory || salesByCategory.length === 0 ? (
               <p className="text-slate-500">No data available yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {salesByCategory.map((entry, index) => {
                      const colors = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1']
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    })}
                  </Pie>
                  <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
