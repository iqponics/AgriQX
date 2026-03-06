import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { adminApi } from '../api/adminApi';
import { Package, User as UserIcon, CheckCircle, XCircle, Clock, ExternalLink, ShieldAlert, Trash2, Eye } from 'lucide-react';
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

interface User {
    _id: string;
    firstname: string;
    lastname: string;
    emailId: string;
    role: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { fetchData, loading } = useApi();
    const { success, error: toastError } = useToast();

    const loadData = async () => {
        try {
            const products = await fetchData<unknown, Product[]>(adminApi.getPendingProducts(), 'GET');
            setPendingProducts(products || []);

            const dashboardStats = await fetchData<unknown, any>(adminApi.getStats(), 'GET');
            setStats(dashboardStats);

            const allUsers = await fetchData<unknown, User[]>(adminApi.getUsers(), 'GET');
            setUsers(allUsers || []);
        } catch (err) {
            console.error("Failed to load admin data:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleVerify = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await fetchData<any, any>(adminApi.verifyProduct(id), 'PATCH', {
                body: { status }
            });
            success(`Product ${status} successfully`);
            setPendingProducts(prev => prev.filter(p => p._id !== id));

            const dashboardStats = await fetchData<unknown, any>(adminApi.getStats(), 'GET');
            setStats(dashboardStats);
        } catch (err) {
            toastError("Failed to update product status");
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await fetchData<any, any>(adminApi.deleteUser(id), 'DELETE');
            success("User deleted successfully");
            setUsers(prev => prev.filter(u => u._id !== id));

            const dashboardStats = await fetchData<unknown, any>(adminApi.getStats(), 'GET');
            setStats(dashboardStats);
        } catch (err) {
            toastError("Failed to delete user");
        }
    };

    const handleUpdateRole = async (id: string, nextRoleStr: string) => {
        try {
            await fetchData<any, any>(adminApi.updateUserRole(id), 'PATCH', {
                body: { role: nextRoleStr.toLowerCase() }
            });
            success(`User role updated to ${nextRoleStr}`);
            setUsers(prev => prev.map(u => u._id === id ? { ...u, role: nextRoleStr.toLowerCase() } : u));
        } catch (err) {
            toastError("Failed to update user role");
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'products' ? 'bg-charcoal-900 text-white shadow-xl shadow-charcoal-900/20' : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        Product Approvals
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'users' ? 'bg-charcoal-900 text-white shadow-xl shadow-charcoal-900/20' : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        User Management
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {activeTab === 'products' ? (
                            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-leaf-100/20 border border-leaf-100 overflow-hidden animate-fade-in">
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
                                        <div className="p-12 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">Loading...</div>
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
                        ) : (
                            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-leaf-100/20 border border-leaf-100 overflow-hidden animate-fade-in">
                                <div className="p-8 border-b border-leaf-50 flex items-center justify-between bg-leaf-50/30">
                                    <h2 className="text-2xl font-black text-charcoal-900 flex items-center gap-3 uppercase tracking-tight">
                                        <UserIcon className="text-blue-600" /> User Directory
                                    </h2>
                                    <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {users.length} Total
                                    </span>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    {loading && users.length === 0 ? (
                                        <div className="p-12 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">Loading Users...</div>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest">User</th>
                                                    <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest">Email</th>
                                                    <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest">Role</th>
                                                    <th className="p-5 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {users.map(user => (
                                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                                        <td className="p-5">
                                                            <div className="font-bold text-charcoal-900">{user.firstname} {user.lastname}</div>
                                                            <div className="text-xs text-gray-400 mt-1">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="p-5 text-sm text-gray-600 font-medium">{user.emailId}</td>
                                                        <td className="p-5">
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                                                                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border cursor-pointer outline-none transition-colors ${user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                                        user.role === 'vendor' ? 'bg-farm-50 text-farm-600 border-farm-100' :
                                                                            'bg-gray-100 text-gray-600 border-gray-200'
                                                                    }`}
                                                            >
                                                                <option value="customer">CUSTOMER</option>
                                                                <option value="vendor">VENDOR</option>
                                                                <option value="admin">ADMIN</option>
                                                            </select>
                                                        </td>
                                                        <td className="p-5 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => setSelectedUser(user)}
                                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(user._id)}
                                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar / Quick Actions */}
                    <div className="space-y-8">
                        <div className="bg-charcoal-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group hover:shadow-leaf-500/10 transition-shadow duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-leaf-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-leaf-500/30 transition-colors"></div>
                            <h3 className="text-xl font-black mb-6 relative z-10 uppercase tracking-tight flex items-center gap-2">
                                <ShieldAlert size={20} className="text-leaf-400" /> Admin Guide
                            </h3>
                            <ul className="space-y-4 relative z-10">
                                <li className="flex items-start gap-4">
                                    <div className="w-7 h-7 rounded-lg bg-leaf-500 text-white flex-shrink-0 flex items-center justify-center text-xs font-black shadow-lg shadow-leaf-500/30">1</div>
                                    <p className="text-sm text-gray-300 font-medium leading-relaxed">Open the <span className="text-leaf-400 font-bold">Traceability Page</span> to verify farm origin and supply chain history.</p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-7 h-7 rounded-lg bg-leaf-500 text-white flex-shrink-0 flex items-center justify-center text-xs font-black shadow-lg shadow-leaf-500/30">2</div>
                                    <p className="text-sm text-gray-300 font-medium leading-relaxed">Assign the <span className="text-leaf-400 font-bold">Vendor Role</span> via User Management to grant marketplace selling permissions.</p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-7 h-7 rounded-lg bg-leaf-500 text-white flex-shrink-0 flex items-center justify-center text-xs font-black shadow-lg shadow-leaf-500/30">3</div>
                                    <p className="text-sm text-gray-300 font-medium leading-relaxed">Approve products to make them visible in the <span className="text-leaf-400 font-bold">Marketplace</span> and activate the QR code.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-xl font-black text-charcoal-900 flex items-center gap-3 uppercase tracking-tight">
                                <UserIcon className="text-leaf-600 w-6 h-6" /> User Details
                            </h2>
                            <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Full Name</h3>
                                <p className="text-lg font-bold text-charcoal-900">{selectedUser.firstname} {selectedUser.lastname}</p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Address</h3>
                                <p className="text-gray-600 font-medium">{selectedUser.emailId}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Role</h3>
                                    <p className="text-charcoal-900 font-bold uppercase text-sm">{selectedUser.role}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Member Since</h3>
                                    <p className="text-charcoal-900 font-bold text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">User ID</h3>
                                <p className="text-xs text-gray-500 font-mono bg-gray-50 p-3 rounded-xl border border-gray-100 break-all">{selectedUser._id}</p>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end">
                            <button onClick={() => setSelectedUser(null)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all shadow-sm">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
