import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaEnvelope } from 'react-icons/fa'
import { api } from '../api/client.js'

export default function Media() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeGallery, setActiveGallery] = useState(null)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const scrollRef = useRef(null)

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      try {
        const [cRes, eRes] = await Promise.all([
          api('/api/campaigns'),
          api('/api/events')
        ])
        
        if (cancelled) return

        const builtSlides = []
        
        // Process campaigns
        if (cRes.campaigns) {
          cRes.campaigns.forEach(c => {
            if (c.coverImageUrl) {
              builtSlides.push({
                url: c.coverImageUrl,
                gallery: c.imageUrls || [],
                title: c.title,
                category: c.category || 'Campaign'
              })
            }
          })
        }

        // Process events
        if (eRes.events) {
          eRes.events.forEach(e => {
            if (e.coverImageUrl) {
              builtSlides.push({
                url: e.coverImageUrl,
                gallery: e.imageUrls || [],
                title: e.title,
                category: 'Event'
              })
            }
          })
        }

        setSlides(builtSlides)
      } catch (err) {
        console.error('Failed to load media slides', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full flex flex-col font-sans bg-white pb-24">
      
      {/* Banner */}
      <section className="relative h-[50vh] md:h-[60vh] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-900 to-black z-[0]"></div>
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative z-10 text-center px-6">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-emerald-300 bg-emerald-900/50 rounded-full uppercase tracking-wider border border-emerald-700/50">Gallery & Archives</span>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white tracking-tight mb-6">
            Media Centre.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto">
            Live photography and B-Roll directly from our ongoing events and active campaigns.
          </p>
        </motion.div>
      </section>

      {/* Dynamic Gallery Section */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-200 overflow-hidden">
        <div className="max-w-[1400px] mx-auto w-full">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 text-center">
            <h2 className="font-heading text-4xl font-black text-slate-900">Project Highlights</h2>
            <p className="text-slate-500 mt-4 font-light max-w-xl mx-auto">Scroll to see our community impact and field operations in realtime.</p>
          </motion.div>

          {loading ? (
            <div className="text-center text-slate-400 py-20 font-bold tracking-widest uppercase">Loading feeds...</div>
          ) : slides.length === 0 ? (
            <div className="text-center text-slate-400 py-20 font-bold tracking-widest uppercase">No media uploaded yet.</div>
          ) : (
            <div className="relative group/slider">
              
              <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-4 h-[500px]"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {slides.map((slide, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                        const allImages = [slide.url, ...(slide.gallery || [])]
                        setActiveGallery(allImages)
                        setActiveGalleryIndex(0)
                    }}
                    className="min-w-[85vw] md:min-w-[450px] max-w-[450px] relative rounded-[2rem] overflow-hidden shadow-xl snap-center flex-shrink-0 group cursor-pointer"
                  >
                    <img 
                      src={slide.url} 
                      alt={slide.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-8 text-white transition-opacity duration-500">
                      <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-white bg-emerald-500 rounded-full uppercase tracking-widest w-fit shadow-md">
                        {slide.category}
                      </span>
                      <h3 className="font-heading text-2xl font-black drop-shadow-md">{slide.title}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center gap-4 mt-8">
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

            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX POPUP UI */}
      {activeGallery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 lg:p-10 backdrop-blur-md">
          <button 
            onClick={() => setActiveGallery(null)} 
            className="absolute top-6 right-6 text-white text-4xl cursor-pointer z-50 border-none bg-transparent hover:text-emerald-400 transition-colors"
          >
            &times;
          </button>
          
          {activeGallery.length > 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveGalleryIndex(i => i === 0 ? activeGallery.length - 1 : i - 1) }} 
              className="absolute left-4 lg:left-10 text-white text-3xl font-bold hover:bg-emerald-500 z-50 bg-white/10 w-14 h-14 rounded-full flex items-center justify-center border-none transition-colors backdrop-blur-sm shadow-xl"
            >
              &#8249;
            </button>
          )}

          <motion.div 
            key={activeGalleryIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-h-[85vh] max-w-[90vw] flex items-center justify-center"
          >
            <img 
              src={activeGallery[activeGalleryIndex]} 
              alt="Gallery item"
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl ring-1 ring-white/10" 
            />
          </motion.div>

          {activeGallery.length > 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveGalleryIndex(i => i === activeGallery.length - 1 ? 0 : i + 1) }} 
              className="absolute right-4 lg:right-10 text-white text-3xl font-bold hover:bg-emerald-500 z-50 bg-white/10 w-14 h-14 rounded-full flex items-center justify-center border-none transition-colors backdrop-blur-sm shadow-xl"
            >
              &#8250;
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-bold tracking-widest text-xs bg-black/60 px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg ring-1 ring-white/20">
            IMAGE {activeGalleryIndex + 1} OF {activeGallery.length}
          </div>
        </div>
      )}

      {/* Contact PR Block */}
      <section className="bg-white py-24 px-6 md:px-12">
         <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none"></div>
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-8">
                     <FaEnvelope size={32} />
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl font-black text-white mb-6">Need a Spokesperson?</h2>
                  <p className="text-slate-300 text-lg mb-10 max-w-2xl font-light">
                    For direct media inquiries, verified quotes, or scheduling an interview with our executive team, please reach out to our communications desk.
                  </p>
                  <Link to="/contact" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-10 rounded-[2rem] uppercase tracking-widest transition-all">
                    Contact PR Team
                  </Link>
               </div>
            </div>
         </motion.div>
      </section>

    </div>
  )
}
