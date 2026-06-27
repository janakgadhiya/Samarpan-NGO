import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

const areas = [
  {
    to: '/programs/education',
    title: 'Education',
    text: 'Scholarships, learning centers, and teacher support in underserved regions.',
    img: '/3-1.jpg',
    color: 'from-blue-900/90 to-blue-900/40'
  },
  {
    to: '/programs/healthcare',
    title: 'Healthcare',
    text: 'Mobile clinics, maternal health, and prevention campaigns with local hospitals.',
    img: '/4-1.jpg',
    color: 'from-rose-900/90 to-rose-900/40'
  },
  {
    to: '/programs/womens-safety',
    title: "Women's Empowerment",
    text: 'Safe transit programs, legal aid referrals, and community awareness drives.',
    img: '/7-1.jpg',
    color: 'from-emerald-900/90 to-emerald-900/40'
  },
  {
    to: '/programs/disaster-management',
    title: 'Disaster Management',
    text: 'Preparedness training, rapid relief, and resilient shelter solutions.',
    img: '/8-1.jpg',
    color: 'from-amber-900/90 to-amber-900/40'
  },
]

export default function Programs() {
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent pointer-events-none"></div>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-emerald-300 bg-emerald-900/50 rounded-full uppercase tracking-wider border border-emerald-700/50">Initiatives</span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white tracking-tight mb-8">
            Programs & Area of Work
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            Each program is co-designed with community partners to ensure maximum impact and long-term sustainability.
          </p>
        </motion.div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-slate-50">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {areas.map((a, i) => (
              <motion.div variants={fadeUp} key={a.to}>
                <Link
                  to={a.to}
                  className="group relative block h-[400px] overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <img src={a.img} alt={a.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${a.color} transition-opacity duration-500`}></div>

                  <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                    <h2 className="font-heading text-3xl lg:text-4xl font-black mb-4 tracking-tight drop-shadow-md">{a.title}</h2>
                    <p className="text-white/90 text-lg font-light leading-relaxed mb-6 max-w-md drop-shadow-sm">{a.text}</p>
                    <div className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-emerald-300 group-hover:text-emerald-200 transition-colors">
                      Learn More <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
