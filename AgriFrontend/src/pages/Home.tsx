import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Star, MapPin, ShoppingCart, Leaf } from "lucide-react";
import CustomSelect from "../components/CustomSelect";
import { useDebounce } from "../hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchVendors } from "../store/slices/vendorSlice";


export default function Home() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sortOption, setSortOption] = useState("none");

  const dispatch = useAppDispatch();
  const { vendors: rawPartners, loading } = useAppSelector((state) => state.vendors);

  // Debounce search and location inputs to prevent excessive filtering while typing
  const debouncedSearch = useDebounce(search, 500);
  const debouncedLocation = useDebounce(location, 500);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const partners = useMemo(() => {
    let filtered = rawPartners.filter(p => {
      const fullName = `${p.firstname} ${p.lastname}`.toLowerCase();
      const summary = (p.summary || "").toLowerCase();
      const city = (p.geoLocation?.city || "").toLowerCase();

      // Use debounced values for filtering
      const matchesSearch = fullName.includes(debouncedSearch.toLowerCase()) ||
        summary.includes(debouncedSearch.toLowerCase());
      const matchesLocation = city.includes(debouncedLocation.toLowerCase());
      const isVendor = (p.role === 'vendor') || (p.lawyerType || "").toLowerCase() === "farmer";

      return matchesSearch && matchesLocation && isVendor;
    });

    // Helper for rating calculation
    const getAvgRating = (ratings: any[]) => {
      if (!ratings || ratings.length === 0) return 0;
      const sum = ratings.reduce((acc, r) => acc + (r.rating || 0), 0);
      return parseFloat((sum / ratings.length).toFixed(1));
    };

    if (sortOption === "ratingHighToLow") {
      filtered = [...filtered].sort((a, b) => getAvgRating(b.rating) - getAvgRating(a.rating));
    } else if (sortOption === "popularity") {
      filtered = [...filtered].sort((a, b) => (b.noOfCases || 0) - (a.noOfCases || 0));
    } else if (sortOption === "experience") {
      filtered = [...filtered].sort((a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0));
    }

    return filtered;
  }, [rawPartners, debouncedSearch, debouncedLocation, sortOption]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-leaf-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header Section */}
        <div className="mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-charcoal-900 font-poppins mb-2 text-center md:text-left">Marketplace Hub</h1>
          <p className="text-gray-500 font-sans mb-8 text-center md:text-left">Connect with certified partners and explore fresh sustainable produce.</p>

          <div className="bg-white/50 backdrop-blur-md p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] border border-leaf-100 shadow-2xl shadow-leaf-100/10 space-y-4 md:space-y-0">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/80 border border-leaf-100 rounded-2xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 transition-all font-sans group-hover:border-leaf-300"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-600 w-5 h-5 group-focus-within:scale-110 transition-transform" />
              </div>
              <div className="relative flex-[2] group">
                <input
                  type="text"
                  placeholder="Search partners or products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/80 border border-leaf-100 rounded-2xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 transition-all font-sans group-hover:border-leaf-300"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-600 w-5 h-5 group-focus-within:scale-110 transition-transform" />
              </div>
              <div className="flex-1 relative group z-20">
                <CustomSelect
                  options={[
                    { value: "none", label: "Sort Options" },
                    { value: "ratingHighToLow", label: "Top Rated" },
                    { value: "popularity", label: "Most Popular" },
                    { value: "experience", label: "Years Experience" },
                  ]}
                  value={sortOption}
                  onChange={(val) => setSortOption(val)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-charcoal-900 font-poppins">Featured Partners</h2>
          <span className="bg-leaf-100/50 text-leaf-700 px-4 py-1.5 rounded-full text-sm font-bold border border-leaf-200">
            {partners.length} {partners.length === 1 ? 'partner' : 'partners'} near you
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-leaf-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-leaf-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-500 font-medium">Cultivating your marketplace...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/40 border-2 border-dashed border-leaf-100 rounded-3xl backdrop-blur-sm">
            <Search className="w-16 h-16 text-leaf-200 mb-4" />
            <h3 className="text-xl font-bold text-charcoal-700">No partners found</h3>
            <p className="text-gray-500">Try adjusting your search filters or location.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner) => (
              <div
                key={partner._id}
                className="bg-white p-6 rounded-[2rem] border border-leaf-100 hover:border-leaf-300 shadow-lg shadow-leaf-100/10 hover:shadow-2xl hover:shadow-leaf-200/40 transition-all duration-500 group relative overflow-hidden flex flex-col"
              >
                {/* Background Decor */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-leaf-50 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 pointer-events-none"></div>

                <div className="flex items-start justify-between mb-6 relative">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-leaf-100 shadow-xl group-hover:border-leaf-300 transition-all duration-500 ring-4 ring-transparent group-hover:ring-leaf-50">
                      <img
                        src={partner.profilePic || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=200"}
                        alt={`${partner.firstname} ${partner.lastname}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-charcoal-900 group-hover:text-leaf-800 transition-colors leading-tight mb-1">
                        {partner.firstname} {partner.lastname}
                      </h3>
                      <div className="flex items-center">
                        <div className="flex text-leaf-500 mr-2">
                          {[...Array(5)].map((_, i) => {
                            const avgRating = partner.rating?.length ?
                              partner.rating.reduce((acc: any, r: any) => acc + (r.rating || 0), 0) / partner.rating.length : 0;
                            return (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(avgRating) ? 'fill-leaf-500' : 'text-gray-200'}`} />
                            )
                          })}
                        </div>
                        <span className="text-sm font-bold text-charcoal-700">
                          {partner.rating?.length ? (partner.rating.reduce((acc: any, r: any) => acc + (r.rating || 0), 0) / partner.rating.length).toFixed(1) : "0.0"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-leaf-50 text-leaf-700 border-leaf-100`}>
                    Vendor
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 relative">
                  <div className="flex items-center gap-3 p-3 bg-leaf-50/50 rounded-2xl border border-leaf-100 group-hover:border-leaf-200 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-leaf-600 border border-leaf-100">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-charcoal-900">{partner.noOfCases || 0}+</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Orders</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-leaf-50/50 rounded-2xl border border-leaf-100 group-hover:border-leaf-200 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-leaf-600 border border-leaf-100">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-charcoal-900">{partner.yearsOfExperience || 0} Yrs</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Experience</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed font-sans relative">
                  {partner.summary}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-leaf-50 relative">
                  <p className="text-charcoal-600 text-sm font-semibold flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-leaf-600" /> {partner.geoLocation?.city || "Remote"}
                  </p>
                  <Link
                    to={`/lawyer/${partner._id}`}
                    className="bg-leaf-600 hover:bg-leaf-700 text-white py-2.5 px-6 rounded-xl text-sm font-bold transition-all shadow-lg shadow-leaf-100/50 group-hover:shadow-leaf-500/20 active:scale-95"
                  >
                    View Store
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

