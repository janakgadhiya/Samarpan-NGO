import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AuthModal from './AuthModal.jsx'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  
  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  
  const profileRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
  }

  const dropdownItemClass =
    'block px-4 py-2.5 text-[0.85rem] font-medium text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors max-lg:px-6 max-lg:py-2'

  const DropdownIcon = () => (
    <svg className="ml-1 h-3.5 w-3.5 text-gray-400 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )

  const dropdownContainerClass = "absolute left-0 top-full z-[60] min-w-[200px] border border-gray-200 bg-white py-2 shadow-lg opacity-0 pointer-events-none translate-y-2 transition-all duration-150 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 max-lg:static max-lg:min-w-0 max-lg:bg-transparent max-lg:border-none max-lg:shadow-none max-lg:p-0 max-lg:opacity-100 max-lg:pointer-events-auto"
  const navTriggerClass = "flex cursor-default lg:cursor-pointer items-center text-[0.8rem] font-bold uppercase tracking-widest text-[#4a4a4a] transition-colors hover:text-[#5c9927] max-lg:px-2 max-lg:py-3 lg:py-4 lg:px-1"

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white text-gray-800 shadow-sm relative">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-4 px-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold tracking-tight text-gray-900 no-underline py-3"
            aria-label="Home"
          >
            <span
              className="h-9 w-9 rounded-[10px] bg-[radial-gradient(circle_at_20%_20%,#8cc63f,#4ca219)] shadow-[0_3px_10px_rgba(140,198,63,0.3)]"
              aria-hidden
            />
            {/* Added: Samarpan branding */}
            <span className="text-[1.05rem] uppercase">Samarpan</span>
          </Link>

          <button
            type="button"
            className="ml-auto flex flex-col gap-1.5 p-1.5 lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="block h-0.5 w-[22px] rounded-sm bg-gray-600" />
            <span className="block h-0.5 w-[22px] rounded-sm bg-gray-600" />
            <span className="block h-0.5 w-[22px] rounded-sm bg-gray-600" />
          </button>

          <nav
            className={[
              'flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-0',
              'max-lg:w-full max-lg:flex-col max-lg:items-stretch max-lg:gap-0 max-lg:py-2 max-lg:pb-4 lg:flex',
              menuOpen ? 'max-lg:flex' : 'max-lg:hidden',
            ].join(' ')}
          >
            <div className="group relative max-lg:border-t max-lg:border-gray-100">
              <Link to="/about" className={navTriggerClass} onClick={() => setMenuOpen(false)}>
                ABOUT US
              </Link>
            </div>

            <div className="group relative max-lg:border-t max-lg:border-gray-100">
              <span className={navTriggerClass}>
                OUR WORK <DropdownIcon />
              </span>
              <div className={dropdownContainerClass}>
                <Link to="/programs" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Overview</Link>
                <Link to="/programs/education" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Education</Link>
                <Link to="/programs/healthcare" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Healthcare</Link>
                <Link to="/programs/disaster-management" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Disaster management</Link>
                <Link to="/programs/womens-safety" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Women&apos;s safety</Link>
              </div>
            </div>

            <div className="group relative max-lg:border-t max-lg:border-gray-100">
              <span className={navTriggerClass}>
                CAMPAIGNS <DropdownIcon />
              </span>
              <div className={dropdownContainerClass}>
                <Link to="/donate" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Running campaigns</Link>
              </div>
            </div>

            <div className="group relative max-lg:border-t max-lg:border-gray-100">
              <span className={navTriggerClass}>
                GET INVOLVED <DropdownIcon />
              </span>
              <div className={dropdownContainerClass}>
                <Link to="/get-involved" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Overview</Link>
                <Link to="/get-involved/internship" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Internship</Link>
                <Link to="/get-involved/volunteer" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Register as volunteer</Link>
              </div>
            </div>

            <div className="group relative max-lg:border-t max-lg:border-gray-100">
              <span className={navTriggerClass}>
                MEDIA CENTRE <DropdownIcon />
              </span>
              <div className={dropdownContainerClass}>
                <Link to="/media" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Media</Link>
                <Link to="/events" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>Events</Link>
                <Link to="/news" className={dropdownItemClass} onClick={() => setMenuOpen(false)}>News & blogs</Link>
              </div>
            </div>

            <div className="group relative max-lg:border-t max-lg:border-gray-100">
              <Link to="/contact" className={navTriggerClass} onClick={() => setMenuOpen(false)}>
                CONTACT US
              </Link>
            </div>
          </nav>

          <div className="flex items-center gap-2 lg:ml-auto">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors hidden sm:block mr-2 text-lg"
              title="Toggle Theme"
            >
               <span className="hidden dark:block"><FaSun className="text-amber-500" /></span>
               <span className="block dark:hidden"><FaMoon className="text-indigo-500" /></span>
            </button>
            
            {!user ? (
              // Changed: Replaced Link with a button that triggers the modal
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login')
                  setShowAuthModal(true)
                }}
                className="inline-flex cursor-pointer items-center justify-center rounded border border-[#8cc63f] px-5 py-2 text-[0.8rem] font-bold uppercase tracking-wide text-[#8cc63f] no-underline transition-colors hover:bg-[#8cc63f] hover:text-white"
              >
                Log in
              </button>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1 pl-2 pr-1.5 text-gray-800 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    setProfileOpen((v) => !v)
                  }}
                  aria-expanded={profileOpen}
                >
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                      {(user.name || user.email || '?').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span
                    className="mr-0.5 h-0 w-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-gray-500"
                    aria-hidden
                  />
                </button>

                {profileOpen ? (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-[70] min-w-[220px] rounded-lg border border-gray-100 bg-white p-2 text-gray-800 shadow-xl">
                    <div className="mb-1 border-b border-gray-100 px-2.5 pb-2.5 pt-2">
                      <strong className="block text-sm text-gray-900">
                        {user.name || 'Member'}
                      </strong>
                      <span className="break-all text-xs text-gray-500">{user.email}</span>
                    </div>

                    <Link
                      to="/profile"
                      className="block rounded-md px-2.5 py-2 text-sm text-gray-700 no-underline hover:bg-green-50 hover:text-green-700"
                      onClick={() => {
                        setProfileOpen(false)
                        setMenuOpen(false)
                      }}
                    >
                      Update profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block rounded-md px-2.5 py-2 text-sm text-gray-700 no-underline hover:bg-green-50 hover:text-green-700"
                      onClick={() => {
                        setProfileOpen(false)
                        setMenuOpen(false)
                      }}
                    >
                      My dashboard
                    </Link>
                    {isAdmin ? (
                      <Link
                        to="/admin"
                        className="block rounded-md px-2.5 py-2 text-sm text-gray-700 no-underline hover:bg-green-50 hover:text-green-700"
                        onClick={() => {
                          setProfileOpen(false)
                          setMenuOpen(false)
                        }}
                      >
                        Admin panel
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="mt-1 w-full cursor-pointer rounded-md bg-transparent px-2.5 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setProfileOpen(false)
                        logout()
                        navigate('/')
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authModalMode} 
      />
    </>
  )
}
