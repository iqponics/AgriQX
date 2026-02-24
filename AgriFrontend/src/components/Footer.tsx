import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-leaf-900 text-white pt-16 pb-8 border-t border-leaf-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <img
                src="/IQponics.png"
                alt="IQponics"
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-leaf-100 mb-6">
              Empowering farmers, delivering freshness. Direct from fields to your home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-leaf-200 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-leaf-200 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-leaf-200 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-leaf-200 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-farm-400 font-poppins">Marketplace</h3>
            <ul className="space-y-3">
              <li><a href="/home" className="text-leaf-100 hover:text-white transition-colors">All Products</a></li>
              <li><a href="#" className="text-leaf-100 hover:text-white transition-colors">Vegetables</a></li>
              <li><a href="#" className="text-leaf-100 hover:text-white transition-colors">Fruits</a></li>
              <li><a href="#" className="text-leaf-100 hover:text-white transition-colors">Dairy & Eggs</a></li>
              <li><a href="#" className="text-leaf-100 hover:text-white transition-colors">Grains</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-farm-400 font-poppins">For Vendors</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-leaf-100 hover:text-white transition-colors">Partner With Us</a></li>
              <li><a href="#" className="text-leaf-100 hover:text-white transition-colors">Vendor Dashboard</a></li>
              <li><a href="#" className="text-leaf-100 hover:text-white transition-colors">Logistics Support</a></li>
              <li><a href="#" className="text-leaf-100 hover:text-white transition-colors">Best Practices</a></li>
              <li><a href="#" className="text-leaf-100 hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-farm-400 font-poppins">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-farm-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-leaf-100">Punjab, Heart of Farming, India</span>
              </li>
              <li className="flex items-start">
                <Mail size={20} className="text-farm-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-leaf-100">hello@iqgreenlife.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="text-farm-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-leaf-100">+91 1800-FARM-FRESH</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-leaf-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-leaf-300 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} IQponics. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-leaf-300 hover:text-farm-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-leaf-300 hover:text-farm-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-leaf-300 hover:text-farm-400 text-sm transition-colors">Vendor Code of Conduct</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
