import { useState } from 'react';
import { Info } from 'lucide-react';

const SupplyChain = () => {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const consultationFlow = [
    {
      id: 1,
      title: "Birth Details",
      description: "Provide your birth date, time, and location for accurate astrological chart calculation.",
      icon: "🌟"
    },
    {
      id: 2,
      title: "Chart Generation",
      description: "Our system generates your personalized natal chart with planetary positions and aspects.",
      icon: "📊"
    },
    {
      id: 3,
      title: "Analysis",
      description: "Expert astrologers analyze your chart considering current transits and life questions.",
      icon: "🔮"
    },
    {
      id: 4,
      title: "Consultation",
      description: "One-on-one session with certified astrologer to discuss insights and guidance.",
      icon: "💫"
    },
    {
      id: 5,
      title: "Insights",
      description: "Receive detailed cosmic insights about your life path, relationships, and career.",
      icon: "✨"
    },
    {
      id: 6,
      title: "Guidance",
      description: "Get personalized recommendations and timing for important life decisions.",
      icon: "🌙"
    },
    {
      id: 7,
      title: "Follow-up",
      description: "Access ongoing support and updates as planetary transits affect your chart.",
      icon: "🌠"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-black to-midnight-900 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="fade-in-section">
          <h2 className="section-title text-white">
            <span className="gradient-text">Consultation</span> Process
          </h2>
          <p className="section-subtitle text-gray-400">
            Personalized, Insightful, Accurate, Transformative guidance through cosmic wisdom
          </p>
        </div>

        <div className="fade-in-section mt-12">
          <div className="relative rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm p-6 shadow-2xl shadow-purple-500/20 border border-purple-500/20">
            {/* Consultation Flow */}
            <div className="flex flex-wrap justify-between items-center mb-12 relative">
              {/* Connecting Line */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-amber-400 to-purple-500 z-0 hidden md:block"></div>

              {consultationFlow.map((node) => (
                <div
                  key={node.id}
                  className="flex flex-col items-center mb-8 md:mb-0 relative z-10"
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br from-purple-800/50 to-blue-800/50 flex items-center justify-center mb-3 transition-all duration-300 cursor-pointer border-2 ${activeNode === node.id ? 'border-amber-400 scale-110 shadow-lg shadow-amber-400/50' : 'border-purple-500/30 hover:border-purple-400'}`}
                  >
                    <span className="text-4xl">{node.icon}</span>
                  </div>
                  <p className="text-sm font-medium text-center text-gray-300">{node.title}</p>

                  {/* Info popup */}
                  <div
                    className={`absolute top-full mt-2 bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-sm text-gray-100 p-4 rounded-lg shadow-xl shadow-purple-500/30 w-64 transition-all duration-300 z-20 border border-purple-500/30 ${activeNode === node.id ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                  >
                    <div className="flex items-start">
                      <Info size={16} className="text-amber-400 mr-2 mt-1 flex-shrink-0" />
                      <p className="text-sm">{node.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Flow Visualization */}
            <div className="grid grid-cols-7 gap-2 mt-8">
              {consultationFlow.map((node) => (
                <div key={`data-${node.id}`} className="flex flex-col items-center">
                  <div className={`w-12 h-12 bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 border ${activeNode === node.id ? 'border-amber-400' : 'border-purple-500/30'}`}>
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 text-center">Insight</p>
                </div>
              ))}
            </div>

            {/* Cosmic Energy Representation */}
            <div className="mt-12 flex items-center justify-center">
              <div className="flex space-x-2 overflow-x-auto pb-4 max-w-full">
                {[1, 2, 3, 4, 5, 6].map((block) => (
                  <div
                    key={`block-${block}`}
                    className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-800/50 to-blue-800/50 rounded-lg flex items-center justify-center border-2 ${activeNode === block ? 'border-amber-400' : 'border-purple-500/30'} transition-all duration-300`}
                  >
                    <span className="text-xs font-mono text-gray-300">STEP {block}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 font-medium">
              Our comprehensive consultation process ensures personalized cosmic guidance tailored to your unique birth chart,
              providing clarity and direction for your life journey.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm p-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer border border-purple-500/20">
                <h4 className="font-semibold text-amber-400">Birth Chart</h4>
                <p className="text-sm text-gray-400">Natal analysis</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm p-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer border border-purple-500/20">
                <h4 className="font-semibold text-amber-400">Transits</h4>
                <p className="text-sm text-gray-400">Current influences</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm p-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer border border-purple-500/20">
                <h4 className="font-semibold text-amber-400">Guidance</h4>
                <p className="text-sm text-gray-400">Life direction</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm p-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer border border-purple-500/20">
                <h4 className="font-semibold text-amber-400">Support</h4>
                <p className="text-sm text-gray-400">Ongoing insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplyChain;