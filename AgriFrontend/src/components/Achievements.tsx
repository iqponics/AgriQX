const Achievements = () => {
  /* 
    Logic to format numbers:
    - If number >= 1000, divide by 1000 and append "K"
    - Preserve decimals only if non-zero (e.g. 8.5K vs 10K)
  */
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      const kValue = num / 1000;
      // Check if it's an integer when divided (e.g., 10000 -> 10)
      if (kValue % 1 === 0) {
        return `${kValue}K`;
      }
      return `${kValue}K`; // 8500 -> 8.5K
    }
    return num.toString();
  };

  const stats = [
    { label: "Orders Delivered", rawValue: 10000, suffix: "+" },
    { label: "Happy Customers", rawValue: 8500, suffix: "+" },
    { label: "Verified Farmers", rawValue: 500, suffix: "+" },
    { label: "Purity Guarantee", rawValue: 100, suffix: "%" }
  ];

  const achievements = [
    {
      title: "Sustainable Agri-Tech Award",
      description: "Recognized as the 'Most Innovative Startup' for bridging the gap between farmers and urban consumers."
    },
    {
      title: "Trusted Organic Network",
      description: "Building India's most reliable network of certified organic growers with verified soil testing."
    },
    {
      title: "Fair Trade Certification",
      description: "Ensuring 30% higher earnings for farming communities by eliminating middle agents."
    }
  ];

  return (
    <section id="achievements" className="section-padding bg-leaf-50/30 py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="fade-in-section text-center">
          <span className="text-leaf-600 font-bold tracking-widest uppercase text-xs mb-4 block">Our Impact</span>
          <h2 className="text-3xl md:text-5xl font-bold font-poppins text-charcoal-900 mb-6 tracking-tight">
            Growth & <span className="text-leaf-600">Recognition</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Milestones and global recognition in our journey of digitizing the agricultural landscape.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mt-12">
          <div className="fade-in-section">
            <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-500 p-10 border border-leaf-100">
              <h3 className="text-xl font-bold mb-10 text-charcoal-900 font-poppins flex items-center gap-3">
                <span className="w-8 h-8 bg-leaf-600 rounded-lg flex items-center justify-center text-white text-xs">📊</span>
                Key Statistics
              </h3>

              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-6 rounded-2xl bg-leaf-50/50 hover:bg-leaf-100/50 transition-all duration-300 border border-leaf-100 group">
                    <p className="text-4xl font-bold text-leaf-600 mb-2 group-hover:scale-105 transition-transform">
                      {formatNumber(stat.rawValue)}{stat.suffix}
                    </p>
                    <p className="text-gray-500 font-semibold text-xs tracking-wider uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fade-in-section">
            <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-500 p-10 border border-leaf-100 h-full">
              <h3 className="text-xl font-bold mb-10 text-charcoal-900 font-poppins flex items-center gap-3">
                <span className="w-8 h-8 bg-farm-100 rounded-lg flex items-center justify-center text-farm-600 text-xs">★</span>
                Recognition
              </h3>

              <div className="space-y-8">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-5 group">
                    <div className="w-1 bg-leaf-100 group-hover:bg-leaf-600 transition-colors rounded-full h-12"></div>
                    <div>
                      <h4 className="text-lg font-bold text-charcoal-900 font-poppins mb-1">{achievement.title}</h4>
                      <p className="text-gray-500 leading-relaxed text-sm font-sans">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;