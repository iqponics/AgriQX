import { Truck, ShieldCheck, Heart, CircleDollarSign } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Truck size={24} />,
      title: "Express Delivery",
      description: "Get harvest-fresh produce delivered to your doorstep within 24 hours of being picked from the farm."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Certified Organic",
      description: "We verify every farmer's organic certifications and soil quality to ensure you get the purest food."
    },
    {
      icon: <CircleDollarSign size={24} />,
      title: "Fair Pricing",
      description: "By cutting out the middlemen, we ensure farmers get paid more while you pay less for premium quality."
    },
    {
      icon: <Heart size={24} />,
      title: "Community Support",
      description: "Every purchase directly supports rural farming families and promotes sustainable agricultural practices."
    }
  ];

  return (
    <section id="features" className="section-padding bg-cream-100 py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="fade-in-section text-center">
          <span className="text-leaf-600 font-bold tracking-widest uppercase text-sm mb-4 block">Why Choose Us</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-charcoal-900 font-poppins">
            Connecting <span className="text-leaf-700">Roots</span> to Tables
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16 font-sans">
            We are redefining the food supply chain by prioritizing freshness, transparency, and community-driven growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-cream-200 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-leaf-50 rounded-2xl flex items-center justify-center text-leaf-700 mb-6 group-hover:bg-leaf-700 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-charcoal-900 font-poppins">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
