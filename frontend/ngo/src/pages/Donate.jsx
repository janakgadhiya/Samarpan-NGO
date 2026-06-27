import { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { api } from '../api/client.js'

export default function Donate() {
  const [searchParams] = useSearchParams()
  const targetCategory = searchParams.get('category')
  
  const [campaigns, setCampaigns] = useState([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await api('/api/campaigns')
        if (!cancelled) {
           let loaded = data.campaigns || []
           if (targetCategory) {
             loaded = loaded.filter(c => c.category === targetCategory)
           }
           setCampaigns(loaded)
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Could not load campaigns')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [targetCategory])

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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent pointer-events-none"></div>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-emerald-300 bg-emerald-900/50 rounded-full uppercase tracking-wider border border-emerald-700/50">Support A Cause</span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white tracking-tight mb-8">
            {targetCategory ? `Support ${targetCategory.replace('-', ' ')}.` : 'Donate Now.'}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            {targetCategory ? 'Choose a targeted campaign below. You will be asked to log in before completing your donation.' : 'Choose a campaign below. You will be asked to log in before completing payment so we can securely send your receipt.'}
          </p>
        </motion.div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          
          {loading ? (
            <div className="flex justify-center items-center py-20 animate-pulse">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : null}
          
          {err ? (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-2xl p-6 mb-8 text-center max-w-lg mx-auto">
              <p className="font-bold">{err}</p>
            </div>
          ) : null}

          {!loading && !err && (
            <div className="relative group/slider">
              
              <motion.div 
                ref={scrollRef}
                initial="hidden" 
                animate="visible" 
                variants={stagger} 
                className="flex gap-8 overflow-x-auto snap-x snap-mandatory py-4 px-4 h-auto"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {campaigns.map((c) => (
                  <motion.article
                    variants={fadeUp}
                    key={c.id}
                    className="flex flex-col min-w-[85vw] md:min-w-[400px] max-w-[400px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 snap-center flex-shrink-0"
                  >
                    <div
                      className="h-[200px] w-full bg-slate-100 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${c.coverImageUrl || '/Banner3-1.jpg.webp'})` }}
                      role="presentation"
                    >
                       <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    <div className="flex flex-1 flex-col p-8 bg-white">
                      <h2 className="font-heading mb-3 text-2xl font-black text-slate-900">{c.title}</h2>
                      <p className="mb-6 flex-1 text-slate-600 font-light leading-relaxed">
                        {c.summary || 'Support our field teams and beneficiaries directly.'}
                      </p>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8">
                        {c.goalAmount > 0 ? (
                          <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${Math.min(100, ((c.raisedAmount || 0) / c.goalAmount) * 100)}%` }}
                            />
                          </div>
                        ) : null}
                        <p className="text-sm text-slate-600 font-bold flex justify-between items-center">
                          <span className="text-emerald-700">₹{(c.raisedAmount || 0).toLocaleString('en-IN')} Raised</span>
                          {c.goalAmount > 0 ? <span className="text-slate-400 font-normal text-xs uppercase tracking-wider">Goal: ₹{c.goalAmount.toLocaleString('en-IN')}</span> : ''}
                        </p>
                      </div>

                      <Link
                        to={`/donate/${c.id}/pay`}
                        className="w-full text-center rounded-xl bg-slate-900 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-emerald-600 hover:shadow-lg"
                      >
                        Make a Donation
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              {campaigns.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-8 hidden md:flex">
                  <button 
                    onClick={() => scroll('left')}
                    className="w-14 h-14 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm z-10"
                  >
                    <FaChevronLeft size={18} className="-ml-1" />
                  </button>
                  <button 
                    onClick={() => scroll('right')}
                    className="w-14 h-14 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm z-10"
                  >
                    <FaChevronRight size={18} className="-mr-1" />
                  </button>
                </div>
              )}

            </div>
          )}

          {!loading && campaigns.length === 0 && !err ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-[2rem] max-w-2xl mx-auto">
               <span className="text-4xl text-slate-300 block mb-4">🙏</span>
               <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">No active campaigns right now.</h3>
               <p className="text-slate-500 font-light">Please check back soon for targeted initiatives.</p>
            </div>
          ) : null}

        </div>
      </section>
    </div>
  )
}
