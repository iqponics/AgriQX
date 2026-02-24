import { Scale } from 'lucide-react'

const Footer = () => {
  return (
    <div>
        <footer className="bg-white text-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">CONTACT US</h3>
              <ul className="space-y-2">
                <li>support@golicit.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">SERVICES</h3>
              <ul className="space-y-2">
                <li>Business Registration</li>
                <li>Legal Consultation</li>
                <li>Document Review</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">INFORMATION</h3>
              <ul className="space-y-2">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-500">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Scale className="h-8 w-8" />
                <span className="ml-2 text-2xl font-bold">AgriTech</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-green-200">Instagram</a>
                <a href="#" className="hover:text-green-200">Twitter</a>
                <a href="#" className="hover:text-green-200">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer