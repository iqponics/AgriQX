import { useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Features from '../components/Feature';
import Team from '../components/Team';
import Achievements from '../components/Achievements';
import OurTopAstro from '../components/OurTopAstro';
import OurPopularPersons from '../components/OurPopularPersons';
import ProductsCategory from '../components/ProductsCategory';
import Footer from '../components/Footer'

function LandingPage() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-section');

      elements.forEach((element) => {
        const position = element.getBoundingClientRect();

        // Check if element is in viewport
        if (position.top < window.innerHeight - 100) {
          element.classList.add('is-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream-50 text-charcoal-900 overflow-x-hidden">
      {/* Navbar handled by App.tsx */}
      <Hero />
      <div id="about">
        <About />
      </div>
      <div id="categories">
        <ProductsCategory />
      </div>
      <OurTopAstro />
      <Features />
      <Achievements />
      <Team />
      <OurPopularPersons />
      <Footer />
    </div>
  );
}

export default LandingPage;