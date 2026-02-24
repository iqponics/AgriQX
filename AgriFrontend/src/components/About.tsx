import { CheckCircle2, Sprout, Tractor } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section-padding bg-white py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 fade-in-section">
          <span className="text-leaf-600 font-bold tracking-widest uppercase text-xs mb-4 block">Our Story</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-charcoal-900 font-poppins tracking-tight">
            Cultivating <span className="text-leaf-600">Freshness</span> & Trust
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Farm Fresh Marketplace connects local farmers directly with consumers, ensuring the highest quality organic produce while supporting sustainable farming communities.
          </p>
        </div>

        {/* Grid Layout for Image and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Section */}
          <div className="relative md:order-1 group fade-in-section px-4">
            <div className="absolute -inset-2 md:-inset-4 bg-leaf-50 rounded-[2rem] transform -rotate-1 md:-rotate-2 transition-transform group-hover:rotate-0 duration-500"></div>
            <img
              src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Sustainable Farming"
              className="relative rounded-3xl shadow-2xl w-full h-[350px] md:h-[500px] object-cover z-10 border border-leaf-100"
            />
            <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-2xl shadow-2xl z-20 border border-leaf-100 animate-float">
              <p className="text-leaf-600 font-black text-3xl md:text-4xl font-poppins">100%</p>
              <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">Organic Certified</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:order-2 fade-in-section">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-charcoal-900 font-poppins tracking-tight">
              Our Mission
            </h3>
            <p className="text-gray-600 mb-12 text-lg leading-relaxed">
              We started with a simple vision: to eliminate the middlemen and bring the harvest directly from the soil to your kitchen. By empowering local growers, we create a transparent food system where quality and fair pricing go hand-in-hand.
            </p>

            {/* Features List */}
            <div className="space-y-8">
              {/* Feature 1 */}
              <div className="flex items-start p-2 group">
                <div className="bg-leaf-100 p-3 rounded-xl mr-5 group-hover:bg-leaf-700 group-hover:text-white transition-all duration-300">
                  <Sprout className="w-6 h-6 text-leaf-700 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal-900 text-xl font-poppins mb-1">Naturally Grown</h4>
                  <p className="text-gray-500 leading-snug">Every product is grown using traditional and sustainable farming methods.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start p-2 group">
                <div className="bg-farm-100 p-3 rounded-xl mr-5 group-hover:bg-farm-600 group-hover:text-white transition-all duration-300">
                  <Tractor className="w-6 h-6 text-farm-700 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal-900 text-xl font-poppins mb-1">Direct from Farm</h4>
                  <p className="text-gray-500 leading-snug">Bypassing warehouses means you get produce that was often harvested within 24 hours.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start p-2 group">
                <div className="bg-soil-100 p-3 rounded-xl mr-5 group-hover:bg-soil-700 group-hover:text-white transition-all duration-300">
                  <CheckCircle2 className="w-6 h-6 text-soil-700 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-charcoal-900 text-xl font-poppins mb-1">Verified Quality</h4>
                  <p className="text-gray-500 leading-snug">Strict verification process for every vendor on our marketplace.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
