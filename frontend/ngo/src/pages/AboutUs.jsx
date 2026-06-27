import { motion } from 'framer-motion'
import { FaEye, FaHandHoldingHeart, FaShieldAlt, FaChartLine } from 'react-icons/fa'

export default function AboutUs() {
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

      {/* HEADER SECTION */}
      <section className="bg-slate-900 pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent pointer-events-none"></div>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-emerald-300 bg-emerald-900/50 rounded-full uppercase tracking-wider border border-emerald-700/50">Our Story</span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white tracking-tight mb-8">
            Empowering the Unreached.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            Samarpan is a nonprofit committed to inclusive development, targeting communities that are geographically or socially isolated from mainstream services.
          </p>
        </motion.div>
      </section>

      {/* TWO COL MISSION SECTION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[400px] md:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl">
            <img src="/5-3.jpg" alt="Child learning" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-heading text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">We build long-term change from the grassroots up.</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed font-light">
              We work alongside local leaders to strengthen schools and learning spaces, expand primary care access, prepare communities for disasters, and advance women's safety and leadership.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed font-light mb-10">
              It isn't just about providing immediate aid—it's about creating self-sustaining change that allows entire generations to rise out of poverty. Every program we implement is specifically tailored to the unique cultural and geographic challenges of the community.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100">
              <div>
                <span className="block font-heading text-4xl font-black text-emerald-600 mb-1">15+</span>
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Years Active</span>
              </div>
              <div>
                <span className="block font-heading text-4xl font-black text-emerald-600 mb-1">20L+</span>
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Lives Touched</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* VALUES BENTO GRID */}
      <section className="bg-slate-50 py-24 px-6 md:px-12 border-t border-slate-200">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-center font-heading text-4xl font-black text-slate-900 mb-16">Our Core Values</motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Transparency", text: "In funding and program delivery. Every rupee accounted for.", icon: FaEye, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Community-Led", text: "Design and accountability placed in the hands of locals.", icon: FaHandHoldingHeart, color: "text-rose-500", bg: "bg-rose-50" },
              { title: "Safeguarding", text: "Ensuring dignity and security for every participant.", icon: FaShieldAlt, color: "text-emerald-500", bg: "bg-emerald-50" },
              { title: "Evidence-Based", text: "Interventions and learning driven by real-world data.", icon: FaChartLine, color: "text-purple-500", bg: "bg-purple-50" }
            ].map((val, i) => (
              <motion.div variants={fadeUp} key={i} className={`p-8 rounded-[2rem] border border-slate-200 ${val.bg} cursor-default transition-all hover:-translate-y-2 hover:shadow-lg bg-white`}>
                <div className={`mb-6 p-4 rounded-2xl w-fit ${val.bg}`}>
                  <val.icon className={`text-3xl ${val.color}`} />
                </div>
                <h3 className="font-heading text-2xl font-black text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">{val.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-16 bg-slate-900 rounded-[2rem] p-10 text-center text-white">
            <p className="text-xl font-light text-slate-300 max-w-2xl mx-auto">
              We publish regular impact summaries and welcome independent review of our field work. If you would like to partner, write to us from the contact page.
            </p>
          </motion.div>
        </motion.div>
      </section>

    </div>
  )
}
