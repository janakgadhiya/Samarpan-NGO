import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-800 bg-slate-900 text-gray-200">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-7 px-6 py-9 sm:grid-cols-2 lg:grid-cols-[minmax(0,2.2fr)_repeat(3,minmax(0,1.4fr))]">
        <div>
          <h2 className="mb-2.5 text-lg font-bold tracking-tight">Samarpan</h2>
          <p className="mb-1 text-sm text-gray-400">
            Working with communities to ensure every child has access to learning, healthcare, and
            protection.
          </p>
        </div>
        <div>
          <h3 className="mb-2.5 text-xs font-normal uppercase tracking-[0.12em] text-gray-400">
            Organisation
          </h3>
          <ul className="m-0 list-none p-0">
            <li className="mb-1.5">
              <Link to="/about" className="text-sm text-gray-200 no-underline hover:text-emerald-200">
                About us
              </Link>
            </li>
            <li className="mb-1.5">
              <Link to="/programs" className="text-sm text-gray-200 no-underline hover:text-emerald-200">
                Programmes
              </Link>
            </li>
            <li className="mb-1.5">
              <Link to="/events" className="text-sm text-gray-200 no-underline hover:text-emerald-200">
                Events
              </Link>
            </li>
            <li className="mb-1.5">
              <Link to="/news" className="text-sm text-gray-200 no-underline hover:text-emerald-200">
                News &amp; blogs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2.5 text-xs font-normal uppercase tracking-[0.12em] text-gray-400">
            Get involved
          </h3>
          <ul className="m-0 list-none p-0">
            <li className="mb-1.5">
              <Link to="/donate" className="text-sm text-gray-200 no-underline hover:text-emerald-200">
                Donate
              </Link>
            </li>
            <li className="mb-1.5">
              <Link to="/get-involved/volunteer" className="text-sm text-gray-200 no-underline hover:text-emerald-200">
                Volunteer
              </Link>
            </li>
            <li className="mb-1.5">
              <Link to="/get-involved/internship" className="text-sm text-gray-200 no-underline hover:text-emerald-200">
                Internship
              </Link>
            </li>
            <li className="mb-1.5">
              <Link to="/contact" className="text-sm text-gray-200 no-underline hover:text-emerald-200">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2.5 text-xs font-normal uppercase tracking-[0.12em] text-gray-400">
            Contact
          </h3>
          <p className="mb-1 text-sm text-gray-400">
            Email:{' '}
            <a href="mailto:hello@samarpan.example" className="text-gray-200 hover:text-emerald-200">
              hello@samarpan.example
            </a>
          </p>
          <p className="mb-1 text-sm text-gray-400">Phone: +91 95121 16321</p>
          <p className="mb-1 text-sm text-gray-400">Address: Rajkot, Gujarat</p>
        </div>
      </div>
      <div className="border-t border-gray-900 px-6 py-3.5 text-center text-xs text-gray-400">
        <p className="m-0">© {year} Samarpan. All rights reserved.</p>
      </div>
    </footer>
  )
}

