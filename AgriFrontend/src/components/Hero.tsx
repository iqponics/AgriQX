import { ChevronDown, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToNext = () => {
    const nextSection = document.getElementById('categories') || document.getElementById('about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background with Light Video/Image Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-leaf-50 via-white to-leaf-50">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
        </video>
        {/* Subtle Light Overlay for Freshness */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-leaf-50/40"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 z-10 pt-32 md:pt-24 max-w-5xl">
        <div className="flex flex-col items-center text-center fade-in-section">
          <div className="mb-6 md:mb-8 inline-block">
            <span className="px-4 md:px-5 py-2 bg-leaf-100/50 text-leaf-700 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-leaf-200 backdrop-blur-sm shadow-sm">
              Direct from Local Farms • Organic & Fresh
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-[1.2] md:leading-[1.1] font-poppins text-charcoal-900 tracking-tight px-2">
            Fresh from <span className="text-leaf-600 font-black">Vendors</span>
            <span className="block mt-1">Direct to You</span>
          </h1>

          <p className="text-base md:text-xl text-gray-600 max-w-2xl mb-10 md:mb-12 font-sans leading-relaxed px-4 md:px-0">
            Support local growers and get the highest quality produce, dairy, and grains delivered straight from the farm to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-5 w-full sm:w-auto px-6 sm:px-0">
            <Link to='/home' className="bg-leaf-600 hover:bg-leaf-700 text-white flex items-center justify-center gap-2 px-10 py-4 md:py-5 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-leaf-200/50 hover:scale-[1.03] text-lg">
              Shop Fresh Produce <ShoppingBag size={20} />
            </Link>
            <button className="border-2 border-leaf-600 text-leaf-700 hover:bg-leaf-50 px-10 py-4 md:py-5 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.03] text-lg">
              Meet Our Vendors
            </button>
          </div>

          <div className="mt-20 animate-bounce cursor-pointer group" onClick={scrollToNext}>
            <ChevronDown size={32} className="text-leaf-600 group-hover:text-leaf-700 transition-colors duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
