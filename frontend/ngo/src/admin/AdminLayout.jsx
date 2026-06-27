import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/campaigns', label: 'Campaigns' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/blogs', label: 'Blogs' },
  { to: '/admin/payments', label: 'Payment records' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/applications', label: 'Volunteer & internship' },
]

export default function AdminLayout() {
  const navClass = ({ isActive }) =>
    isActive
      ? 'bg-white/10 text-white'
      : 'text-emerald-50/90 hover:bg-white/10 hover:text-white'

  return (
    <div className="min-h-svh grid grid-cols-[240px_1fr] bg-emerald-50 max-md:grid-cols-1">
      <aside className="flex flex-col bg-emerald-900 text-emerald-50 max-md:flex-row max-md:flex-wrap max-md:items-center max-md:gap-2 max-md:px-4">
        <div className="px-5 pt-6 pb-4 text-xl font-extrabold tracking-tight max-md:pt-4">
          Admin
        </div>

        <nav className="flex flex-col gap-1 px-3 pb-4 max-md:flex-row max-md:flex-wrap max-md:pb-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={navClass}
            >
              <span className="block rounded-lg px-4 py-2 text-sm font-medium max-md:px-3">
                {l.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/"
          className="mt-auto px-5 pb-6 text-sm font-semibold text-emerald-200 hover:text-white max-md:mt-0 max-md:pb-4"
        >
          ← Public site
        </NavLink>
      </aside>

      <main className="min-w-0 overflow-x-auto p-7 pb-10">
        <Outlet />
      </main>
    </div>
  )
}
