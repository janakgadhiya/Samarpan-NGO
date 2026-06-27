import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useMemo, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaHeart, FaCalendarAlt, FaMapMarkerAlt, FaImages, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { api } from '../api/client.js'

function InfiniteMarquee() {
  return (
    <div className="relative flex w-full overflow-hidden bg-slate-950 py-4 text-emerald-300">
      <div className="flex animate-marquee whitespace-nowrap items-center font-heading text-lg font-bold tracking-widest uppercase">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="flex items-center mx-4">
            <span className="mx-8">&bull;</span> EDUCATION FOR ALL
            <span className="mx-8">&bull;</span> HEALTHCARE ACCESS 
            <span className="mx-8">&bull;</span> WOMEN EMPOWERMENT
            <span className="mx-8">&bull;</span> SUSTAINABLE LIVELIHOODS
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [campaigns, setCampaigns] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const [cRes, eRes] = await Promise.all([
          api('/api/campaigns'),
          api('/api/events')
        ])
        setCampaigns((cRes.campaigns || []).slice(0, 3)) // top 3 newest
        
        const now = new Date()
        const upcoming = (eRes.events || [])
          .filter(e => new Date(e.startsAt) >= now)
          .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))
          .slice(0, 3) 
        setEvents(upcoming)
      } catch (err) {
        console.error('Failed to load highlights', err)
      }
    })()
  }, [])
  const heroSlides = useMemo(
    () => [
      { imageSrc: '/edu.jpg', url: '/programs/education', title: 'Empowering Through Education', subtitle: 'Bringing children back to school in remote villages.' },
      { imageSrc: '/health.jpg', url: '/programs/healthcare', title: 'Healthcare For All', subtitle: 'Reaching the unreached with primary health services.' },
      { imageSrc: '/womsafety.webp', url: '/programs/womens-safety', title: 'Women Empowerment', subtitle: 'Creating safe environments and resilient livelihoods.' },
      { imageSrc: '/disaster.jpg', url: '/programs/disaster', title: 'Disaster Management', subtitle: 'Rapid relief and rebuilding during national emergencies.' },
    ],
    []
  )

  const [slideIndex, setSlideIndex] = useState(0)
  const campaignScrollRef = useRef(null)

  const scrollCampaigns = (direction) => {
    if (campaignScrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      campaignScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % heroSlides.length)
    }, 4500)
    return () => clearInterval(id)
  }, [heroSlides.length])

  // Framer Motion shared animations
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  return (
    <div className="bg-white selection:bg-emerald-200">
      
      {/* FULL-BLEED HERO FRAME */}
      <section className="relative w-full h-[90svh] min-h-[600px] bg-slate-900 overflow-hidden text-white pt-20">
        <div className="absolute inset-0 z-0">
          
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: slideIndex === index ? 1 : 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className={`absolute inset-0 ${slideIndex === index ? 'z-[1]' : 'z-0'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-black/20 z-[2]" />
              <motion.img
                initial={{ scale: 1.1 }}
                animate={slideIndex === index ? { scale: 1 } : { scale: 1.1 }}
                transition={{ duration: 5, ease: "easeOut" }}
                src={slide.imageSrc}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}

          <div className="absolute inset-0 z-[10] flex flex-col items-center justify-center text-center px-4 md:px-8">
             <motion.div
                key={`text-${slideIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl pt-20 flex flex-col items-center"
             >
                <div className="mb-6 inline-flex border border-emerald-400/30 bg-emerald-500/20 backdrop-blur-md px-4 py-1.5 rounded-full">
                   <span className="text-emerald-100 font-bold text-xs uppercase tracking-widest">
                     Welcome to Samarpan
                   </span>
                </div>
                
                <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6 leading-[1.05]">
                   {heroSlides[slideIndex].title}
                </h1>
                
                <p className="text-lg sm:text-2xl text-slate-200 mb-10 max-w-2xl font-light">
                   {heroSlides[slideIndex].subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                   <Link
                     to="/donate"
                     className="group flex items-center justify-center gap-3 rounded-full bg-emerald-500 px-8 py-4 font-bold text-slate-950 transition-all hover:bg-emerald-400 active:scale-95"
                   >
                     Make a Donation <FaHeart className="text-red-500 transition-transform group-hover:scale-125" />
                   </Link>
                   <Link
                     to={heroSlides[slideIndex].url}
                     className="group flex items-center justify-center gap-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-8 py-4 font-bold text-white transition-all hover:bg-white/20 active:scale-95"
                   >
                     Explore Programme <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                   </Link>
                </div>
             </motion.div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex gap-3">
             {heroSlides.map((_, idx) => (
               <button 
                 key={idx} 
                 onClick={() => setSlideIndex(idx)}
                 className={`h-2 rounded-full transition-all duration-500 ${slideIndex === idx ? 'w-10 bg-emerald-400' : 'w-2 bg-white/30'}`}
                 aria-label={`Slide ${idx + 1}`}
               />
             ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <InfiniteMarquee />

      {/* MISSION / STORY BLOCK */}
      <section className="py-24 md:py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}
          className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <div>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
              Empowering communities to break the cycle of poverty.
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-light">
              Founded as a community-driven initiative, <strong className="text-emerald-700 font-semibold">Samarpan</strong> works alongside schools, health systems, and local organisations to reach children in remote villages and urban slums. 
            </p>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed font-light">
              We are committed to transparency and measurable impact — every contribution strengthens programmes that bring more children back to school, improves access to healthcare, and creates safer environments.
            </p>
            <Link to="/about" className="font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-2 text-lg border-b-2 border-emerald-200 pb-1 hover:border-emerald-600 transition-colors">
              Read our full story <FaArrowRight className="text-sm" />
            </Link>
          </div>

          {/* Picture Collage */}
          <div className="relative h-[500px] w-full rounded-[2rem] overflow-hidden shadow-2xl group">
             <img src="/10-1.jpg" alt="Children Smiling" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-8">
               <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-white w-full">
                 <p className="font-bold text-2xl font-heading mb-1">Our Focus</p>
                 <p className="text-sm text-slate-100 font-light">Long-term change starting at the grassroots.</p>
               </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* BENTO BOX GRID (Programmes) */}
      <section className="bg-slate-50 py-24 md:py-32 px-4 sm:px-6 lg:px-12 border-y border-slate-200">
         <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-7xl mx-auto mb-16 px-2 lg:px-0">
           <h2 className="font-heading text-4xl lg:text-6xl font-black text-slate-900">What we do</h2>
           <p className="text-xl text-slate-500 mt-4 max-w-2xl font-light">Targeted programmes reaching out to India's most vulnerable demographic.</p>
         </motion.div>

         <motion.div 
           initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
           className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
         >
            {/* Box 1 (Education) */}
            <motion.Link variants={fadeUp} to="/programs/education" className="relative group overflow-hidden rounded-[2.5rem] bg-emerald-950 min-h-[400px]">
              <img src="/edu.jpg" alt="Education" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/40 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white text-left">
                <span className="uppercase tracking-widest text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm mb-4">Programme 01</span>
                <h3 className="font-heading text-4xl font-black mb-3 text-white shadow-sm">Education</h3>
                <p className="text-emerald-50 max-w-sm font-light leading-relaxed">Bridge schools, scholarships, and remedial support for first-generation learners.</p>
              </div>
            </motion.Link>

            {/* Box 2 (Women Safety) */}
            <motion.Link variants={fadeUp} to="/programs/womens-safety" className="relative group overflow-hidden rounded-[2.5rem] bg-orange-900 min-h-[400px]">
              <img src="/womsafety.webp" alt="Women" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white text-left">
                 <span className="uppercase tracking-widest text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm mb-4">Programme 02</span>
                 <h3 className="font-heading text-4xl font-black mb-3 text-white">Empowerment</h3>
                 <p className="text-orange-50 max-w-sm font-light leading-relaxed">Creating safe environments and creating resilient livelihoods for women.</p>
              </div>
            </motion.Link>

            {/* Box 3 (Healthcare) */}
            <motion.Link variants={fadeUp} to="/programs/healthcare" className="relative group overflow-hidden rounded-[2.5rem] bg-rose-950 min-h-[400px]">
              <img src="/health.jpg" alt="Health" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white text-left">
                <span className="uppercase tracking-widest text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm mb-4">Programme 03</span>
                <h3 className="font-heading text-4xl font-black mb-3 text-white">Healthcare</h3>
                <p className="text-rose-100 max-w-sm font-light leading-relaxed">Mobile clinics &amp; immunisation drives reaching rural families in need.</p>
              </div>
            </motion.Link>

            {/* Box 4 (Disaster Management) */}
            <motion.Link variants={fadeUp} to="/programs/disaster" className="relative group overflow-hidden rounded-[2.5rem] bg-blue-950 min-h-[400px]">
              <img src="/disaster.jpg" alt="Disaster Management" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white text-left">
                <span className="uppercase tracking-widest text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm mb-4">Programme 04</span>
                <h3 className="font-heading text-4xl font-black mb-3 text-white">Disaster Relief</h3>
                <p className="text-blue-100 max-w-sm font-light leading-relaxed">Emergency crisis response, distribution of supplies, and community rebuilding.</p>
              </div>
            </motion.Link>

            {/* Box 5 (Wide text panel) */}
            <motion.div variants={fadeUp} className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-xl min-h-[350px] p-10 lg:p-14 flex flex-col justify-center text-center items-center mt-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-transparent to-transparent pointer-events-none"></div>
              <h3 className="font-heading text-4xl lg:text-5xl font-black mb-6 text-white leading-tight">Beyond Aid. Building Resilience.</h3>
              <p className="text-slate-300 font-light text-lg lg:text-xl max-w-3xl mb-8 leading-relaxed">
                Our approach integrates all four pillars to fortify vulnerable communities. By skilling youth for dignified employment and providing urgent relief during crises, we ensure sustainable, long-term impact rather than temporary fixes.
              </p>
              <Link to="/programs" className="text-emerald-400 font-bold tracking-widest uppercase hover:text-emerald-300 inline-flex items-center gap-2 px-6 py-3 border border-emerald-500/50 rounded-full hover:bg-emerald-500/10 transition-colors">
                View all programmes <FaArrowRight />
              </Link>
            </motion.div>
         </motion.div>
      </section>

      {/* HORIZONTAL FEATURED CAMPAIGNS SECTION */}
      {campaigns.length > 0 && (
        <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-12 border-b border-slate-200 overflow-hidden">
          <div className="max-w-[1400px] mx-auto w-full">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 lg:px-0">
              <div>
                <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-2 block">Direct Support</span>
                <h2 className="font-heading text-4xl lg:text-5xl font-black text-slate-900">Urgent Campaigns</h2>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => scrollCampaigns('left')}
                  className="w-12 h-12 rounded-full bg-white border border-slate-300 text-slate-600 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all shadow-sm z-10"
                >
                  <FaChevronLeft size={16} className="-ml-0.5" />
                </button>
                <button 
                  onClick={() => scrollCampaigns('right')}
                  className="w-12 h-12 rounded-full bg-white border border-slate-300 text-slate-600 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all shadow-sm z-10"
                >
                  <FaChevronRight size={16} className="-mr-0.5" />
                </button>
              </div>
            </motion.div>

            <div className="relative group/campaignslider">
              <div 
                ref={campaignScrollRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-4 h-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {campaigns.map((c) => (
                  <motion.article
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    key={c.id}
                    className="flex flex-col min-w-[85vw] md:min-w-[420px] max-w-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 snap-center flex-shrink-0"
                  >
                    <div className="h-[220px] w-full bg-slate-100 bg-cover bg-center relative" style={{ backgroundImage: `url(${c.coverImageUrl || '/Banner3-1.jpg.webp'})` }}>
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                       <span className="absolute bottom-4 left-4 bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                         {c.category?.replace('-', ' ')}
                       </span>
                    </div>

                    <div className="flex flex-1 flex-col p-8 bg-white">
                      <h2 className="font-heading mb-3 text-2xl font-black text-slate-900 leading-tight line-clamp-2">{c.title}</h2>
                      <p className="mb-8 flex-1 text-slate-600 font-light leading-relaxed line-clamp-3">
                        {c.summary || 'Support our field teams and beneficiaries directly.'}
                      </p>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8 pb-4">
                        {c.goalAmount > 0 ? (
                          <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-slate-200/80 shadow-inner">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                              style={{ width: `${Math.min(100, ((c.raisedAmount || 0) / c.goalAmount) * 100)}%` }}
                            />
                          </div>
                        ) : null}
                        <p className="text-sm font-bold flex justify-between items-center">
                          <span className="text-emerald-700">₹{(c.raisedAmount || 0).toLocaleString('en-IN')} <span className="font-light text-slate-500 text-xs">Raised</span></span>
                          {c.goalAmount > 0 ? <span className="text-slate-600">₹{c.goalAmount.toLocaleString('en-IN')} <span className="font-light text-slate-400 text-xs">Goal</span></span> : ''}
                        </p>
                      </div>

                      <Link
                        to={`/donate/${c.id}/pay`}
                        className="w-full text-center rounded-xl bg-slate-900 border border-slate-800 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-emerald-600 hover:border-emerald-500 hover:shadow-[0_8px_30px_rgb(5,150,105,0.3)] hover:-translate-y-0.5"
                      >
                        Donate Now
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LIVE HIGHLIGHTS: CAMPAIGNS & EVENTS */}
      {(campaigns.length > 0 || events.length > 0) && (
        <section className="py-24 bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-heading text-4xl lg:text-5xl font-black text-slate-900 mb-12">
                Live Highlights
              </motion.h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* CAMPAIGNS COLUMN */}
                {campaigns.length > 0 && (
                  <motion.div variants={fadeUp} className="flex flex-col gap-6">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-2xl font-bold font-heading text-emerald-950 flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span> Active Campaigns
                       </h3>
                    </div>
                    {campaigns.map(c => (
                      <div key={c.id} className="group relative rounded-[2rem] border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row">
                        <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-slate-100">
                          <img src={c.coverImageUrl} alt={c.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          {c.imageUrls?.length > 0 && (
                            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <FaImages /> +{c.imageUrls.length} Gallery
                            </div>
                          )}
                        </div>
                        <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2 block">{c.category?.replace('-', ' ')}</span>
                          <h4 className="text-xl font-bold text-slate-900 mb-3">{c.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-6 font-light leading-relaxed">{c.summary}</p>
                          
                          <div className="mt-auto">
                             <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                                <div 
                                  className="bg-emerald-500 h-1.5 rounded-full" 
                                  style={{ width: `${Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100))}%` }} 
                                />
                             </div>
                             <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-emerald-700">₹{c.raisedAmount.toLocaleString('en-IN')} raised</span>
                                <span className="text-slate-400">of ₹{c.goalAmount.toLocaleString('en-IN')}</span>
                             </div>
                          </div>
                        </div>
                        <Link to={`/donate?campaignId=${c.id}`} className="absolute inset-0 z-10 opactiy-0"><span className="sr-only">Donate to {c.title}</span></Link>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* EVENTS COLUMN */}
                {events.length > 0 && (
                  <motion.div variants={fadeUp} className="flex flex-col gap-6">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-2xl font-bold font-heading text-rose-950 flex items-center gap-2">
                         <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span> Upcoming Events
                       </h3>
                    </div>
                    {events.map(e => (
                      <div key={e.id} className="group relative rounded-[2rem] border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
                         <div className="flex-shrink-0 w-24 h-24 rounded-full border-4 border-rose-50 overflow-hidden relative shadow-inner">
                           {e.coverImageUrl ? (
                             <img src={e.coverImageUrl} className="w-full h-full object-cover" alt="" />
                           ) : (
                             <div className="w-full h-full bg-rose-100 flex items-center justify-center text-rose-300"><FaCalendarAlt size={24} /></div>
                           )}
                         </div>
                         <div className="flex-1 text-center md:text-left">
                           <h4 className="text-xl font-bold text-slate-900 mb-2">{e.title}</h4>
                           <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-xs font-semibold text-slate-500 mb-4 justify-center md:justify-start">
                             <span className="flex items-center gap-1.5 justify-center"><FaCalendarAlt className="text-rose-400"/> {new Date(e.startsAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                             {e.venue && <span className="flex items-center gap-1.5 justify-center"><FaMapMarkerAlt className="text-rose-400"/> {e.venue}</span>}
                           </div>
                           <p className="text-sm text-slate-600 line-clamp-2 font-light leading-relaxed mb-6">{e.description}</p>
                           
                           <Link 
                             to={`/get-involved/volunteer?eventId=${e.id}&eventTitle=${encodeURIComponent(e.title)}`} 
                             className="inline-flex items-center justify-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors relative z-20"
                           >
                             Volunteer for this event
                           </Link>
                         </div>
                      </div>
                    ))}
                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* IMMERSIVE IMPACT TYPOGRAPHY */}
      <section className="py-24 md:py-40 px-6 lg:px-12 bg-white text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-6xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl font-black text-slate-900 mb-20 uppercase tracking-tight">Our Reach</motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {[
              { num: '20L+', text: 'Children & families impacted' },
              { num: '2000+', text: 'Villages & slums transformed' },
              { num: '27+', text: 'States covered actively' }
            ].map((stat, i) => (
              <motion.div variants={fadeUp} key={i} className="flex flex-col items-center justify-center pt-8 md:pt-0">
                <span className="font-heading text-7xl lg:text-9xl font-black text-slate-900 tracking-tighter mb-4">{stat.num}</span>
                <span className="text-xl text-slate-500 font-light">{stat.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FOOTER CTA BANNER */}
      <section className="p-4 md:p-6 lg:p-8 bg-white pt-0">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="relative bg-emerald-950 rounded-[2rem] md:rounded-[3rem] overflow-hidden py-24 px-6 md:px-16 text-center"
        >
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
             <div className="mb-8 inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-400">
                <FaHeart size={32} />
             </div>
             <h2 className="font-heading text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
               Be part of the change. <br/> <span className="text-emerald-400">Act today.</span>
             </h2>
             <p className="text-xl text-emerald-100/80 mb-12 font-light max-w-2xl">
               Every contribution empowers grassroot communities. Join Samarpan's journey to build an equal world.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
               <Link
                 to="/donate"
                 className="flex justify-center rounded-full bg-emerald-500 px-10 py-5 font-bold text-emerald-950 transition-transform hover:-translate-y-1 hover:scale-105"
               >
                 Support a Cause
               </Link>
               <Link
                 to="/get-involved/volunteer"
                 className="flex justify-center rounded-full border-2 border-emerald-400/30 px-10 py-5 font-bold text-emerald-100 transition-all hover:bg-emerald-400/10 hover:border-emerald-400"
               >
                 Become a Volunteer
               </Link>
             </div>
          </div>
          
          {/* Subtle bg decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        </motion.div>
      </section>

    </div>
  )
}
