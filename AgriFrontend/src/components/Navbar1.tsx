import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-leaf-100/50 py-2' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-24">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center z-50">
            <img
              src="/IQponics.png"
              alt="IQ Green Life Ponics"
              className="h-12 md:h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            <a href="#about" className={`${scrolled ? 'text-gray-700' : 'text-charcoal-900'} hover:text-leaf-600 font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5`}>About Our Farm</a>
            <a href="#categories" className={`${scrolled ? 'text-gray-700' : 'text-charcoal-900'} hover:text-leaf-600 font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5`}>Product Categories</a>
            <a href="#top-rated" className={`${scrolled ? 'text-gray-700' : 'text-charcoal-900'} hover:text-leaf-600 font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5`}>Partner Stores</a>
            <a href="#testimonials" className={`${scrolled ? 'text-gray-700' : 'text-charcoal-900'} hover:text-leaf-600 font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5`}>Reviews</a>
            <Link to="/signup" className="bg-leaf-600 hover:bg-leaf-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-leaf-200/50 hover:scale-[1.05] active:scale-95">
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden text-leaf-700 bg-leaf-50 p-2.5 rounded-2xl border border-leaf-100/50 transition-all active:scale-90 z-50 hover:bg-leaf-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <Dialog as="div" className="relative z-[60] md:hidden" open={isOpen} onClose={setIsOpen}>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md" aria-hidden="true" />

          <div className="fixed inset-0 z-[60] flex">
            <Dialog.Panel className="relative ml-auto flex h-full w-[85%] max-w-[320px] flex-col overflow-y-auto bg-white p-8 shadow-2xl border-l border-leaf-50">
              <div className="flex items-center justify-between mb-4 border-b border-leaf-50 pb-6">
                <img src="/IQponics-removebg.png" className="h-10 w-auto" alt="Logo" />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-leaf-700 bg-leaf-50 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col space-y-3">
                <a href="#about" className="text-gray-600 hover:text-leaf-600 font-bold text-lg transition-all py-3 px-4 rounded-xl border-b border-leaf-50/50" onClick={() => setIsOpen(false)}>About Our Farm</a>
                <a href="#categories" className="text-gray-600 hover:text-leaf-600 font-bold text-lg transition-all py-3 px-4 rounded-xl border-b border-leaf-50/50" onClick={() => setIsOpen(false)}>Product Categories</a>
                <a href="#top-rated" className="text-gray-600 hover:text-leaf-600 font-bold text-lg transition-all py-3 px-4 rounded-xl border-b border-leaf-50/50" onClick={() => setIsOpen(false)}>Partner Stores</a>
                <a href="#testimonials" className="text-gray-600 hover:text-leaf-600 font-bold text-lg transition-all py-3 px-4 rounded-xl" onClick={() => setIsOpen(false)}>User Reviews</a>

                <div className="pt-6">
                  <Link to="/signup" className="bg-leaf-600 text-white font-black text-center py-5 rounded-2xl shadow-xl shadow-leaf-200 block transition-transform active:scale-95" onClick={() => setIsOpen(false)}>
                    Get Started Now
                  </Link>
                </div>
              </div>

              <div className="mt-auto py-6 border-t border-leaf-50 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">&copy; IQponics {new Date().getFullYear()}</p>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </nav>
  );
}

export default Navbar1;
