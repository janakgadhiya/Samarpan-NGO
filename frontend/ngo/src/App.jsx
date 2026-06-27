import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FaArrowUp } from 'react-icons/fa'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { AdminRoute } from './components/AdminRoute.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminCampaigns from './admin/AdminCampaigns.jsx'
import AdminEvents from './admin/AdminEvents.jsx'
import AdminBlogs from './admin/AdminBlogs.jsx'
import AdminPayments from './admin/AdminPayments.jsx'
import AdminReports from './admin/AdminReports.jsx'
import AdminApplications from './admin/AdminApplications.jsx'
import Home from './pages/Home.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Programs from './pages/Programs.jsx'
import AreaEducation from './pages/AreaEducation.jsx'
import AreaHealthcare from './pages/AreaHealthcare.jsx'
import AreaDisaster from './pages/AreaDisaster.jsx'
import AreaWomensSafety from './pages/AreaWomensSafety.jsx'
import GetInvolved from './pages/GetInvolved.jsx'
import Internship from './pages/Internship.jsx'
import VolunteerRegister from './pages/VolunteerRegister.jsx'
import Donate from './pages/Donate.jsx'
import DonatePayment from './pages/DonatePayment.jsx'
import CampaignDetail from './pages/CampaignDetail.jsx'
import EventsPage from './pages/EventsPage.jsx'
import NewsBlogs from './pages/NewsBlogs.jsx'
import BlogDetail from './pages/BlogDetail.jsx'
import Media from './pages/Media.jsx'
import ContactUs from './pages/ContactUs.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'

function PublicShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300)
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-8 right-8 z-[90] p-3 rounded-full bg-emerald-600 text-white shadow-[0_4px_14px_rgba(4,120,87,0.4)] transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500 focus:outline-none ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <FaArrowUp size={20} />
    </button>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/education" element={<AreaEducation />} />
          <Route path="/programs/healthcare" element={<AreaHealthcare />} />
          <Route path="/programs/disaster-management" element={<AreaDisaster />} />
          <Route path="/programs/womens-safety" element={<AreaWomensSafety />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/get-involved/internship" element={<Internship />} />
          <Route path="/get-involved/volunteer" element={<VolunteerRegister />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donate/:campaignId/pay" element={<DonatePayment />} />
          <Route path="/campaigns/:slug" element={<CampaignDetail />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/news" element={<NewsBlogs />} />
          <Route path="/news/:slug" element={<BlogDetail />} />
          <Route path="/media" element={<Media />} />
          <Route path="/contact" element={<ContactUs />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ScrollToTopButton />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </AuthProvider>
  )
}
