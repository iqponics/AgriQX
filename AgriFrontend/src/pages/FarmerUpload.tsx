import { useState, ChangeEvent, FormEvent } from 'react';
import { Upload, MapPin, Calendar, Layers, FileText, Tag, Scale, DollarSign } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomSelect from '../components/CustomSelect';
import { useToast } from '../components/ToastProvider';

export default function VendorUpload() {
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Vegetables',
        weightValue: '',
        weightUnit: 'kg',
        price: '',
        batchNo: '',
        latitude: '',
        longitude: '',
        expiryDate: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validate image type and size (e.g., max 5MB)
            if (!file.type.startsWith('image/')) {
                error('Please upload an image file.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                error('Image size should be less than 5MB.');
                return;
            }
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const getToken = () => {
        return localStorage.getItem('authToken');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            error("Please upload a product image.");
            return;
        }

        // Validate Coordinates
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
            error("Please enter a valid Latitude (-90 to 90)");
            return;
        }
        if (isNaN(lng) || lng < -180 || lng > 180) {
            error("Please enter a valid Longitude (-180 to 180)");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('image', imageFile);
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('weightValue', formData.weightValue);
        data.append('weightUnit', formData.weightUnit);
        data.append('price', formData.price);
        data.append('batchNo', formData.batchNo);
        data.append('latitude', formData.latitude);
        data.append('longitude', formData.longitude);
        data.append('expiryDate', formData.expiryDate);

        try {
            const token = getToken();
            await axios.post(`${API_BASE_URL}/api/products`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            success('Product uploaded successfully!');
            navigate('/farmer/my-products');
        } catch (err: any) {
            console.error('Upload failed:', err);
            const msg = err.response?.data?.message || 'Failed to upload product. Please try again.';
            error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-leaf-50 pt-20 pb-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-leaf-100">
                <div className="bg-leaf-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Upload className="w-6 h-6" />
                        Upload Farm Product
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Tag className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Organic Red Apples"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Product Image</label>
                        <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${previewUrl ? 'border-leaf-500 bg-leaf-50' : 'border-gray-300 hover:border-leaf-400'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {previewUrl ? (
                                <div className="relative h-48 w-full">
                                    <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-md" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-medium opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                        Change Image
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-500">
                                    <Upload className="w-10 h-10 mb-2 text-gray-400" />
                                    <p className="text-sm">Click to upload or drag & drop</p>
                                    <p className="text-xs mt-1 text-gray-400">PNG, JPG, JPEG (MAX. 5MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 text-gray-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-transparent outline-none transition-all min-h-[100px]"
                                placeholder="Describe your fresh produce..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Weight */}
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Scale className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="weightValue"
                                        value={formData.weightValue}
                                        onChange={handleInputChange}
                                        required
                                        step="0.01"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-transparent outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                <CustomSelect
                                    value={formData.weightUnit}
                                    onChange={(val) => setFormData(prev => ({ ...prev, weightUnit: val }))}
                                    options={[
                                        { value: 'kg', label: 'kg' },
                                        { value: 'g', label: 'g' },
                                        { value: 'lbs', label: 'lbs' },
                                        { value: 'ton', label: 'ton' }
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    step="0.01"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-transparent outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Expiry Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                </div>
                                <CustomDatePicker
                                    selected={formData.expiryDate}
                                    onChange={(date) => handleDateChange('expiryDate', date)}
                                    placeholderText="Select Expiry Date"
                                />
                            </div>
                        </div>

                        {/* Batch Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Layers className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="batchNo"
                                    value={formData.batchNo}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. BATCH-001"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Origin Location */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Origin Coordinates</label>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                    required
                                    step="0.000001"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Latitude"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleInputChange}
                                    required
                                    step="0.000001"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Longitude"
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 italic">Enter GPS coordinates of the farm for the origin map marker.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-95 ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-leaf-600 to-leaf-500 hover:from-leaf-700 hover:to-leaf-600 hover:shadow-leaf-200'
                            }`}
                    >
                        {loading ? 'Uploading...' : 'Upload Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}
