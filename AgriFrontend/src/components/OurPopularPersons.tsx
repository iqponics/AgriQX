import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

type Person = {
  id: string
  name: string
  title?: string
  image?: string
  rating?: number
}

const SAMPLE: Person[] = [
  { id: 'p1', name: 'Aman Sharma', title: 'Home Cook', image: 'https://i.pravatar.cc/150?img=12', rating: 5.0 },
  { id: 'p2', name: 'Priya Verma', title: 'Nutritionist', image: 'https://i.pravatar.cc/150?img=32', rating: 4.9 },
  { id: 'p3', name: 'Sandeep Singh', title: 'Restaurant Owner', image: 'https://i.pravatar.cc/150?img=48', rating: 5.0 },
  { id: 'p4', name: 'Anjali Das', title: 'Fitness Enthusiast', image: 'https://i.pravatar.cc/150?img=18', rating: 4.8 },
  { id: 'p5', name: 'Vikram Malhotra', title: 'Organic Food Blogger', image: 'https://i.pravatar.cc/150?img=46', rating: 4.9 },
]

const OurPopularPersons: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    const track = trackRef.current

    if (!section || !track) return

    gsap.to(track, {
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

  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 bg-cream-100 overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12 fade-in-section">
          <span className="text-leaf-600 font-bold tracking-widest uppercase text-sm mb-4 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-charcoal-900 mb-6">
            Our <span className="text-leaf-700">Happy Customers</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-sans">
            Don't just take our word for it. Hear what our community of food lovers and professionals have to say about Farm Fresh.
          </p>
        </div>
      </div>

      <div ref={trackRef} className="flex gap-8 px-4 pl-[max(1rem,calc((100vw-80rem)/2))] w-max">
        {SAMPLE.map((p) => (
          <div key={p.id} className="w-[85vw] md:w-[400px] flex-shrink-0">
            <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 p-10 flex flex-col h-full border border-cream-200 relative mt-12 group">
              <div className="absolute -top-12 left-10">
                <div className="relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-farm-400 text-charcoal-900 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91241 16 8.01699 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H7.01699C6.46471 8 6.01699 8.44772 6.01699 9V11C6.01699 11.5523 5.56928 12 5.01699 12H4.01699V21H6.017Z" /></svg>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <div className="flex items-center gap-1 text-sm text-farm-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  <span className="font-bold text-charcoal-900 ml-2">{p.rating?.toFixed(1)}</span>
                </div>

                <p className="text-gray-600 italic leading-relaxed mb-8 font-sans">
                  "The quality of produce from Farm Fresh is unmatched. The spinach stays fresh for days, and the mangoes actually taste like they came straight from an orchard."
                </p>

                <div className="mt-auto pt-6 border-t border-cream-100">
                  <div className="font-bold text-charcoal-900 font-poppins text-lg">{p.name}</div>
                  <div className="text-leaf-600 font-bold text-xs uppercase tracking-widest">{p.title}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OurPopularPersons
