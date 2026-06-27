import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AreaHealthcare() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  return (
    <div className="w-full flex flex-col font-sans bg-white pb-24">
      
      {/* Banner */}
      <section className="relative h-[60vh] md:h-[75vh] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <motion.img
          src="/4-1.jpg"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="Healthcare hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-[1]"></div>
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 text-center px-6">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-rose-300 bg-rose-900/50 rounded-full uppercase tracking-wider border border-rose-700/50">Core Initiative 02</span>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6">
            Healthcare For All.
          </h1>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-24 px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-black mb-8 text-slate-900">Reaching the Unreached</h2>
          <p className="text-lg text-slate-600 font-light leading-relaxed mb-6">
            Mobile medical units visit rural catchments with vaccinations, antenatal checks, and non-communicable disease screening. We train community health workers and support referral pathways to district hospitals.
          </p>
          <p className="text-lg text-slate-600 font-light leading-relaxed">
            Hygiene promotion and safe water projects complement clinical services. Donations to our health campaigns expand supplies, emergency vehicles, and outreach schedules.
          </p>
        </motion.div>
      </section>

      {/* Stats/Image Split */}
      <section className="bg-slate-50 py-24 px-6 md:px-12 border-y border-slate-200">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            
            <motion.div variants={fadeUp} className="flex-1 w-full relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="/4-1.jpg" alt="Healthcare Impact" className="absolute inset-0 w-full h-full object-cover" />
            </motion.div>

            <div className="flex-1 space-y-8">
               <motion.h2 variants={fadeUp} className="font-heading text-4xl font-black text-slate-900">Our Healthcare Footprint</motion.h2>
               <motion.p variants={fadeUp} className="text-slate-500 font-light mb-8">Deploying robust, localized primary healthcare straight to the geographic boundaries where modern health infrastructure hasn't reached yet.</motion.p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {[
                   { num: '30L+', text: 'Vaccines delivered' },
                   { num: '150+', text: 'Mobile medical units deployed' },
                   { num: '500+', text: 'Local health workers trained' }
                 ].map((stat, i) => (
                    <motion.div variants={fadeUp} key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className="font-heading text-4xl lg:text-5xl font-black text-rose-500 mb-4">{stat.num}</div>
                      <p className="text-slate-600 font-light leading-relaxed">{stat.text}</p>
                    </motion.div>
                 ))}
               </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Campaign CTA Banner */}
      <section className="bg-rose-900 py-20 px-6 relative overflow-hidden mt-12 border-t-[10px] border-rose-500">
        <div className="absolute inset-0 bg-[url('/4-1.jpg')] bg-cover opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-rose-950 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="font-heading text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Health Cannot Wait.</h2>
          <p className="text-rose-100/80 text-lg mb-10 max-w-2xl font-light">Join our urgent medical mobilization campaign. Ensure localized primary healthcare hits the ground where it's needed most.</p>
          <Link to="/donate?category=healthcare" className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-5 px-12 rounded-[2rem] uppercase tracking-widest transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/30">
            Donate for Healthcare
          </Link>
          <div className="mt-8 text-rose-300 text-sm font-medium tracking-widest uppercase">For CSR Support: cp@samarpan.example</div>
        </div>
      </section>

    </div>
  )
}
