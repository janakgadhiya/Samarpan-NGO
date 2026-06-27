import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { api } from '../api/client.js'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [err, setErr] = useState('')
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api('/api/events')
        setEvents(data.events || [])
      } catch (e) {
        setErr(e.message || 'Could not load events')
      }
    })()
  }, [])

  return (
    <div className="bg-slate-50 px-5 py-10 pb-16">
      <div className="mx-auto max-w-[720px]">
        <h1 className="mb-2 text-2xl font-semibold text-emerald-950">Events</h1>
        <p className="mb-7 text-slate-600">Join us for programs on the ground and virtual briefings.</p>
        {err ? <p className="mb-4 text-red-700">{err}</p> : null}
        <div className="relative group/slider mt-8">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 h-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {events.map((ev) => (
              <article
                key={ev.id}
                className="flex flex-col min-w-[85vw] md:min-w-[400px] max-w-[400px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 snap-center flex-shrink-0"
              >
                <div
                  className="h-[200px] w-full bg-slate-100 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${ev.coverImageUrl || '/8-1.jpg'})` }}
                  role="presentation"
                >
                   <div className="absolute inset-0 bg-black/10"></div>
                </div>
                <div className="flex flex-col flex-1 p-8 bg-white">
                  <h2 className="mb-3 text-2xl font-black text-slate-900">{ev.title}</h2>
                  <p className="mb-6 font-semibold text-emerald-600 text-sm tracking-wide">
                    {ev.startsAt
                      ? new Date(ev.startsAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : ''}
                    {ev.venue ? ` · ${ev.venue}` : ''}
                  </p>
                  <p className="m-0 text-slate-600 font-light leading-relaxed flex-1">{ev.description}</p>
                </div>
              </article>
            ))}
          </div>

          {events.length > 0 && (
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
        {events.length === 0 && !err ? (
          <p className="text-slate-600">No published events yet.</p>
        ) : null}
      </div>
    </div>
  )
}
