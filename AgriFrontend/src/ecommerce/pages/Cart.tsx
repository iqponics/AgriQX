import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CreditCard } from "lucide-react";

export default function Cart() {
    const [items, setItems] = useState<any[]>([]);

    const loadCart = () => {
        try {
            const raw = localStorage.getItem('astro_ecom_cart_v2');
            setItems(raw ? JSON.parse(raw) : []);
        } catch (e) {
            setItems([]);
        }
    };

    useEffect(() => {
        loadCart();
        window.addEventListener('storage', loadCart);
        return () => window.removeEventListener('storage', loadCart);
    }, []);

    const updateQuantity = (id: string, delta: number) => {
        const updated = items.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setItems(updated);
        localStorage.setItem('astro_ecom_cart_v2', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
    };

    const removeItem = (id: string) => {
        const updated = items.filter(it => it.id !== id);
        setItems(updated);
        localStorage.setItem('astro_ecom_cart_v2', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
    };

    const subtotal = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const delivery = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + delivery;

    return (
        <div className="min-h-screen bg-gradient-to-br from-leaf-50 via-white to-leaf-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link to="/ecommerce" className="inline-flex items-center text-leaf-600 font-bold mb-8 hover:translate-x-1 transition-transform group">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Shop
                </Link>

                <h1 className="text-4xl font-bold text-charcoal-900 font-poppins mb-12">Your Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/40 border-2 border-dashed border-leaf-200 rounded-[3rem] backdrop-blur-sm">
                        <ShoppingBag className="w-20 h-20 text-leaf-200 mb-6" />
                        <h2 className="text-2xl font-bold text-charcoal-700 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 font-sans">Looks like you haven't added any fresh produce yet.</p>
                        <Link to="/ecommerce" className="bg-leaf-600 hover:bg-leaf-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-leaf-200 transition-all hover:scale-105 active:scale-95">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-leaf-100 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-leaf-100/10 hover:shadow-leaf-200/20 transition-all">
                                    <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-leaf-50">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <span className="text-[10px] font-bold text-leaf-600 uppercase tracking-widest bg-leaf-50 px-2 py-0.5 rounded-full border border-leaf-100">{item.category}</span>
                                        <h3 className="text-xl font-bold text-charcoal-900 mt-1">{item.name}</h3>
                                        <p className="text-gray-400 text-sm font-sans mb-2">${item.price.toFixed(2)} per {item.unit}</p>

                                        <div className="flex items-center justify-center sm:justify-start gap-4">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-2 rounded-xl bg-leaf-50 hover:bg-leaf-100 text-leaf-600 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-lg font-black text-charcoal-800 w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-2 rounded-xl bg-leaf-50 hover:bg-leaf-100 text-leaf-600 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center sm:items-end gap-2">
                                        <span className="text-2xl font-black text-leaf-700">${(item.price * item.quantity).toFixed(2)}</span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-3 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-leaf-100 shadow-2xl shadow-leaf-200/40 sticky top-28">
                            <h2 className="text-2xl font-bold text-charcoal-900 mb-8 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 text-leaf-600" /> Summary
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Delivery Fee</span>
                                    <span>${delivery.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 border-t border-leaf-50 flex justify-between">
                                    <span className="text-xl font-bold text-charcoal-900">Total Price</span>
                                    <span className="text-2xl font-black text-leaf-700">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-leaf-600 hover:bg-leaf-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-leaf-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
                                Complete Checkout
                            </button>

                            <div className="mt-8 pt-8 border-t border-leaf-50 text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                    Trusted Payment System • Secure Farm Logistics<br />
                                    <div className="flex justify-center mt-2">
                                        <img src="/IQponics-removebg.png" alt="IQponics" className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
