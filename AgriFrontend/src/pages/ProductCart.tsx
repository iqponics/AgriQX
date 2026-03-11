import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { ShoppingBag, Trash2, ArrowLeft, Loader2, Edit3, Layers, Upload, ShieldCheck, CheckCircle, Map } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { useToast } from '../components/ToastProvider';
import ConfirmationModal from '../components/ConfirmationModal';

interface Product {
    _id: string;
    name: string;
    imageUrl: string;
    description: string;
    category: string;
    weight: { value: number; unit: string; };
    price: number;
    batchNo: string;
    expiryDate: string;
    origin: { latitude: number; longitude: number; };
    farmDetails?: any;
    cultivation?: any;
    harvest?: any;
    processing?: any;
    qualityTest?: any;
    logistics?: any;
    distribution?: any;
    vendorId?: string;
    status: 'pending' | 'approved' | 'rejected';
    blockchainVerificationUrl?: string;
}

export default function ProductCart() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const fetchMyProducts = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/api/products/my-products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyProducts(); }, []);

    const confirmDelete = (id: string) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        const id = productToDelete;
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.filter(p => p._id !== id));
            success('Product deleted successfully');
        } catch (err) {
            error('Failed to delete product');
        } finally {
            setProductToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-leaf-50"><Loader2 className="w-12 h-12 text-leaf-600 animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-leaf-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div>
                        <Link to="/home" className="inline-flex items-center text-leaf-600 font-bold mb-4 hover:translate-x-1 transition-transform group">
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-black text-charcoal-900 font-poppins">Vendor Inventory</h1>
                        <p className="text-gray-500 mt-2 font-sans font-medium">Manage your products and track their journey.</p>
                    </div>
                    <button
                        onClick={() => navigate('/vendor/product-lifecycle')}
                        className="bg-leaf-600 hover:bg-leaf-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-leaf-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Upload className="w-5 h-5" /> Add New Product
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/40 border-2 border-dashed border-leaf-200 rounded-[3rem] backdrop-blur-sm">
                        <ShoppingBag className="w-20 h-20 text-leaf-200 mb-6" />
                        <h2 className="text-2xl font-bold text-charcoal-700 mb-2 text-center uppercase tracking-tight">no products add products</h2>
                        <p className="text-gray-500 mb-8 font-sans">Start by adding your first product record.</p>
                        <button
                            onClick={() => navigate('/vendor/product-lifecycle')}
                            className="bg-leaf-600 hover:bg-leaf-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-leaf-200 transition-all hover:scale-105 flex items-center gap-2"
                        >
                            <Upload className="w-5 h-5" /> Add Product
                        </button>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-leaf-100 overflow-hidden shadow-xl shadow-leaf-100/10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-leaf-50/50 border-b border-leaf-100">
                                        <th className="px-6 py-5 text-xs font-black text-leaf-800 uppercase tracking-widest">Product Batch</th>
                                        <th className="px-6 py-5 text-xs font-black text-leaf-800 uppercase tracking-widest">Supply Chain Status</th>
                                        <th className="px-6 py-5 text-xs font-black text-leaf-800 uppercase tracking-widest">Org/Certified</th>
                                        <th className="px-6 py-5 text-xs font-black text-leaf-800 uppercase tracking-widest text-center">Lifecycle QR</th>
                                        <th className="px-6 py-5 text-xs font-black text-leaf-800 uppercase tracking-widest text-center">Admin Status</th>
                                        <th className="px-6 py-5 text-xs font-black text-leaf-800 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-leaf-50">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-leaf-50/30 transition-colors group">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-leaf-100 flex-shrink-0">
                                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-black text-charcoal-900 text-base">{product.name}</h4>
                                                            {product.blockchainVerificationUrl && (
                                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100 text-[8px] font-black uppercase tracking-tighter" title="Verified on Blockchain">
                                                                    <ShieldCheck className="w-2.5 h-2.5" /> BC
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                            <Layers className="w-3 h-3" /> {product.batchNo}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${product.distribution?.distributionId ? 'bg-green-500 animate-pulse' : 'bg-orange-400'}`}></span>
                                                    <span className="text-xs font-bold text-gray-600 capitalize">
                                                        {product.distribution?.distributionId ? 'Distributed' : product.processing?.processingId ? 'Processed' : 'Cultivating'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex gap-2">
                                                    {product.farmDetails?.isOrganic && <ShieldCheck className="w-5 h-5 text-leaf-600" />}
                                                    {product.farmDetails?.certification && <CheckCircle className="w-5 h-5 text-blue-500" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex justify-center">
                                                    <div className="p-1 px-3 bg-white rounded-xl border border-leaf-100 shadow-sm flex items-center gap-2">
                                                        <QRCodeSVG value={`${window.location.origin}/product-details/${product._id}`} size={32} />
                                                        <span className="text-[10px] font-black uppercase text-leaf-800">Scan for lifecycle</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                    product.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {product.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => navigate(`/product-details/${product._id}`)} className="p-2 text-leaf-600 hover:bg-leaf-50 rounded-xl transition-all" title="View Public Traceability"><Map className="w-5 h-5" /></button>
                                                    <button onClick={() => navigate(`/vendor/product-lifecycle/${product._id}`)} className="p-2 text-leaf-600 hover:bg-leaf-50 rounded-xl transition-all" title="Edit Lifecycle"><Edit3 className="w-5 h-5" /></button>
                                                    <button onClick={() => confirmDelete(product._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all" title="Delete Batch"><Trash2 className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setProductToDelete(null);
                    }}
                    onConfirm={handleDelete}
                    title="Delete Product?"
                    message="Are you sure you want to remove this product batch? This action cannot be undone."
                    confirmText="Delete Product"
                    variant="danger"
                />
            </div>
        </div>
    );
}
