import { useState, useEffect } from "react";
import { Search, ShoppingCart, Filter, Loader2, Scale, DollarSign, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../components/CustomSelect";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts } from "../../store/slices/productSlice";

interface BackendProduct {
    _id: string;
    name: string;
    imageUrl: string;
    description: string;
    category: string;
    weight: {
        value: number;
        unit: string;
    };
    price: number;
    // The slice uses vendorId, but let's keep this compatible with what might be in the component for now
    // or just rely on the 'any' nature if needed, but better to align.
    vendorId?: {
        firstname: string;
        lastname: string;
    };
    farmerId?: {
        firstname: string;
        lastname: string;
    };
}

export default function Shop() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // Relaxing type slightly to avoid conflict between slice Product and local BackendProduct if they differ

    // Redux
    const dispatch = useAppDispatch();
    const { products, loading } = useAppSelector((state) => state.products);

    const categories = ["All", "Vegetables", "Fruits"];

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        const searchLower = search.toLowerCase();
        const categoryLower = category.toLowerCase();

        const filtered = products.filter(p => {
            const name = p.name?.toLowerCase() || "";
            const description = p.description?.toLowerCase() || "";
            const pCategory = p.category?.toLowerCase() || "";

            const matchesSearch =
                name.includes(searchLower) ||
                description.includes(searchLower);

            const matchesCategory =
                category === "All" ||
                pCategory === categoryLower ||
                (pCategory === "" && categoryLower === "vegetables"); // Defaulting missing category to Vegetables

            return matchesSearch && matchesCategory;
        });

        setFilteredProducts(filtered);
    }, [search, category, products]);

    const addToCart = (product: BackendProduct) => {
        try {
            const raw = localStorage.getItem('astro_ecom_cart_v2');
            const cart = raw ? JSON.parse(raw) : [];

            // Mapping for cart compatibility
            const cartItem = {
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.imageUrl,
                unit: product.weight.unit,
                quantity: 1
            };

            const existing = cart.find((it: any) => it.id === product._id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem('astro_ecom_cart_v2', JSON.stringify(cart));
            window.dispatchEvent(new Event('storage'));
            console.log(`Added ${product.name} to cart`);
        } catch (e) {
            console.error("Cart error", e);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-leaf-50 py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-10 md:mb-14">
                    <p className="text-gray-500 font-sans mb-8 text-center md:text-left text-base max-w-2xl">Premium fresh produce delivered from our sustainable farms to your home.</p>

                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center bg-white/40 backdrop-blur-xl p-4 md:p-5 rounded-[2.5rem] border border-leaf-100/50 shadow-2xl shadow-leaf-100/10">
                        <div className="relative flex-[2] w-full group">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full py-4 pl-12 pr-12 bg-white/90 border border-leaf-100/50 rounded-2xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-leaf-500/10 focus:border-leaf-500 transition-all font-sans group-hover:border-leaf-300 text-base"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-600 w-5 h-5 pointer-events-none group-focus-within:scale-110 transition-transform" />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-leaf-600 transition-colors p-1 rounded-full hover:bg-leaf-50"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="flex-1 w-full lg:w-48">
                            <CustomSelect
                                value={category}
                                onChange={setCategory}
                                options={categories.map(cat => ({ value: cat, label: cat }))}
                                placeholder="Category"
                            />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 text-leaf-600 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Harvesting products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/40 border-2 border-dashed border-leaf-100 rounded-3xl backdrop-blur-sm">
                        <Filter className="w-16 h-16 text-leaf-200 mb-4" />
                        <h3 className="text-xl font-bold text-charcoal-700">No products match your filters</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-leaf-100 overflow-hidden shadow-xl shadow-leaf-100/10 hover:shadow-leaf-200/40 transition-all group flex flex-col">
                                <div className="relative h-64 overflow-hidden">
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-leaf-600/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-black text-charcoal-900 leading-tight">{product.name}</h3>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wider mt-1">
                                                <Scale className="w-4 h-4" />
                                                <span>{product.weight.value} {product.weight.unit}</span>
                                            </div>
                                        </div>
                                        <div className="bg-leaf-50 p-2 rounded-2xl border border-leaf-100" title="Link to product origin">
                                            <QRCodeSVG value={`${window.location.origin}/product-details/${product._id}`} size={64} />
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-sm line-clamp-2 mb-8 leading-relaxed font-sans">
                                        {product.description}
                                    </p>

                                    <div className="flex gap-4 mt-auto">
                                        <button
                                            onClick={() => navigate(`/product-details/${product._id}`)}
                                            className="flex-1 bg-leaf-50 hover:bg-leaf-100 text-leaf-700 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all text-xl"
                                        >
                                            <DollarSign className="w-5 h-5" /> {product.price.toFixed(2)}
                                        </button>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="bg-leaf-600 hover:bg-leaf-700 text-white p-4 rounded-2xl shadow-lg shadow-leaf-200 transition-all hover:scale-105 active:scale-95 group/btn"
                                            title="Add to cart"
                                        >
                                            <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
