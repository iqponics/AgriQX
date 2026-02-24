import React, { useMemo, useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

type Profile = {
  id: string
  name: string
  role: string
  desc?: string
  image?: string
}

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grains']

const SAMPLE: Profile[] = [
  { id: 'v1', name: 'Organic Spinach', role: 'Vegetables', desc: 'Freshly picked nutrient-rich green spinach.', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80' },
  { id: 'f1', name: 'Alphonso Mangoes', role: 'Fruits', desc: 'Sweet and premium quality seasonal mangoes.', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80' },
  { id: 'd1', name: 'Fresh Buffalo Milk', role: 'Dairy', desc: 'Pure, unprocessed milk from local farms.', image: 'https://images.unsplash.com/photo-1550583724-125581f779ed?auto=format&fit=crop&w=400&q=80' },
  { id: 'g1', name: 'Basmati Rice', role: 'Grains', desc: 'Long-grain aromatic rice from Punjab fields.', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80' },
  { id: 'v2', name: 'Red Tomatoes', role: 'Vegetables', desc: 'Vine-ripened juicy organic tomatoes.', image: 'https://images.unsplash.com/photo-1582284540020-8acaf01f344a?auto=format&fit=crop&w=400&q=80' },
]

const OurTopAstro: React.FC = () => {
  const [active, setActive] = useState<string>('All')
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const items = useMemo(() => {
    if (active === 'All') return SAMPLE
    return SAMPLE.filter((s) => s.role === active)
  }, [active])

  // Need to kill old ScrollTrigger when items change to recalculate width
  useGSAP(() => {
    const section = sectionRef.current
    const track = trackRef.current

    if (!section || !track) return

    // Allow time for DOM to update if items changed
    const width = track.scrollWidth

    // We scroll horizontally based on vertical scroll
    const st = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 100),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        end: "+=1000",
        invalidateOnRefresh: true,
      }
    });

    return () => {
      st.kill();
      ScrollTrigger.getById(section.id)?.kill();
    }

  }, { scope: sectionRef, dependencies: [items] }) // Re-run when items change

  return (
    <section ref={sectionRef} id="top-rated" className="py-24 bg-white overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-leaf-600 font-bold tracking-widest uppercase text-sm mb-4 block">Most Popular</span>
              <h2 className="text-3xl md:text-5xl font-bold font-poppins text-charcoal-900">
                Top Rated <span className="text-leaf-700">Fresh Products</span>
              </h2>
            </div>

            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${active === c ? 'bg-leaf-700 text-white shadow-lg shadow-leaf-200' : 'bg-cream-50 text-gray-500 hover:bg-leaf-50 hover:text-leaf-700 border border-cream-100'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div ref={trackRef} className="flex gap-8 px-4 pl-[max(1rem,calc((100vw-80rem)/2))] w-max">
        {items.map((p) => (
          <div key={p.id} className="w-[85vw] md:w-[400px] flex-shrink-0">
            <div className="w-full bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-500 border border-cream-200 group h-full">
              <div className="h-48 bg-cream-50 rounded-2xl mb-5 flex items-center justify-center overflow-hidden relative">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="text-sm text-gray-400">No image</div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-leaf-700 shadow-sm border border-leaf-50">
                  ★ 4.9
                </div>
              </div>
              <div>
                <h3 className="font-bold text-charcoal-900 text-lg font-poppins mb-1">{p.name}</h3>
                <div className="text-xs font-bold text-leaf-600 uppercase tracking-wider mb-3">{p.role}</div>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-sans mb-6">{p.desc}</p>
                <div className="flex items-center justify-between border-t border-cream-100 pt-4 mt-2">
                  <span className="text-leaf-800 font-bold">₹120/kg</span>
                  <button className="p-2 bg-leaf-50 text-leaf-700 rounded-lg hover:bg-leaf-700 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="w-full text-center py-20 text-gray-500">No products found in this category.</div>
        )}
      </div>
    </section>
  )
}

export default OurTopAstro
