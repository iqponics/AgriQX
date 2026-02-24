import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  Users,
  MessageCircle,
  ShoppingCart,
  ShoppingBag,
  LogOut,
  User2,
  Menu,
  X,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { SlFeed } from "react-icons/sl";

interface NavbarProps {
  setIsAuth: (value: boolean) => void;
}

export default function Navbar({ setIsAuth }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const getUserRoleFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return 'customer'; // Default to customer
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || 'customer';
    } catch (error) {
      return 'vendor';
    }
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    if (token.startsWith('demo-')) return 'demo-user';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (error) {
      return 'demo-user'; // Fallback for any other non-JWT token in development
    }
  };

  const userId = getUserIdFromToken();
  const userRole = getUserRoleFromToken();

  const readCartCount = () => {
    try {
      const raw = localStorage.getItem('astro_ecom_cart_v2')
      if (!raw) return 0
      const arr = JSON.parse(raw)
      return arr.reduce((s: number, it: any) => s + (it.quantity || 0), 0)
    } catch (e) {
      return 0
    }
  }

  useEffect(() => {
    setCartCount(readCartCount())
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'astro_ecom_cart_v2') setCartCount(readCartCount())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const navLinks = [
    { to: "/home", icon: <Home />, name: "Marketplace" },
    { to: `/contacts/${userId}`, icon: <Users />, name: "Vendors" },
    { to: "/feed", icon: <SlFeed />, name: "Stories" },
    { to: "/ecommerce", icon: <ShoppingBag />, name: "Shop" },
    { to: "/profile-info", icon: <User2 />, name: "Profile" },
    { to: "/messages", icon: <MessageCircle />, name: "Inbox" },
  ];

  let finalLinks = [...navLinks];

  if (userRole === 'vendor') {
    finalLinks.splice(3, 0, { to: "/vendor/my-products", icon: <Package />, name: "My Products" });
  }

  if (userRole === 'admin') {
    finalLinks.splice(3, 0, { to: "/admin", icon: <ShieldCheck />, name: "Admin Portal" });
  }

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // Mock Logout Logic
    localStorage.removeItem("authToken");
    localStorage.removeItem("demoUser");
    setIsAuth(false);
    navigate("/login");
    console.log("Logged out (Demo mode)");
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm py-1 z-50 border-b border-leaf-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img
              src="/IQponics.png"
              alt="IQponics"
              className="h-12 md:h-16 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {finalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`p-2 rounded-lg transition-all relative group ${isActive(link.to)
                  ? "text-leaf-700 bg-leaf-50 border border-leaf-200"
                  : "text-gray-600 hover:text-leaf-700 hover:bg-leaf-50"
                  }`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {link.icon}
                </div>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-leaf-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                  {link.name}
                </span>
              </Link>
            ))}

            <button
              onClick={() => navigate('/ecommerce/cart')}
              className="relative p-2 rounded-lg text-gray-600 hover:text-leaf-700 hover:bg-leaf-50 group"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-farm-700 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">{cartCount}</span>
              )}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-leaf-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                Cart
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all ml-2 group relative"
            >
              <LogOut className="w-5 h-5" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-leaf-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                Logout
              </span>
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-leaf-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Sidebar & Backdrop */}
        {/* Mobile Sidebar & Backdrop */}
        <Dialog as="div" className="relative z-50 md:hidden" open={isMobileMenuOpen} onClose={setIsMobileMenuOpen}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

          <div className="fixed inset-0 z-50 flex">
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-leaf-50">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src="/IQponics.png" className="h-10 w-auto" alt="Logo" />
                </Link>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 px-4 space-y-2">
                {finalLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${isActive(link.to)
                      ? "bg-leaf-600 text-white shadow-lg shadow-leaf-200"
                      : "text-gray-600 hover:bg-leaf-50 hover:text-leaf-700"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={`${isActive(link.to) ? "text-white" : "text-leaf-600"}`}>
                      {link.icon}
                    </div>
                    <span className="font-bold">{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-auto px-4 pt-6 pb-6 border-t border-leaf-50 space-y-3">
                <button
                  onClick={() => {
                    navigate('/ecommerce/cart');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-leaf-50/50 text-gray-700 hover:bg-leaf-100 transition-all border border-leaf-100/50"
                >
                  <div className="flex items-center space-x-4">
                    <ShoppingCart className="w-6 h-6 text-leaf-600" />
                    <span className="font-bold">My Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-farm-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">{cartCount}</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-4 p-4 w-full text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                >
                  <LogOut className="w-6 h-6" />
                  <span className="font-bold">Sign Out</span>
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </nav>
  );
}
