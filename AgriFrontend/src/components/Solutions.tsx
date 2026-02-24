
const Solutions = () => {
  const solutions = [
    {
      number: "01",
      title: "Discover Your Destiny",
      description: "Unlock your cosmic potential through personalized astrological readings that reveal your life path, purpose, and hidden talents written in the stars."
    },
    {
      number: "02",
      title: "Connect with Expert Astrologers",
      description: "Access a network of certified astrologers who provide personalized consultations, helping you navigate life's challenges with celestial wisdom."
    },
    {
      number: "03",
      title: "Unlock Cosmic Insights",
      description: "Gain deep understanding of planetary influences and cosmic energies affecting your relationships, career, and personal growth journey."
    },
    {
      number: "04",
      title: "Navigate Life's Journey",
      description: "Receive guidance on timing important decisions using astrological transits, lunar phases, and planetary movements for optimal outcomes."
    }
  ];

  return (
    <section id="solutions" className="section-padding bg-gradient-to-b from-purple-950 to-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="fade-in-section">
          <h2 className="section-title">
            Our <span className="gradient-text">Solutions</span>
          </h2>
          <p className="section-subtitle">
            Comprehensive astrological services designed to illuminate your path and empower you with cosmic wisdom
          </p>
        </div>

        <div className="space-y-8 mt-12">
          {solutions.map((solution, index) => (
            <div key={index} className="fade-in-section">
              <div className="flex flex-col md:flex-row gap-6 items-start p-6 rounded-xl hover:bg-purple-900/30 transition-colors duration-300 border border-transparent hover:border-purple-500/30">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600/30 to-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl border border-amber-400/30">
                    {solution.number}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-100">{solution.title}</h3>
                  <p className="text-gray-400">{solution.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;