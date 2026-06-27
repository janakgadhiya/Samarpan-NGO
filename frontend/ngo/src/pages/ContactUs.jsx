import { motion } from 'framer-motion'

export default function ContactUs() {
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none"></div>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-blue-300 bg-blue-900/50 rounded-full uppercase tracking-wider border border-blue-700/50">Reach Out</span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white tracking-tight mb-8">
            Contact Us.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            For partnerships, queries, or support—our team is here to assist you in making a real difference.
          </p>
        </motion.div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Side: Contact Info */}
          <motion.div variants={fadeUp} className="flex-1 space-y-12">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h3 className="font-heading text-xl font-black uppercase tracking-widest text-slate-900 mb-6">Partnerships</h3>
              <p className="font-bold text-slate-700">Parul Sharma</p>
              <p className="text-slate-500 mb-2">+91 95121 16321</p>
              <a href="mailto:cp@samarpan.example" className="text-emerald-600 font-semibold hover:text-emerald-500 transition-colors">cp@samarpan.example</a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="font-heading text-sm font-black uppercase tracking-widest text-slate-900 mb-4">New Donors</h4>
                <p className="font-bold text-slate-700">Aakanksha Wahi</p>
                <p className="text-slate-500 mb-2">+91 95121 16321</p>
                <a href="mailto:donation@samarpan.example" className="text-emerald-600 hover:underline">donation@samarpan.example</a>
              </div>

              <div>
                <h4 className="font-heading text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Existing Donors</h4>
                <p className="font-bold text-slate-700">Parul Kapoor</p>
                <p className="text-slate-500 mb-2">+91 95121 16321</p>
                <a href="mailto:donorcare@samarpan.example" className="text-emerald-600 hover:underline">donorcare@samarpan.example</a>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h3 className="font-heading text-sm font-black uppercase tracking-widest text-slate-900 mb-4">General Queries</h3>
              <a href="mailto:info@samarpan.example" className="text-xl font-light text-slate-600 hover:text-emerald-600 transition-colors block mb-4">info@samarpan.example</a>
              <h3 className="font-heading text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Headquarters</h3>
              <p className="text-lg text-slate-600">Rajkot, Gujarat, India</p>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div variants={fadeUp} className="flex-[1.2] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
            <h2 className="font-heading text-3xl font-black text-slate-900 mb-2">Send a Message</h2>
            <p className="mb-10 text-slate-500 font-light">For any grievance, suggestions, or queries, kindly write to us below.</p>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-bold text-slate-700">Name <span className="text-rose-500">*</span></label>
                <input type="text" placeholder="John Doe" className="px-5 py-4 w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" required />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col flex-1">
                  <label className="mb-2 text-sm font-bold text-slate-700">Phone <span className="text-rose-500">*</span></label>
                  <input type="tel" placeholder="+91 95121 16321" className="px-5 py-4 w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" required />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="mb-2 text-sm font-bold text-slate-700">Email <span className="text-rose-500">*</span></label>
                  <input type="email" placeholder="john@example.com" className="px-5 py-4 w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" required />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-sm font-bold text-slate-700">Message <span className="text-rose-500">*</span></label>
                <textarea placeholder="How can we help?" rows="5" className="px-5 py-4 w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none" required></textarea>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl w-fit">
                <input type="checkbox" id="robot" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" required />
                <label htmlFor="robot" className="text-sm font-medium text-slate-600 cursor-pointer select-none pr-4">I'm not a robot</label>
                <div className="pl-4 border-l border-slate-200 flex flex-col items-center">
                  <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="w-6 h-6 object-contain" alt="reCAPTCHA" />
                  <span className="text-[10px] text-slate-400 mt-1">reCAPTCHA</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold uppercase tracking-widest hover:bg-emerald-600 hover:shadow-lg transition-all mt-4">
                Send Message
              </button>
            </form>
          </motion.div>

        </motion.div>
      </section>
    </div>
  )
}
