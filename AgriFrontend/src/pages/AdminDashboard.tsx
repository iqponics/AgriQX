import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { Package, User as UserIcon, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    batchNo: string;
    imageUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    vendorId: {
        firstname: string;
        lastname: string;
    };
    createdAt: string;
}

export default function AdminDashboard() {
    const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState<any>(null);
    const { fetchData, loading } = useApi();
    const { success, error: toastError } = useToast();

    const loadData = async () => {
        try {
            const products = await fetchData<unknown, Product[]>('/admin/products/pending', 'GET');
            setPendingProducts(products || []);

            const dashboardStats = await fetchData<unknown, any>('/admin/stats', 'GET');
            setStats(dashboardStats);
        } catch (err) {
            console.error("Failed to load admin data:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await fetchData<any, any>(`/admin/products/${id}/verify`, 'PATCH', {
                body: { status }
            });
            success(`Product ${status} successfully`);
            setPendingProducts(prev => prev.filter(p => p._id !== id));
            // Reload stats
            const dashboardStats = await fetchData<unknown, any>('/admin/stats', 'GET');
            setStats(dashboardStats);
        } catch (err) {
            toastError("Failed to update product status");
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-poppins">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-charcoal-900 tracking-tight uppercase">Admin Control Center</h1>
                    <p className="text-gray-500 mt-2 font-medium">Verify products, manage users, and monitor platform growth.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        icon={<UserIcon className="w-6 h-6" />}
                        color="leaf"
                    />
                    <StatCard
                        title="Pending Reviews"
                        value={stats?.pendingProductsCount ?? pendingProducts.length}
                        icon={<Clock className="w-6 h-6" />}
                        color="orange"
                    />
                    <StatCard
                        title="Total Products"
                        value={stats?.totalProducts || 0}
                        icon={<Package className="w-6 h-6" />}
                        color="soil"
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Pending Products List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-leaf-100/20 border border-leaf-100 overflow-hidden">
                            <div className="p-8 border-b border-leaf-50 flex items-center justify-between bg-leaf-50/30">
                                <h2 className="text-2xl font-black text-charcoal-900 flex items-center gap-3 uppercase tracking-tight">
                                    <Package className="text-farm-600" /> Pending Verification
                                </h2>
                                <span className="px-4 py-1.5 bg-farm-100 text-farm-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {pendingProducts.length} Needs Review
                                </span>
                            </div>

                            <div className="p-0">
                                {loading && pendingProducts.length === 0 ? (
                                    <div className="p-12 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">Loading seeds...</div>
                                ) : pendingProducts.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <div className="w-20 h-20 bg-leaf-50 text-leaf-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-black text-charcoal-900 uppercase">All Caught Up!</h3>
                                        <p className="text-gray-500 mt-2 font-medium">No products currently awaiting verification.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-leaf-50">
                                        {pendingProducts.map((product) => (
                                            <div key={product._id} className="p-6 hover:bg-leaf-50/20 transition-colors group">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-leaf-100 bg-white group-hover:scale-105 transition-transform shadow-md">
                                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-leaf-600/60">{product.category}</span>
                                                                <span className="w-1 h-1 bg-leaf-200 rounded-full"></span>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-farm-600">Batch {product.batchNo}</span>
                                                            </div>
                                                            <h3 className="text-xl font-black text-charcoal-900 group-hover:text-leaf-600 transition-colors uppercase tracking-tight">{product.name}</h3>
                                                            <p className="text-sm text-gray-500 font-bold">By {product.vendorId.firstname} {product.vendorId.lastname}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <Link
                                                            to={`/product-details/${product._id}`}
                                                            target="_blank"
                                                            className="p-3 bg-white border border-leaf-100 text-leaf-600 rounded-xl hover:bg-leaf-50 transition-all shadow-sm"
                                                            title="View Traceability Details"
                                                        >
                                                            <ExternalLink className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleVerify(product._id, 'approved')}
                                                            className="px-6 py-3 bg-leaf-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-leaf-700 transition-all shadow-lg shadow-leaf-200 flex items-center gap-2"
                                                        >
                                                            <CheckCircle className="w-4 h-4" /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerify(product._id, 'rejected')}
                                                            className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"
                                                        >
                                                            <XCircle className="w-4 h-4" /> Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Quick Actions */}
                    <div className="space-y-8">
                        <div className="bg-charcoal-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-leaf-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-leaf-500/30 transition-colors"></div>
                            <h3 className="text-xl font-black mb-6 relative z-10 uppercase tracking-tight">Admin Guide</h3>
                            <ul className="space-y-4 relative z-10">
                                <li className="flex items-start gap-4">
                                    <div className="w-7 h-7 rounded-lg bg-leaf-500 text-white flex-shrink-0 flex items-center justify-center text-xs font-black shadow-lg shadow-leaf-500/30">1</div>
                                    <p className="text-sm text-gray-300 font-medium leading-relaxed">Open the <span className="text-leaf-400 font-bold">Traceability Page</span> to verify farm origin and supply chain history.</p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-7 h-7 rounded-lg bg-leaf-500 text-white flex-shrink-0 flex items-center justify-center text-xs font-black shadow-lg shadow-leaf-500/30">2</div>
                                    <p className="text-sm text-gray-300 font-medium leading-relaxed">Verify <span className="text-leaf-400 font-bold">Lab Reports</span> and quality standards are met.</p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-7 h-7 rounded-lg bg-leaf-500 text-white flex-shrink-0 flex items-center justify-center text-xs font-black shadow-lg shadow-leaf-500/30">3</div>
                                    <p className="text-sm text-gray-300 font-medium leading-relaxed">Approve to make it visible in the <span className="text-leaf-400 font-bold">Marketplace</span> and activate the QR code.</p>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
        leaf: 'bg-leaf-50 text-leaf-600 border-leaf-100 shadow-leaf-100/20',
        farm: 'bg-farm-50 text-farm-600 border-farm-100 shadow-farm-100/20',
        orange: 'bg-orange-50 text-orange-600 border-orange-100 shadow-orange-100/20',
        soil: 'bg-soil-50 text-soil-600 border-soil-100 shadow-soil-100/20'
    };

    return (
        <div className={`p-6 rounded-[2rem] border bg-white ${colors[color]} border-opacity-50 shadow-xl transition-all hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]} bg-opacity-100 shadow-sm shadow-inner`}>
                    {icon}
                </div>
                <div className="text-4xl font-black tracking-tighter text-charcoal-900">{value}</div>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</h3>
        </div>
    );
}

