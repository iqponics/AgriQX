import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Star, User, MapPin } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { userApi } from "../api/userApi";

interface Contact {
  _id: string;
  name: string;
  profilePic: string;
}

interface Vendor {
  _id: string;
  name: string;
  rating: number;
  cases: number;
  years: number;
  about: string;
  location: string;
  education: string;
  experience: string;
  contacts: Contact[];
  profilePic: string;
  isRequestSent: boolean;
  isConnected: boolean;
}

export default function VendorProfile() {
  const { userId } = useParams(); // Vendor ID from URL
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { fetchData } = useApi();

  useEffect(() => {
    const fetchVendorDetails = async () => {
      if (!userId) {
        console.error("Vendor ID is undefined! Check the URL structure.");
        setError("Vendor ID is undefined");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchData<unknown, any>(userApi.getUser(userId), 'GET');

        // Fetch contact details for each contact id in data.contacts
        const contacts = await Promise.all(
          data.contacts.map(async (contactId: string) => {
            try {
              const contactData = await fetchData<unknown, any>(userApi.getUser(contactId), 'GET');
              return {
                _id: contactId,
                name: `${contactData.firstname} ${contactData.lastname}`,
                profilePic: contactData.profilePic || "",
              };
            } catch (err) {
              // if fails, return minimal data
              return { _id: contactId, name: "Unknown", profilePic: "" };
            }
          })
        );

        setVendor({
          _id: data._id,
          name: `${data.firstname} ${data.middlename ? data.middlename + " " : ""}${data.lastname}`,
          rating: data.rating?.length
            ? data.rating.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / data.rating.length
            : 0,
          cases: data.noOfCases || 0,
          years: data.yearsOfExperience || 0,
          about: data.summary,
          location: data.geoLocation?.city || "Unknown",
          education: data.education || "Not Available",
          experience: `${data.yearsOfExperience || 0} years of experience`,
          contacts: contacts,
          profilePic: data.profilePic || "",
          isRequestSent: data.isRequestSent || false,
          isConnected: data.isConnected || false,
        });

        setIsAdded(data.isRequestSent || false);
        setIsConnected(data.isConnected || false);
      } catch (error: any) {
        console.error("Error fetching vendor details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [userId]);

  const handleAddContact = async () => {
    if (!vendor) return;
    try {
      await fetchData<unknown, any>(userApi.requestConnect(vendor._id), 'PUT');
      setIsAdded(true);
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600 p-8">Loading...</div>;
  }

  if (error || !vendor) {
    return <div className="text-center text-gray-600 p-8">Vendor not found</div>;
  }

  return (
    <div className="min-h-screen bg-cream-200 pt-20 px-4 mb-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-xl shadow-leaf-100/20 overflow-hidden border border-leaf-100">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-leaf-700 via-leaf-800 to-leaf-900 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            <div className="w-32 h-32 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-sm">
              {vendor.profilePic ? (
                <img
                  src={vendor.profilePic}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white/90" strokeWidth={1.5} />
              )}
            </div>
            <div className="space-y-2 text-white">
              <h1 className="text-4xl font-black font-poppins">{vendor.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                  <Star className="w-5 h-5 text-farm-400 fill-farm-400" />
                  <span className="ml-2 font-bold">{vendor.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center font-medium opacity-90">
                  <MapPin className="w-5 h-5 mr-1" />
                  {vendor.location}
                </div>
              </div>
            </div>
            <button
              onClick={handleAddContact}
              disabled={isAdded || isConnected}
              className={`ml-auto flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${isConnected
                  ? "bg-leaf-600 text-white cursor-not-allowed"
                  : isAdded
                    ? "bg-leaf-100 text-leaf-700 border border-leaf-200 cursor-not-allowed"
                    : "bg-white text-leaf-700 hover:bg-leaf-50 active:bg-leaf-100"
                }`}
            >
              {isConnected ? "Connected" : isAdded ? "Request Sent" : "Add to Contacts"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 p-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-leaf-50/30 p-8 rounded-3xl border border-leaf-100 group">
              <h2 className="text-2xl font-bold mb-4 text-leaf-800 font-poppins">About</h2>
              <p className="text-charcoal-700 leading-relaxed font-medium">{vendor.about}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-leaf-50/30 p-8 rounded-3xl border border-leaf-100">
                <h3 className="text-xl font-bold mb-4 text-leaf-800 font-poppins">Experience</h3>
                <p className="text-charcoal-700 font-medium">{vendor.experience}</p>
              </div>
              <div className="bg-leaf-50/30 p-8 rounded-3xl border border-leaf-100">
                <h3 className="text-xl font-bold mb-4 text-leaf-800 font-poppins">Education</h3>
                <div className="space-y-2">
                  {Array.isArray(vendor.education) ? (
                    vendor.education.map((edu, index) => (
                      <p key={edu._id || index} className="text-charcoal-700 font-medium border-l-4 border-leaf-500 pl-3">
                        {edu.institute}
                      </p>
                    ))
                  ) : (
                    <p className="text-charcoal-700 font-medium border-l-4 border-leaf-500 pl-3">{vendor.education}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-leaf-50/30 p-8 rounded-3xl border border-leaf-100">
              <h3 className="text-xl font-bold mb-6 text-leaf-800 font-poppins">Orders Statistics</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-600 font-medium">Total Orders</span>
                  <span className="text-xl font-black text-farm-600">
                    {vendor.cases}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-600 font-medium">Experience</span>
                  <span className="text-xl font-black text-farm-600">
                    {vendor.years} Yrs
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-leaf-100">
                  <span className="text-charcoal-600 font-medium">Success Rate</span>
                  <span className="text-xl font-black text-leaf-600">
                    {(vendor.rating * 20).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-leaf-100 shadow-lg shadow-leaf-100/10">
              <h3 className="text-xl font-bold mb-6 text-leaf-800 font-poppins">Contacts</h3>
              <ul className="space-y-4">
                {vendor.contacts.length === 0 ? (
                  <li className="text-gray-400 text-center py-4 bg-leaf-50/20 rounded-2xl border border-dashed border-leaf-200">
                    No contacts found
                  </li>
                ) : (
                  vendor.contacts.map(contact => (
                    <li
                      key={contact._id}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-leaf-50 transition-all border border-transparent hover:border-leaf-100 group cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-leaf-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-leaf-200 group-hover:border-leaf-300 transition-colors">
                        {contact.profilePic ? (
                          <img src={contact.profilePic} alt={contact.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-leaf-500" />
                        )}
                      </div>
                      <span className="text-charcoal-700 font-bold group-hover:text-leaf-700 transition-colors">{contact.name}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
