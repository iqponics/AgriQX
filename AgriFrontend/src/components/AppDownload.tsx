import { useState, useEffect } from 'react';
import img1 from '/img1.png'
import img3 from '/img3.png'
import img2 from '/img2.png'
import { Apple, Smartphone, ArrowRight, Check, Download, Users, ShieldCheck, BarChart3 } from 'lucide-react';

const AppDownload = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const appScreens = [
    {
      title: "Buy Directly from Local Farmers",
      description: "Browse hundreds of fresh products straight from the farm to your doorstep.",
      image: img1
    },
    {
      title: "Live Price Tracking & Categories",
      description: "Stay updated with market prices and shop by categories like dairy, fruits, and grains.",
      image: img2
    },
    {
      title: "Secure Payments & Fast Delivery",
      description: "Fast last-mile delivery with multiple secure payment options for a seamless experience.",
      image: img3
    }
  ];

  const features = [
    { icon: <Users size={20} />, text: "Direct connection with 500+ farmers" },
    { icon: <ShieldCheck size={20} />, text: "100% Quality & Organic Assurance" },
    { icon: <BarChart3 size={20} />, text: "Real-time crop pricing & inventory" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveScreen((prev) => (prev + 1) % appScreens.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [appScreens.length]);

  return (
    <section id="download" className="section-padding bg-cream-50 overflow-hidden py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="fade-in-section text-center">
          <span className="text-leaf-600 font-bold tracking-widest uppercase text-sm mb-4 block">Get the App</span>
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-charcoal-900 mb-6">
            Marketplace in your <span className="text-leaf-700">Pocket</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16 font-sans">
            Experience the future of agricultural trade with our fast, secure, and user-friendly mobile application.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="fade-in-section order-2 md:order-1">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-charcoal-800 font-poppins">{appScreens[activeScreen].title}</h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                {appScreens[activeScreen].description}
              </p>

              <div className="space-y-5 mt-10">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="bg-leaf-50 p-3 rounded-xl text-leaf-700 shadow-sm">
                      {feature.icon}
                    </div>
                    <span className="text-charcoal-700 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mt-12">
                <button className="bg-charcoal-900 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 group hover:bg-leaf-800 transition-all duration-300">
                  <Apple size={24} />
                  <div className="text-left">
                    <span className="text-[10px] block uppercase tracking-wider opacity-70 font-bold">App Store</span>
                    <span className="text-lg font-bold">Download</span>
                  </div>
                </button>

                <button className="bg-leaf-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 group hover:bg-charcoal-900 transition-all duration-300">
                  <Smartphone size={24} />
                  <div className="text-left">
                    <span className="text-[10px] block uppercase tracking-wider opacity-70 font-bold">Google Play</span>
                    <span className="text-lg font-bold">Get it on</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="fade-in-section order-1 md:order-2 flex justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative z-10 scale-90 lg:scale-100">
                <div className="bg-charcoal-900 p-4 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-4 border-charcoal-800">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-10 bg-charcoal-900 rounded-b-3xl z-20"></div>

                  {/* Screen */}
                  <div className="rounded-[3rem] overflow-hidden h-[650px] w-[320px] relative bg-white">
                    <div className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                      <img
                        src={appScreens[activeScreen].image}
                        alt={`App Screen ${activeScreen + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* App Overlay */}
                    <div className="absolute top-12 left-0 right-0 p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="w-10 h-10 bg-leaf-100 rounded-full"></div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-leaf-100/50 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-farm-100/50 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;