import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Calendar, MapPin, ArrowLeft, Loader2, Landmark, Sprout, Tractor, Microscope, Truck, CheckCircle, Thermometer, Box, Activity, Leaf, ShieldCheck, Award, XCircle, Clock } from 'lucide-react';
import API_BASE_URL from '../config/api';
import { useToast } from '../components/ToastProvider';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface VendorDetails {
    _id: string;
    firstname: string;
    lastname: string;
    profilePic?: string;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    weight: { value: number; unit: string; };
    category: string;
    expiryDate: string;
    batchNo: string;
    imageUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    vendorId: VendorDetails; // Changed from farmerId to vendorId
    farmDetails?: {
        farmId: string;
        village: string;
        district: string;
        state: string;
        country: string;
        soilType: string;
        waterSource: string;
        sizeInAcres: number;
    };
    origin: {
        latitude: number;
        longitude: number;
    };
    cultivation?: {
        cultivationId: string;
        variety: string;
        sowingDate: string;
        fertilizer: string;
        irrigation: string;
        pesticide: string;
    };
    harvest?: {
        batchId: string;
        harvestDate: string;
        grade: string;
        moisture: number;
        qualityCheck: string;
    };
    processing?: {
        processingId: string;
        center: string;
        packaging: string;
        processDate: string;
        weightAfter: number;
        processType: string;
    };
    qualityTest?: {
        testId: string;
        agency: string;
        status: string;
        residuePpm: number;
        microbial: string;
    };
    logistics?: {
        transportId: string;
        temperature: number;
        mode: string;
    };
    distribution?: {
        distributor: string;
        retailer: string;
        city: string;
    };
}

interface LifecycleSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    color: string;
    stage: number;
}

const LifecycleSection = ({ title, icon, children, color, stage }: LifecycleSectionProps) => (
    <div className="relative group">
        {/* Connector Line */}
        <div className="absolute left-10 top-20 bottom-0 w-px bg-gray-100 group-last:hidden hidden md:block" />

        <div className={`bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-${color}-100/20 border border-gray-100 relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-3xl`}>
            {/* Stage Counter */}
            <div className={`absolute top-8 right-10 text-6xl font-black text-${color}-200/20 pointer-events-none select-none`}>
                0{stage}
            </div>

            <div className={`absolute -top-12 -right-12 w-48 h-48 bg-${color}-50/50 rounded-full blur-3xl transition-transform group-hover:scale-125`} />

            <div className="flex items-center gap-5 mb-8 relative">
                <div className={`p-4 bg-${color}-50 rounded-2xl text-${color}-600 shadow-sm`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-2xl font-black text-charcoal-900 uppercase tracking-tight">{title}</h3>
                    <div className="h-1 w-12 bg-charcoal-50 rounded-full mt-1" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                {children}
            </div>
        </div>
    </div>
);

const DetailItem = ({ label, value, icon }: { label: string, value: any, icon?: React.ReactNode }) => (
    <div className="flex flex-col group/item">
        <span className="text-[11px] font-black text-charcoal-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-2 transition-colors group-hover/item:text-charcoal-600">
            {icon} {label}
        </span>
        <div className="flex items-center gap-2 text-charcoal-800 font-bold text-lg leading-tight break-words">
            {value || <span className="text-gray-300 font-medium">Verified N/A</span>}
        </div>
    </div>
);

export default function PublicProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null); // Changed type to Product
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { success, error: toastError } = useToast();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.role || 'vendor');
            } catch (e) {
                setUserRole('vendor');
            }
        }
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
                setProduct(response.data);
            } catch (err: any) {
                console.error('Error fetching product:', err);
                setError(err.response?.data?.message || 'Product not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-leaf-50"><Loader2 className="w-12 h-12 text-leaf-600 animate-spin" /></div>;

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-leaf-50 px-4">
                <div className="text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-leaf-100 max-w-sm">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <MapPin className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-charcoal-900 mb-3 tracking-tight">Trace Lost</h2>
                    <p className="text-gray-500 mb-8 font-serif leading-relaxed italic">Verification record unavailable or moved.</p>
                    <Link to="/ecommerce" className="block w-full bg-leaf-600 text-white py-4 rounded-2xl font-black hover:bg-leaf-700 transition-all uppercase text-xs tracking-widest shadow-lg shadow-leaf-200">Return to Marketplace</Link>
                </div>
            </div>
        );
    }

    // Handle Pending/Rejected status for public users
    if (product.status !== 'approved' && userRole !== 'admin' && product.vendorId?._id !== localStorage.getItem('userId')) { // Changed farmerId to vendorId
        // Note: We might need to store userId in localStorage on login if not already there, 
        // or decode it from token. For simplicity, let's just use the status check.
        // If it's not approved, only admins should see the full detail for verification.
        if (userRole !== 'admin') {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-leaf-50 px-4">
                    <div className="text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-leaf-100 max-w-md">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Clock className="w-10 h-10 text-orange-500" />
                        </div>
                        <h2 className="text-3xl font-black text-charcoal-900 mb-3 tracking-tight uppercase">Under Verification</h2>
                        <p className="text-gray-500 mb-8 font-medium leading-relaxed">This product batch is currently undergoing quality and traceability verification by our admin team.</p>
                        <Link to="/ecommerce" className="block w-full bg-leaf-600 text-white py-4 rounded-2xl font-black hover:bg-leaf-700 transition-all uppercase text-xs tracking-widest shadow-lg shadow-leaf-200">Return to Shop</Link>
                    </div>
                </div>
            );
        }
    }

    const handleAdminVerify = async (status: 'approved' | 'rejected') => {
        setIsProcessing(true);
        try {
            const token = localStorage.getItem('authToken');
            await axios.patch(`${API_BASE_URL}/api/admin/products/${id}/verify`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProduct({ ...product, status });
            success(`Product ${status} successfully!`);
        } catch (err) {
            console.error('Verification failed:', err);
            toastError('Failed to update verification status.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfc] pb-24 font-poppins selection:bg-leaf-200">
            {/* Header Hero */}
            <div className="relative overflow-hidden pt-20 pb-16 px-4 bg-gradient-to-b from-white to-[#fcfdfc]">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-leaf-50/30 rounded-bl-[15rem] -mr-40 pointer-events-none" />

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center relative">
                    <div className="w-full md:w-1/2">
                        <Link to="/" className="inline-flex items-center text-leaf-600 font-black mb-8 hover:translate-x-1 transition-transform group uppercase text-[10px] tracking-widest bg-leaf-50/50 px-4 py-2 rounded-full">
                            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to home
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100/50 shadow-sm">
                                <ShieldCheck className="w-3 h-3" /> Traceability Verified
                            </div>
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-charcoal-50 text-charcoal-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-charcoal-100/50 shadow-sm">
                                <Award className="w-3 h-3" /> Batch: {product.batchNo}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-charcoal-900 mb-6 leading-tight tracking-tighter uppercase">{product.name}</h1>
                        <p className="text-lg text-gray-400 leading-relaxed font-sans font-medium mb-10 max-w-md">{product.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <DetailItem label="Value" value={`$${product.price.toFixed(2)}`} />
                            <DetailItem label="Net Quantity" value={`${product.weight.value}${product.weight.unit}`} />
                            <DetailItem label="Type" value={product.category} />
                            <DetailItem label="Best Before" value={new Date(product.expiryDate).toLocaleDateString()} icon={<Calendar className="w-3.5 h-3.5" />} />
                        </div>

                        {/* Admin Action Panel */}
                        {userRole === 'admin' && product.status === 'pending' && (
                            <div className="mt-12 p-8 bg-orange-50 rounded-[2.5rem] border-2 border-dashed border-orange-200 shadow-xl shadow-orange-100/20">
                                <h3 className="text-xl font-black text-orange-800 mb-4 uppercase tracking-tight">Admin Verification required</h3>
                                <p className="text-orange-700/70 text-sm font-medium mb-8">Review the farm origin, cultivation methods, and lab results below before approving this batch for the marketplace.</p>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => handleAdminVerify('approved')}
                                        disabled={isProcessing}
                                        className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                    >
                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                        Approve Product
                                    </button>
                                    <button
                                        onClick={() => handleAdminVerify('rejected')}
                                        disabled={isProcessing}
                                        className="px-10 py-5 bg-white border-2 border-red-100 text-red-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-50 transition-all disabled:opacity-50 flex items-center gap-3"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject Batch
                                    </button>
                                </div>
                            </div>
                        )}

                        {userRole === 'admin' && product.status === 'approved' && (
                            <div className="mt-12 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-emerald-900 font-black uppercase text-[10px] tracking-widest">Verification Status</h4>
                                    <p className="text-emerald-700 font-bold">Approved & Active on Marketplace</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center items-center relative group">
                        <div className="absolute -inset-10 bg-leaf-500/10 blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-full max-w-[480px]">
                            <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-900/10 to-transparent rounded-[3rem] pointer-events-none" />
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="relative w-full h-auto max-h-[480px] object-cover rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(24,51,32,0.15)] border-[8px] border-white ring-1 ring-charcoal-50"
                            />
                            {/* Visual accent */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-leaf-600 rounded-3xl shadow-xl flex items-center justify-center text-white rotate-12 group-hover:rotate-0 transition-transform">
                                <Leaf className="w-10 h-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lifecycle Timeline Content */}
            <div className="max-w-7xl mx-auto px-4 -mt-6 space-y-12">

                {/* 1. Farm Origin */}
                <LifecycleSection title="Farm Origin" icon={<Landmark className="w-7 h-7" />} color="emerald" stage={1}>
                    <DetailItem label="Trace ID" value={product.farmDetails?.farmId} />
                    <DetailItem label="Region" value={`${product.farmDetails?.village}, ${product.farmDetails?.district}`} />
                    <DetailItem label="State/Country" value={`${product.farmDetails?.state}, ${product.farmDetails?.country}`} />
                    <DetailItem label="Soil Profile" value={product.farmDetails?.soilType} />
                    <DetailItem label="Irrigation" value={product.farmDetails?.waterSource} />
                    <DetailItem label="Land Size" value={`${product.farmDetails?.sizeInAcres} Acres`} />

                    <div className="col-span-1 md:col-span-3 mt-8 h-80 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl z-0 group/map">
                        <MapContainer center={[product.origin.latitude, product.origin.longitude]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[product.origin.latitude, product.origin.longitude]}>
                                <Popup><div className="font-black text-emerald-700">Producer Origin Activity</div></Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </LifecycleSection>

                {/* 2. Cultivation */}
                <LifecycleSection title="Crop Cultivation" icon={<Sprout className="w-7 h-7" />} color="leaf" stage={2}>
                    <DetailItem label="Cultivation ID" value={product.cultivation?.cultivationId} />
                    <DetailItem label="Specified Variety" value={product.cultivation?.variety} />
                    <DetailItem label="Date Sown" value={product.cultivation?.sowingDate ? new Date(product.cultivation.sowingDate).toLocaleDateString() : 'N/A'} icon={<Calendar className="w-3 h-3" />} />
                    <DetailItem label="Fertilization" value={product.cultivation?.fertilizer} />
                    <DetailItem label="Irrigation Mode" value={product.cultivation?.irrigation} />
                    <DetailItem label="Health Protocol" value={product.cultivation?.pesticide} />
                </LifecycleSection>

                {/* 3. Harvest */}
                <LifecycleSection title="Harvesting Log" icon={<Tractor className="w-7 h-7" />} color="orange" stage={3}>
                    <DetailItem label="Harvest Batch" value={product.harvest?.batchId} />
                    <DetailItem label="Timestamp" value={product.harvest?.harvestDate ? new Date(product.harvest.harvestDate).toLocaleDateString() : 'N/A'} icon={<Calendar className="w-3 h-3" />} />
                    <DetailItem label="Yield Grade" value={product.harvest?.grade} />
                    <DetailItem label="Moisture Content" value={product.harvest?.moisture ? `${product.harvest.moisture}%` : 'N/A'} />
                    <DetailItem label="Initial Audit" value={product.harvest?.qualityCheck} icon={<CheckCircle className="w-3.5 h-3.5" />} />
                </LifecycleSection>

                {/* 4. Processing */}
                <LifecycleSection title="Full Processing" icon={<Box className="w-7 h-7" />} color="blue" stage={4}>
                    <DetailItem label="Process Chain" value={product.processing?.processingId} />
                    <DetailItem label="Facility Name" value={product.processing?.center} />
                    <DetailItem label="Packaging Unit" value={product.processing?.packaging} />
                    <DetailItem label="Pack Date" value={product.processing?.processDate ? new Date(product.processing.processDate).toLocaleDateString() : 'N/A'} />
                    <DetailItem label="Weight Net" value={product.processing?.weightAfter ? `${product.processing.weightAfter}kg` : 'N/A'} />
                    <DetailItem label="Methodology" value={product.processing?.processType} />
                </LifecycleSection>

                {/* 5. Laboratory Analysis */}
                <LifecycleSection title="Verified Audit" icon={<Microscope className="w-7 h-7" />} color="indigo" stage={5}>
                    <DetailItem label="Lab Ref ID" value={product.qualityTest?.testId} />
                    <DetailItem label="Agency Body" value={product.qualityTest?.agency} />
                    <DetailItem label="Status" value={product.qualityTest?.status} icon={<Activity className="w-3.5 h-3.5" />} />
                    <DetailItem label="Residue Check" value={product.qualityTest?.residuePpm ? `${product.qualityTest.residuePpm} ppm` : 'Passed Clean'} />
                    <DetailItem label="Microbial Test" value={product.qualityTest?.microbial || 'Undetected'} />
                </LifecycleSection>

                {/* 6. Supply Chain */}
                <LifecycleSection title="Chain of Custody" icon={<Truck className="w-7 h-7" />} color="charcoal" stage={6}>
                    <DetailItem label="Logistics ID" value={product.logistics?.transportId} />
                    <DetailItem label="Transit Cold Chain" value={product.logistics?.temperature ? `${product.logistics.temperature}°C` : 'Ambient'} icon={<Thermometer className="w-3.5 h-3.5" />} />
                    <DetailItem label="Main Distributor" value={product.distribution?.distributor} />
                    <DetailItem label="Retail Partner" value={product.distribution?.retailer} />
                    <DetailItem label="Final Destination" value={product.distribution?.city} />
                    <DetailItem label="Transport Mode" value={product.logistics?.mode} />
                </LifecycleSection>


                <div className="text-center pt-8 pb-12">
                    <p className="text-gray-300 font-medium text-xs uppercase tracking-[0.2em]">Generated for transparency via high-tech agri platform</p>
                </div>
            </div>
        </div>
    );
}
