import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User as UserIcon, Check, X, Clock } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { jwtDecode } from 'jwt-decode';

interface PendingRequest {
  _id: string;
  contactorId: {
    _id: string;
    firstname: string;
    lastname: string;
    profilePic: string;
    lawyerType: string;
  };
  timestamp: string;
}

interface Contact {
  _id: string;
  firstname: string;
  lastname: string;
  profilePic: string;
  lawyerType: string;
  geoLocation?: { city: string };
}

// Helper component for avatar handling
const ContactAvatar = ({ src, alt, className }: { src?: string; alt: string; className?: string }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-leaf-100 text-leaf-600 ${className}`}>
        <UserIcon size={24} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} object-cover`}
      onError={() => setError(true)}
    />
  );
};

export default function Contacts() {
  const [pending, setPending] = useState<any[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { fetchData } = useApi();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        fetchData<unknown, any>(`/users/${decoded.id}`, 'GET').then(user => {
          setCurrentUser(user);
        });
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUser?._id) return;

    const loadData = async () => {
      try {
        // Fetch populated contacts
        const contactsData = await fetchData<unknown, Contact[]>(`/users/contacts/${currentUser._id}`, 'GET');
        setContacts(contactsData);

        // Fetch pending requests - we'll fetch details for each contactorId for now
        // Ideally the backend should populate this.
        if (currentUser.pendingContacts) {
          const pendingWithDetails = await Promise.all(
            currentUser.pendingContacts.map(async (p: any) => {
              const details = await fetchData<unknown, any>(`/users/${p.contactorId}`, 'GET');
              return { ...p, contactorDetail: details };
            })
          );
          setPending(pendingWithDetails);
        }
      } catch (err) {
        console.error('Failed to load contacts/pending:', err);
      }
    };

    loadData();
  }, [currentUser]);

  const handleAccept = async (contactorId: string) => {
    try {
      await fetchData<unknown, any>(`/users/${contactorId}/acceptConnect`, 'PUT');
      setPending(prev => prev.filter(p => p.contactorId !== contactorId));
      // Refresh contacts
      const updatedContacts = await fetchData<unknown, Contact[]>(`/users/contacts/${currentUser._id}`, 'GET');
      setContacts(updatedContacts);
    } catch (err) {
      console.error('Failed to accept:', err);
    }
  };

  const handleDecline = async (contactorId: string) => {
    try {
      await fetchData<unknown, any>(`/users/${contactorId}/declineConnect`, 'PUT');
      setPending(prev => prev.filter(p => p.contactorId !== contactorId));
    } catch (err) {
      console.error('Failed to decline:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-leaf-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-1 md:px-0">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal-900 font-poppins mb-2 text-center md:text-left">Farmer Connect</h1>
          <p className="text-gray-500 font-sans text-center md:text-left px-4 md:px-0">Manage your network of trusted sustainable partners.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Pending Requests Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/70 backdrop-blur-md p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-leaf-100 shadow-xl shadow-leaf-100/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-charcoal-900 font-poppins flex items-center gap-3">
                  <Clock className="w-6 h-6 text-amber-500" />
                  Partnership Requests
                </h2>
                <span className="px-4 py-1.5 bg-leaf-100 text-leaf-700 rounded-full text-xs font-bold border border-leaf-200 uppercase tracking-widest">
                  {pending.length} New
                </span>
              </div>

              <div className="space-y-4">
                {pending.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-leaf-50/30 rounded-3xl border border-dashed border-leaf-100">
                    <UserIcon className="w-12 h-12 mb-2 opacity-20" />
                    <p className="font-medium">All caught up! No new requests.</p>
                  </div>
                ) : (
                  pending.map(request => {
                    const detail = request.contactorDetail;
                    if (!detail) return null;
                    const fullName = `${detail.firstname || ''} ${detail.lastname || ''}`.trim() || detail.username || 'User';
                    const profilePic = detail.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${detail.id || detail._id || 'User'}`;

                    return (
                      <div key={request._id} className="group flex flex-col md:flex-row items-center justify-between p-5 rounded-3xl bg-white border border-leaf-50 hover:border-leaf-300 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-5 mb-4 md:mb-0">
                          <div className="relative">
                            <img src={profilePic} alt={fullName} className="w-16 h-16 rounded-2xl object-cover border-2 border-leaf-100 group-hover:border-leaf-300 transition-colors shadow-md" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-leaf-500 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
                          </div>
                          <div>
                            <span className="text-xl font-bold text-charcoal-900 block mb-0.5">{fullName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-leaf-600 bg-leaf-50 px-2 py-0.5 rounded-full border border-leaf-100 uppercase tracking-tighter">
                                {detail.lawyerType || 'User'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                          <button
                            onClick={() => handleAccept(request.contactorId)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-leaf-600 hover:bg-leaf-700 text-white font-bold transition-all shadow-lg shadow-leaf-100 active:scale-95"
                          >
                            <Check className="w-5 h-5" /> Accept
                          </button>
                          <button
                            onClick={() => handleDecline(request.contactorId)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 border border-leaf-100 hover:border-red-200 transition-all active:scale-95"
                          >
                            <X className="w-5 h-5" /> Decline
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* My Connections Column */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 p-8 rounded-[2.5rem] border border-leaf-100 shadow-xl shadow-leaf-100/20 sticky top-28">
              <h2 className="text-2xl font-bold text-charcoal-900 font-poppins mb-8 flex items-center gap-3">
                <UserIcon className="w-6 h-6 text-leaf-600" />
                My Vendors
              </h2>

              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="text-center py-10 px-4 border-2 border-dashed border-leaf-100 rounded-3xl">
                    <p className="text-gray-400 text-sm font-medium">Start connecting with partners in the Marketplace.</p>
                  </div>
                ) : (
                  contacts.map(contact => {
                    const fullName = `${contact.firstname || ''} ${contact.lastname || ''}`.trim() || 'User';
                    const profilePic = contact.profilePic;
                    return (
                      <div key={contact._id} className="flex items-center gap-4 p-4 rounded-2xl bg-leaf-50/50 hover:bg-leaf-100/50 border border-leaf-100 transition-all cursor-pointer group">
                        <ContactAvatar src={profilePic} alt={fullName} className="w-12 h-12 rounded-xl shadow-sm group-hover:scale-105 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <p className="text-charcoal-900 font-bold truncate">{fullName}</p>
                          <p className="text-xs text-gray-400 truncate">{contact.geoLocation?.city || 'Nearby'}</p>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full group-hover:animate-ping shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                      </div>
                    );
                  })
                )}
              </div>

              <Link
                to="/home"
                className="mt-8 block text-center py-4 px-6 rounded-2xl bg-transparent border-2 border-leaf-600 text-leaf-700 font-bold hover:bg-leaf-600 hover:text-white transition-all duration-300"
              >
                Find More Partners
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
