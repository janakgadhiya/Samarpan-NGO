import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AreaEducation() {
  const slides = [
    '/3-1.jpg',
    '/4-1.jpg',
    '/5-3.jpg',
    '/7-1.jpg',
    '/10-1.jpg',
    '/8-1.jpg',
    '/12.jpg'
  ]
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % slides.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [slides.length])

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
        <AnimatePresence>
          <motion.img
            key={slideIndex}
            src={slides[slideIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover z-0"
            alt="Education Image Slideshow"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-[1]"></div>
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 text-center px-6">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-emerald-300 bg-emerald-900/50 rounded-full uppercase tracking-wider border border-emerald-700/50">Core Initiative 01</span>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6">
            Education is Empowerment.
          </h1>
        </motion.div>
      </section>

      {/* Why Education */}
      <section className="bg-white py-24 px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-black mb-8 text-slate-900">Why Education?</h2>
          <p className="text-lg text-slate-600 font-light leading-relaxed mb-6">
            If we need to address healthcare, poverty, population control, unemployment and human rights, there's no better way to start than providing education to children in need. Education not only empowers children to have a secure future but also helps them grow up as responsible national and global citizens.
          </p>
          <p className="text-lg text-slate-600 font-light leading-relaxed">
            The Right to Education (RTE) Act made education free and compulsory, but even a decade later, the learning curve has not been steady. The socio-economic conditions of parents and lack of proper learning in schools are hindrances which prevent many children from having education.
          </p>
        </motion.div>
      </section>

      {/* What We Do */}
      <section className="bg-slate-50 py-24 px-6 md:px-12 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="font-heading text-4xl font-black mb-8 text-slate-900">What We Do</h2>
            <p className="text-lg text-slate-600 font-light leading-relaxed">
              Samarpan's flagship programme works with the objective of empowering underprivileged children by providing education, nutrition, and wellness support. Aligned to the SDG Goal 4, we work with children (3-18 years) living in difficult circumstances across hard-to-reach areas.
            </p>
          </motion.div>
          
          {/* Work Flow */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4 relative z-10">
             
             {/* Arrows Background Desktop */}
             <div className="hidden md:block absolute top-[50%] left-[10%] right-[10%] h-[2px] bg-emerald-200 -z-10"></div>

            {[
              { icon: 'M12 14l9-5-9-5-9 5 9 5z', title: 'Quality Education' },
              { icon: 'M13 13v8h8v-8h-8zM3 13v8h8v-8H3z', title: 'Bridge Courses' },
              { icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', title: 'Remedial Support' },
              { icon: 'M19 3H5c-1.1 0-2 .9-2 2v14...', title: 'Vocational Focus', viewBox: '0 0 24 24', d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
              { icon: 'M12 3L1 9l4 2.18v6L12 21...', title: 'Scholarship Aid', d: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z' }
            ].map((step, i) => (
              <motion.div variants={fadeUp} key={i} className="flex flex-col items-center max-w-[150px] text-center gap-6 bg-slate-50 p-2">
                <div className="h-28 w-28 rounded-[2rem] border border-emerald-100 bg-white shadow-xl flex items-center justify-center text-emerald-600 transition-transform hover:-translate-y-2">
                   <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d={step.d || step.icon} /></svg>
                </div>
                <p className="text-sm font-bold text-slate-800 uppercase tracking-widest leading-relaxed">
                   {step.title}
                </p>
              </motion.div>
            ))}
            
          </motion.div>
        </div>
      </section>

      {/* Impact 2023-24 */}
      <section className="bg-white py-24 px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-center font-heading text-4xl font-black mb-16 text-slate-900">Impact 2023-24</motion.h2>
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <motion.div variants={fadeUp} className="flex-1 w-full relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="/3-1.jpg" alt="Education Impact" className="absolute inset-0 w-full h-full object-cover" />
            </motion.div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-10">
               {[
                 { num: '160,000+', text: 'children received quality education' },
                 { num: '44,000+', text: 'girls received vocational training support' },
                 { num: '25,000+', text: 'children benefitted through infrastructure support' },
                 { num: '2000+', text: 'girls received scholarship support for higher studies' }
               ].map((stat, i) => (
                  <motion.div variants={fadeUp} key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                    <div className="font-heading text-4xl lg:text-5xl font-black text-emerald-600 mb-4">{stat.num}</div>
                    <p className="text-slate-600 font-light leading-relaxed">{stat.text}</p>
                  </motion.div>
               ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Campaign CTA Banner */}
      <section className="bg-emerald-900 py-20 px-6 relative overflow-hidden mt-12 border-t-[10px] border-emerald-500">
        <div className="absolute inset-0 bg-[url('/3-1.jpg')] bg-cover opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="font-heading text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Support Education. Secure The Future.</h2>
          <p className="text-emerald-100/80 text-lg mb-10 max-w-2xl font-light">Join the "Shiksha Na Ruke" campaign. Your contribution directly ensures that vulnerable learners do not drop out.</p>
          <Link to="/donate?category=education" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-5 px-12 rounded-[2rem] uppercase tracking-widest transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30">
            Donate for Education
          </Link>
          <div className="mt-8 text-emerald-300 text-sm font-medium tracking-widest uppercase">For CSR Support: cp@samarpan.example</div>
        </div>
      </section>

    </div>
  )
}
