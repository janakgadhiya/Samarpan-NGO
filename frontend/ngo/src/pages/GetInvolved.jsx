import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaUserPlus, FaBriefcase, FaArrowRight } from 'react-icons/fa'

export default function GetInvolved() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-slate-900 pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-amber-900/30 via-transparent to-transparent pointer-events-none"></div>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-amber-300 bg-amber-900/50 rounded-full uppercase tracking-wider border border-amber-700/50">Take Action</span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white tracking-tight mb-8">
            Get Involved.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            Whether you can give time as an intern, join weekend volunteering, or amplify our campaigns, there is a place for you fighting for change.
          </p>
        </motion.div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-[2.5rem] bg-amber-50 border border-amber-100 p-10 lg:p-14 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="mb-8 w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 text-2xl group-hover:scale-110 transition-transform">
              <FaBriefcase />
            </div>
            <h2 className="font-heading text-4xl font-black text-amber-950 mb-4">Internship</h2>
            <p className="text-amber-800/80 text-lg mb-10 font-light leading-relaxed">
              Structured placements with field and program teams for students and early-career professionals looking to make a massive impact footprint.
            </p>
            <Link to="/get-involved/internship" className="inline-flex items-center gap-3 font-bold text-amber-700 uppercase tracking-widest text-sm hover:text-amber-600">
              Apply Now <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="group relative overflow-hidden rounded-[2.5rem] bg-emerald-50 border border-emerald-100 p-10 lg:p-14 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="mb-8 w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 text-2xl group-hover:scale-110 transition-transform">
              <FaUserPlus />
            </div>
            <h2 className="font-heading text-4xl font-black text-emerald-950 mb-4">Volunteer</h2>
            <p className="text-emerald-800/80 text-lg mb-10 font-light leading-relaxed">
              Share your skills—communications, logistics, teaching, health—and we will match you with upcoming needs on the ground.
            </p>
            <Link to="/get-involved/volunteer" className="inline-flex items-center gap-3 font-bold text-emerald-700 uppercase tracking-widest text-sm hover:text-emerald-600">
              Register <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>

        </motion.div>
      </section>
    </div>
  )
}
