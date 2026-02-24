import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Tag, Landmark, Sprout, Tractor, Box, Microscope, Truck, Store,
    ArrowLeft, Loader2, Upload, ShieldCheck, CheckCircle
} from 'lucide-react';
import API_BASE_URL from '../config/api';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomSelect from '../components/CustomSelect';
import { useToast } from '../components/ToastProvider';

const TABS = [
    { id: 'product', label: 'Product', icon: <Tag className="w-4 h-4" /> },
    { id: 'farm', label: 'Farm', icon: <Landmark className="w-4 h-4" /> },
    { id: 'cultivation', label: 'Cultivation', icon: <Sprout className="w-4 h-4" /> },
    { id: 'harvest', label: 'Harvest', icon: <Tractor className="w-4 h-4" /> },
    { id: 'processing', label: 'Processing', icon: <Box className="w-4 h-4" /> },
    { id: 'quality', label: 'Quality', icon: <Microscope className="w-4 h-4" /> },
    { id: 'logistics', label: 'Logistics', icon: <Truck className="w-4 h-4" /> },
    { id: 'distribution', label: 'Distribution', icon: <Store className="w-4 h-4" /> }
];

export default function VendorProductLifecycle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [activeTab, setActiveTab] = useState('product');
    const [loading, setLoading] = useState(id ? true : false);
    const [formLoading, setFormLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
        if (!id) {
            return localStorage.getItem('farmer_form_image_preview');
        }
        return null;
    });

    const [formData, setFormData] = useState<any>(() => {
        if (!id) {
            const saved = localStorage.getItem('farmer_form_data');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse saved form data", e);
                }
            }
        }
        return {
            // Product Basic
            name: '',
            description: '',
            category: '',
            price: '',
            weightValue: '',
            weightUnit: 'kg',
            expiryDate: '',

            // Farm Origin
            farmDetails_farmId: '',
            farmDetails_village: '',
            farmDetails_district: '',
            farmDetails_state: '',
            farmDetails_country: 'India',
            farmDetails_sizeInAcres: '',
            farmDetails_soilType: '',
            farmDetails_waterSource: '',
            farmDetails_isOrganic: false,
            farmDetails_certification: '',
            origin_latitude: '',
            origin_longitude: '',

            // Cultivation
            cultivation_cultivationId: '',
            cultivation_crop: '',
            cultivation_variety: '',
            cultivation_sowingDate: '',
            cultivation_fertilizer: '',
            cultivation_pesticide: '',
            cultivation_irrigation: '',
            cultivation_yield: '',

            // Harvest
            harvest_batchId: '',
            harvest_harvestDate: '',
            harvest_quantity: '',
            harvest_grade: '',
            harvest_moisture: '',
            harvest_qualityCheck: '',

            // Processing
            processing_processingId: '',
            processing_center: '',
            processing_processType: '',
            processing_processDate: '',
            processing_weightAfter: '',
            processing_packaging: '',

            // Quality
            qualityTest_testId: '',
            qualityTest_residuePpm: '',
            qualityTest_microbial: '',
            qualityTest_status: '',
            qualityTest_agency: '',

            // Logistics
            logistics_transportId: '',
            logistics_from: '',
            logistics_to: '',
            logistics_mode: '',
            logistics_temperature: '',
            logistics_dispatchDate: '',
            logistics_deliveryDate: '',

            // Distribution
            distribution_distributionId: '',
            distribution_distributor: '',
            distribution_retailer: '',
            distribution_city: '',
            distribution_quantity: '',
            distribution_pricePerKg: ''
        };
    });

    useEffect(() => {
        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    // Persist form data to localStorage
    useEffect(() => {
        if (!id) {
            localStorage.setItem('farmer_form_data', JSON.stringify(formData));
        }
    }, [formData, id]);

    // Persist previewUrl to localStorage
    useEffect(() => {
        if (!id && previewUrl && previewUrl.startsWith('data:')) {
            localStorage.setItem('farmer_form_image_preview', previewUrl);
        }
    }, [previewUrl, id]);

    const fetchProductDetails = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_BASE_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const p = response.data;

            setFormData({
                name: p.name,
                description: p.description,
                category: p.category,
                price: p.price,
                weightValue: p.weight?.value || '',
                weightUnit: p.weight?.unit || 'kg',
                expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().split('T')[0] : '',

                // Farm
                farmDetails_farmId: p.farmDetails?.farmId || '',
                farmDetails_village: p.farmDetails?.village || '',
                farmDetails_district: p.farmDetails?.district || '',
                farmDetails_state: p.farmDetails?.state || '',
                farmDetails_country: p.farmDetails?.country || 'India',
                farmDetails_sizeInAcres: p.farmDetails?.sizeInAcres || '',
                farmDetails_soilType: p.farmDetails?.soilType || '',
                farmDetails_waterSource: p.farmDetails?.waterSource || '',
                farmDetails_isOrganic: p.farmDetails?.isOrganic || false,
                farmDetails_certification: p.farmDetails?.certification || '',
                origin_latitude: p.origin?.latitude || '',
                origin_longitude: p.origin?.longitude || '',

                // Cultivation
                cultivation_cultivationId: p.cultivation?.cultivationId || '',
                cultivation_crop: p.cultivation?.crop || '',
                cultivation_variety: p.cultivation?.variety || '',
                cultivation_sowingDate: p.cultivation?.sowingDate ? new Date(p.cultivation.sowingDate).toISOString().split('T')[0] : '',
                cultivation_fertilizer: p.cultivation?.fertilizer || '',
                cultivation_pesticide: p.cultivation?.pesticide || '',
                cultivation_irrigation: p.cultivation?.irrigation || '',
                cultivation_yield: p.cultivation?.yield || '',

                // Harvest
                harvest_batchId: p.harvest?.batchId || '',
                harvest_harvestDate: p.harvest?.harvestDate ? new Date(p.harvest.harvestDate).toISOString().split('T')[0] : '',
                harvest_quantity: p.harvest?.quantity || '',
                harvest_grade: p.harvest?.grade || '',
                harvest_moisture: p.harvest?.moisture || '',
                harvest_qualityCheck: p.harvest?.qualityCheck || '',

                // Processing
                processing_processingId: p.processing?.processingId || '',
                processing_center: p.processing?.center || '',
                processing_processType: p.processing?.processType || '',
                processing_processDate: p.processing?.processDate ? new Date(p.processing.processDate).toISOString().split('T')[0] : '',
                processing_weightAfter: p.processing?.weightAfter || '',
                processing_packaging: p.processing?.packaging || '',

                // Quality
                qualityTest_testId: p.qualityTest?.testId || '',
                qualityTest_residuePpm: p.qualityTest?.residuePpm || '',
                qualityTest_microbial: p.qualityTest?.microbial || '',
                qualityTest_status: p.qualityTest?.status || '',
                qualityTest_agency: p.qualityTest?.agency || '',

                // Logistics
                logistics_transportId: p.logistics?.transportId || '',
                logistics_from: p.logistics?.from || '',
                logistics_to: p.logistics?.to || '',
                logistics_mode: p.logistics?.mode || '',
                logistics_temperature: p.logistics?.temperature || '',
                logistics_dispatchDate: p.logistics?.dispatchDate ? new Date(p.logistics.dispatchDate).toISOString().split('T')[0] : '',
                logistics_deliveryDate: p.logistics?.deliveryDate ? new Date(p.logistics.deliveryDate).toISOString().split('T')[0] : '',

                // Distribution
                distribution_distributionId: p.distribution?.distributionId || '',
                distribution_distributor: p.distribution?.distributor || '',
                distribution_retailer: p.distribution?.retailer || '',
                distribution_city: p.distribution?.city || '',
                distribution_quantity: p.distribution?.quantity || '',
                distribution_pricePerKg: p.distribution?.pricePerKg || ''
            });
            setPreviewUrl(p.imageUrl);
        } catch (err) {
            console.error('Error fetching product details:', err);
            error('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev: any) => ({ ...prev, [name]: val }));
    };

    const handleDateChange = (name: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        if (e && e.preventDefault) e.preventDefault();
        const token = localStorage.getItem('authToken');
        const data = new FormData();

        // Basic Info
        data.append('name', formData.name);
        data.append('description', formData.description || '');
        data.append('category', formData.category || 'Vegetables');
        data.append('price', formData.price || '0');
        data.append('weightValue', formData.weightValue || '0');
        data.append('weightUnit', formData.weightUnit || 'kg');
        data.append('expiryDate', formData.expiryDate || '');
        data.append('batchNo', formData.harvest_batchId || 'BATCH-000'); // Mapping batchId to required batchNo
        data.append('latitude', formData.origin_latitude || '0');
        data.append('longitude', formData.origin_longitude || '0');

        // Farm Origin
        data.append('farmDetails_farmId', formData.farmDetails_farmId || '');
        data.append('farmDetails_village', formData.farmDetails_village || '');
        data.append('farmDetails_district', formData.farmDetails_district || '');
        data.append('farmDetails_state', formData.farmDetails_state || '');
        data.append('farmDetails_country', formData.farmDetails_country || 'India');
        data.append('farmDetails_sizeInAcres', formData.farmDetails_sizeInAcres || '0');
        data.append('farmDetails_soilType', formData.farmDetails_soilType || '');
        data.append('farmDetails_waterSource', formData.farmDetails_waterSource || '');
        data.append('farmDetails_isOrganic', String(formData.farmDetails_isOrganic));
        data.append('farmDetails_certification', formData.farmDetails_certification || '');

        // Cultivation
        data.append('cultivation_cultivationId', formData.cultivation_cultivationId || '');
        data.append('cultivation_crop', formData.cultivation_crop || '');
        data.append('cultivation_variety', formData.cultivation_variety || '');
        data.append('cultivation_sowingDate', formData.cultivation_sowingDate || '');
        data.append('cultivation_fertilizer', formData.cultivation_fertilizer || '');
        data.append('cultivation_pesticide', formData.cultivation_pesticide || '');
        data.append('cultivation_irrigation', formData.cultivation_irrigation || '');
        data.append('cultivation_yield', formData.cultivation_yield || '0');

        // Harvest
        data.append('harvest_batchId', formData.harvest_batchId || '');
        data.append('harvest_harvestDate', formData.harvest_harvestDate || '');
        data.append('harvest_quantity', formData.harvest_quantity || '0');
        data.append('harvest_grade', formData.harvest_grade || '');
        data.append('harvest_moisture', formData.harvest_moisture || '0');
        data.append('harvest_qualityCheck', formData.harvest_qualityCheck || '');

        // Processing
        data.append('processing_processingId', formData.processing_processingId || '');
        data.append('processing_center', formData.processing_center || '');
        data.append('processing_processType', formData.processing_processType || '');
        data.append('processing_processDate', formData.processing_processDate || '');
        data.append('processing_weightAfter', formData.processing_weightAfter || '0');
        data.append('processing_packaging', formData.processing_packaging || '');
        data.append('processing_expiryDate', formData.expiryDate || ''); // Also map to lifecycle field

        // Quality
        data.append('qualityTest_testId', formData.qualityTest_testId || '');
        data.append('qualityTest_residuePpm', formData.qualityTest_residuePpm || '0');
        data.append('qualityTest_microbial', formData.qualityTest_microbial || '');
        data.append('qualityTest_status', formData.qualityTest_status || '');
        data.append('qualityTest_agency', formData.qualityTest_agency || '');

        // Logistics
        data.append('logistics_transportId', formData.logistics_transportId || '');
        data.append('logistics_from', formData.logistics_from || '');
        data.append('logistics_to', formData.logistics_to || '');
        data.append('logistics_mode', formData.logistics_mode || '');
        data.append('logistics_temperature', formData.logistics_temperature || '0');
        data.append('logistics_dispatchDate', formData.logistics_dispatchDate || '');
        data.append('logistics_deliveryDate', formData.logistics_deliveryDate || '');

        // Distribution
        data.append('distribution_distributionId', formData.distribution_distributionId || '');
        data.append('distribution_distributor', formData.distribution_distributor || '');
        data.append('distribution_retailer', formData.distribution_retailer || '');
        data.append('distribution_city', formData.distribution_city || '');
        data.append('distribution_quantity', formData.distribution_quantity || '0');
        data.append('distribution_pricePerKg', formData.distribution_pricePerKg || '0');

        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            setFormLoading(true);
            const url = id ? `${API_BASE_URL}/api/products/${id}` : `${API_BASE_URL}/api/products`;
            const method = id ? 'put' : 'post';

            await axios({
                method,
                url,
                data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            success(`Product ${id ? 'updated' : 'added'} successfully!`);

            // Clear persistent data on success
            if (!id) {
                localStorage.removeItem('farmer_form_data');
                localStorage.removeItem('farmer_form_image_preview');
            }

            navigate('/farmer/my-products');
        } catch (err: any) {
            console.error('Error saving product:', err);
            error(err.response?.data?.message || 'Error processing request');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-leaf-50"><Loader2 className="w-12 h-12 text-leaf-600 animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-[#f8faf8] pb-24 font-poppins">
            <div className="max-w-7xl mx-auto px-4 pt-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <Link to="/farmer/my-products" className="inline-flex items-center text-leaf-600 font-black mb-4 hover:-translate-x-1 transition-transform group text-[10px] uppercase tracking-widest">
                            <ArrowLeft className="w-3 h-3 mr-2" /> Back to inventory
                        </Link>
                        <h1 className="text-4xl font-black text-charcoal-900 tracking-tight uppercase">
                            {id ? 'Update Lifecycle' : 'Add New Product'}
                        </h1>
                        <p className="text-gray-500 mt-2 font-sans font-medium">Complete the trace details from farm production to market delivery.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleFormSubmit}
                            disabled={formLoading}
                            className="px-10 py-4 bg-leaf-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-leaf-200 hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:scale-100 transition-all flex items-center gap-3"
                        >
                            {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            {id ? 'Commit Update' : 'Deploy Batch'}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-leaf-100 flex flex-col md:flex-row min-h-[70vh]">
                    {/* Sidebar Nav */}
                    <div className="w-full md:w-64 bg-leaf-50/50 border-r border-leaf-100 flex flex-col p-6 gap-2 shrink-0">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all
                                    ${activeTab === tab.id ? 'bg-leaf-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white hover:text-leaf-600'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Form Component */}
                    <div className="flex-1 p-10 overflow-y-auto">
                        <form onSubmit={handleFormSubmit}>
                            {activeTab === 'product' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="col-span-2"><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Product Identity</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-6 py-4 bg-leaf-50/30 border border-leaf-100 rounded-2xl outline-none font-bold" placeholder="Product Name" />
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-8">
                                                <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-dashed border-leaf-200 bg-leaf-50 flex items-center justify-center group relative">
                                                    {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <Upload className="w-8 h-8 text-leaf-200" />}
                                                    <input type="file" accept="image/*" onChange={handleImageChange} required={!id} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-black text-charcoal-900 mb-1">Product Media</h4>
                                                    <p className="text-xs text-gray-400 font-medium font-sans">A clear photo of the harvested crop helps in visual identification.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Category</label>
                                            <CustomSelect
                                                value={formData.category}
                                                onChange={(val) => setFormData((prev: any) => ({ ...prev, category: val }))}
                                                options={[
                                                    { value: 'Vegetables', label: 'Vegetables' },
                                                    { value: 'Fruits', label: 'Fruits' },
                                                    { value: 'Grains', label: 'Grains' },
                                                    { value: 'Spices', label: 'Spices' }
                                                ]}
                                            />
                                        </div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Price ($)</label><input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Weight Value</label><input type="number" name="weightValue" value={formData.weightValue} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Unit</label>
                                            <CustomSelect
                                                value={formData.weightUnit}
                                                onChange={(val) => setFormData((prev: any) => ({ ...prev, weightUnit: val }))}
                                                options={[
                                                    { value: 'kg', label: 'kg' },
                                                    { value: 'g', label: 'g' },
                                                    { value: 'quintal', label: 'quintal' }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-span-2"><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Detailed Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" placeholder="Visual attributes, taste profile, and storage advice..." /></div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'farm' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Farm ID</label><input type="text" name="farmDetails_farmId" value={formData.farmDetails_farmId} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Village</label><input type="text" name="farmDetails_village" value={formData.farmDetails_village} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">District</label><input type="text" name="farmDetails_district" value={formData.farmDetails_district} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">State</label><input type="text" name="farmDetails_state" value={formData.farmDetails_state} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Land Area (Acres)</label><input type="number" name="farmDetails_sizeInAcres" value={formData.farmDetails_sizeInAcres} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Soil Type</label><input type="text" name="farmDetails_soilType" value={formData.farmDetails_soilType} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Water Source</label><input type="text" name="farmDetails_waterSource" value={formData.farmDetails_waterSource} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Latitude</label><input type="number" step="0.000001" name="origin_latitude" value={formData.origin_latitude} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Longitude</label><input type="number" step="0.000001" name="origin_longitude" value={formData.origin_longitude} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div className="flex items-center gap-4 py-4 col-span-2">
                                            <input type="checkbox" name="farmDetails_isOrganic" checked={formData.farmDetails_isOrganic} onChange={handleInputChange} className="w-6 h-6 accent-leaf-600" />
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-600">Organic Cultivation Certified</label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'cultivation' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Cultivation ID</label><input type="text" name="cultivation_cultivationId" value={formData.cultivation_cultivationId} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Crop Name</label><input type="text" name="cultivation_crop" value={formData.cultivation_crop} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Variety</label><input type="text" name="cultivation_variety" value={formData.cultivation_variety} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Sowing Date</label>
                                            <CustomDatePicker
                                                selected={formData.cultivation_sowingDate}
                                                onChange={(date) => handleDateChange('cultivation_sowingDate', date)}
                                                placeholderText="Select Sowing Date"
                                            />
                                        </div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Fertilizer Used</label><input type="text" name="cultivation_fertilizer" value={formData.cultivation_fertilizer} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Pesticide Protocol</label><input type="text" name="cultivation_pesticide" value={formData.cultivation_pesticide} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Irrigation Type</label><input type="text" name="cultivation_irrigation" value={formData.cultivation_irrigation} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Expected Yield (kg)</label><input type="number" name="cultivation_yield" value={formData.cultivation_yield} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'harvest' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Batch Id</label><input type="text" name="harvest_batchId" value={formData.harvest_batchId} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Harvest Date</label>
                                            <CustomDatePicker
                                                selected={formData.harvest_harvestDate}
                                                onChange={(date) => handleDateChange('harvest_harvestDate', date)}
                                                placeholderText="Select Harvest Date"
                                            />
                                        </div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Quantity (kg)</label><input type="number" name="harvest_quantity" value={formData.harvest_quantity} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Quality Grade</label>
                                            <CustomSelect
                                                value={formData.harvest_grade}
                                                onChange={(val) => setFormData((prev: any) => ({ ...prev, harvest_grade: val }))}
                                                options={[
                                                    { value: 'A+', label: 'A+' },
                                                    { value: 'A', label: 'A' },
                                                    { value: 'B', label: 'B' }
                                                ]}
                                                placeholder="Select Grade"
                                            />
                                        </div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Moisture Level (%)</label><input type="number" step="0.1" name="harvest_moisture" value={formData.harvest_moisture} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Quality check status</label><input type="text" name="harvest_qualityCheck" value={formData.harvest_qualityCheck} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'processing' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Processing id</label><input type="text" name="processing_processingId" value={formData.processing_processingId} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Center name</label><input type="text" name="processing_center" value={formData.processing_center} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Process Type</label><input type="text" name="processing_processType" value={formData.processing_processType} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Process Date</label>
                                            <CustomDatePicker
                                                selected={formData.processing_processDate}
                                                onChange={(date) => handleDateChange('processing_processDate', date)}
                                                placeholderText="Select Process Date"
                                            />
                                        </div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Weight After (kg)</label><input type="number" name="processing_weightAfter" value={formData.processing_weightAfter} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Packaging Type</label><input type="text" name="processing_packaging" value={formData.processing_packaging} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Batch Expiry</label>
                                            <CustomDatePicker
                                                selected={formData.expiryDate}
                                                onChange={(date) => handleDateChange('expiryDate', date)}
                                                placeholderText="Select Expiry Date"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'quality' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Test ID</label><input type="text" name="qualityTest_testId" value={formData.qualityTest_testId} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Residue (ppm)</label><input type="number" step="0.001" name="qualityTest_residuePpm" value={formData.qualityTest_residuePpm} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Microbial Profile</label><input type="text" name="qualityTest_microbial" value={formData.qualityTest_microbial} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Test Status</label>
                                            <CustomSelect
                                                value={formData.qualityTest_status}
                                                onChange={(val) => setFormData((prev: any) => ({ ...prev, qualityTest_status: val }))}
                                                options={[
                                                    { value: 'Passed', label: 'Passed' },
                                                    { value: 'Pending', label: 'Pending' },
                                                    { value: 'Failed', label: 'Failed' }
                                                ]}
                                                placeholder="Select Status"
                                            />
                                        </div>
                                        <div className="col-span-full md:col-span-2"><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Testing Agent</label><input type="text" name="qualityTest_agency" value={formData.qualityTest_agency} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'logistics' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">transport id</label><input type="text" name="logistics_transportId" value={formData.logistics_transportId} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">From</label><input type="text" name="logistics_from" value={formData.logistics_from} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">To</label><input type="text" name="logistics_to" value={formData.logistics_to} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">mode</label><input type="text" name="logistics_mode" value={formData.logistics_mode} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">temperature (C)</label><input type="number" step="0.1" name="logistics_temperature" value={formData.logistics_temperature} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Dispatch Date</label>
                                            <CustomDatePicker
                                                selected={formData.logistics_dispatchDate}
                                                onChange={(date) => handleDateChange('logistics_dispatchDate', date)}
                                                placeholderText="Select Dispatch Date"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Delivery Date</label>
                                            <CustomDatePicker
                                                selected={formData.logistics_deliveryDate}
                                                onChange={(date) => handleDateChange('logistics_deliveryDate', date)}
                                                placeholderText="Select Delivery Date"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'distribution' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Distribution id</label><input type="text" name="distribution_distributionId" value={formData.distribution_distributionId} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">distributor</label><input type="text" name="distribution_distributor" value={formData.distribution_distributor} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Retailer</label><input type="text" name="distribution_retailer" value={formData.distribution_retailer} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">City</label><input type="text" name="distribution_city" value={formData.distribution_city} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">quantity (kg)</label><input type="number" name="distribution_quantity" value={formData.distribution_quantity} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                        <div><label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Price per kg ($)</label><input type="number" step="0.01" name="distribution_pricePerKg" value={formData.distribution_pricePerKg} onChange={handleInputChange} className="w-full px-5 py-3 bg-leaf-50/30 border border-leaf-100 rounded-xl font-bold" /></div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <div className="mt-12 flex justify-between items-center bg-white/50 backdrop-blur-md p-8 rounded-[2rem] border border-leaf-100">
                    <div className="flex gap-4">
                        {activeTab !== 'product' && <button onClick={() => setActiveTab(TABS[TABS.findIndex(t => t.id === activeTab) - 1].id)} className="px-8 py-3 rounded-2xl font-black text-leaf-600 border border-leaf-200 bg-white hover:bg-leaf-50 transition-all uppercase text-[10px] tracking-widest">Previous</button>}
                        {activeTab !== 'distribution' && <button onClick={() => setActiveTab(TABS[TABS.findIndex(t => t.id === activeTab) + 1].id)} className="px-8 py-3 rounded-2xl font-black text-leaf-600 bg-white border border-leaf-200 hover:shadow-md transition-all uppercase text-[10px] tracking-widest">Next Step</button>}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/farmer/my-products')} className="px-8 py-3 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors">Discard changes</button>
                        <button
                            onClick={handleFormSubmit}
                            disabled={formLoading}
                            className="px-10 py-4 bg-leaf-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-leaf-200 hover:scale-105 active:scale-95 disabled:bg-gray-300 transition-all flex items-center gap-3"
                        >
                            {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            {id ? 'Save Batch Record' : 'Create Batch Record'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
