const Team = () => {
  const teamMembers = [
    {
      name: "Harpreet Singh",
      role: "Wheat & Grain Specialist",
      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Rajesh Kumar",
      role: "Organic Vegetable Expert",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Amrita Kaur",
      role: "Dairy & Poultry Lead",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Sukhwinder Singh",
      role: "Seasonal Fruits Orchardist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section id="team" className="section-padding bg-white py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="fade-in-section text-center">
          <span className="text-leaf-600 font-bold tracking-widest uppercase text-xs mb-4 block">Our Community</span>
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-charcoal-900 mb-6 tracking-tight">
            Meet Our <span className="text-leaf-600">Trusted Farmers</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-20 leading-relaxed theme-font">
            The backbone of Farm Fresh Marketplace. These are the dedicated individuals who ensure quality and sustainability in every harvest.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {teamMembers.map((member, index) => (
              <div key={index} className="fade-in-section group">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-leaf-50 text-center hover:-translate-y-2 group">
                  <div className="w-40 h-40 mx-auto mb-8 overflow-hidden rounded-full border-4 border-leaf-50 group-hover:border-leaf-200 transition-colors shadow-inner">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal-900 font-poppins mb-1">{member.name}</h3>
                  <p className="text-leaf-600 font-bold text-xs uppercase tracking-widest">{member.role}</p>

                  <div className="mt-6 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center text-leaf-700 hover:bg-leaf-700 hover:text-white cursor-pointer transition-colors">
                      <span className="text-xs font-bold">In</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center text-leaf-700 hover:bg-leaf-700 hover:text-white cursor-pointer transition-colors">
                      <span className="text-xs font-bold">Tw</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-28 bg-leaf-900 rounded-[2.5rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                <h3 className="text-3xl md:text-5xl font-bold text-white font-poppins mb-6 tracking-tight">Are you a farmer?</h3>
                <p className="text-leaf-100 text-lg leading-relaxed">
                  Join our growing community of 500+ local farmers and start selling your produce directly to consumers with fair pricing and zero middlemen.
                </p>
              </div>
              <button className="bg-white text-leaf-900 px-12 py-5 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-white/20 hover:scale-105 active:scale-95 whitespace-nowrap">
                Register as Merchant
              </button>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-farm-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;