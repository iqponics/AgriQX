import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

type Product = {
  id: string
  title: string
  description?: string
  image?: string
}

const SAMPLE: Product[] = [
  { id: 'pr1', title: 'Organic Vegetables', description: 'Freshly harvested seasonal greens, roots, and more.', image: 'https://images.unsplash.com/photo-1566385278603-d3997455d3ca?auto=format&fit=crop&w=600&q=80' },
  { id: 'pr2', title: 'Seasonal Fruits', description: 'Sweet, juicy fruits picked at peak ripeness.', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80' },
  { id: 'pr3', title: 'Farm Fresh Dairy', description: 'Pure milk, cheese, and butter from local farms.', image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=600&q=80' },
  { id: 'pr4', title: 'Whole Grains', description: 'Healthy grains and pulses directly from the soil.', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { id: 'pr5', title: 'Natural Honey & Spices', description: 'Pure forest honey and hand-ground farm spices.', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' },
]

const ProductsCategory: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    // Calculate total scroll width
    // We want to scroll the track to the left by (trackWidth - viewportWidth)
    // Adding some padding to the end scroll to ensure last item is fully visible

    // We scroll horizontally based on vertical scroll
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 100), // Scroll to the end
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        // The scroll distance determines the speed. 
        // end: () => "+=" + track.scrollWidth, // One way to calculate length
        end: "+=1000", // Fixed length for consistent feel
        invalidateOnRefresh: true, // Recalculate on resize
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="categories" className="py-28 bg-leaf-50/20 overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
        <div className="text-center">
          <span className="text-leaf-600 font-bold tracking-widest uppercase text-xs mb-4 block">Categories</span>
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-charcoal-900 tracking-tight mb-4">
            Shop by <span className="text-leaf-600">Category</span>
          </h2>
          <div className="w-20 h-1.5 bg-leaf-600 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div ref={trackRef} className="flex gap-8 px-4 pl-[max(1rem,calc((100vw-80rem)/2))] w-max">
        {SAMPLE.map((p) => (
          <div key={p.id} className="w-[85vw] md:w-[400px] flex-shrink-0">
            <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 p-8 flex flex-col items-center h-full group border border-leaf-100">
              <div className="w-full relative overflow-hidden rounded-2xl mb-8 aspect-square">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>

              <div className="text-center w-full flex-grow">
                <h3 className="font-bold text-charcoal-900 text-xl font-poppins mb-3 transition-colors">{p.title}</h3>
                <p className="text-sm text-gray-500 font-sans leading-relaxed line-clamp-2">{p.description}</p>
              </div>

              <div className="mt-10 w-full">
                <button className="w-full bg-leaf-600 hover:bg-leaf-700 text-white rounded-xl py-4 font-bold transition-all duration-300 shadow-lg shadow-leaf-100 uppercase tracking-widest text-[10px] hover:scale-[1.03]">
                  Explore Selection
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductsCategory
