import React, { useState, useEffect } from 'react';
import { X, Search, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import CustomDatePicker from '../components/CustomDatePicker';
import { useToast } from '../components/ToastProvider';

const CreateCases: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'regular' | 'consultancy'>('regular');
  const [userId, setUserId] = useState<string>('');
  const { fetchData } = useApi();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    caseName: '',
    clientName: '',
    dateOfBirth: '',
    contactNumber: '',
    email: '',
    address: '',
    caseNotes: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const caseID = `AGRI-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const payload = {
        lawyerId: userId,
        formType: activeTab,
        caseName: formData.caseName,
        clients: [formData.clientName],
        dateOfBirth: formData.dateOfBirth,
        contactNumber: parseInt(formData.contactNumber),
        email: formData.email,
        address: formData.address,
        caseNotes: formData.caseNotes,
        caseID: caseID,
      };

      await fetchData<typeof payload, any>('/lawyerForm', 'POST', {
        body: payload
      });

      success(`Application created successfully! Case ID: ${caseID}`);
      navigate('/your-cases');
    } catch (err) {
      console.error('Failed to create application:', err);
      error('Failed to create application. Please check all fields.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cream-200 p-4 pt-24">
      <motion.div
        className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-leaf-100/20 border border-leaf-100 w-full max-w-2xl relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-lg border border-leaf-100 text-leaf-600 hover:bg-leaf-50 transition-all active:scale-90"
        >
          <ChevronLeft />
        </button>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-leaf-800 font-poppins">Create Application</h2>
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-8 bg-leaf-50/50 p-1.5 rounded-2xl border border-leaf-100">
          <button
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${activeTab === 'regular' ? 'bg-leaf-600 text-white shadow-lg shadow-leaf-200' : 'text-leaf-600 hover:bg-leaf-100'}`}
            onClick={() => setActiveTab('regular')}
          >
            Regular
          </button>
          <button
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${activeTab === 'consultancy' ? 'bg-leaf-600 text-white shadow-lg shadow-leaf-200' : 'text-leaf-600 hover:bg-leaf-100'}`}
            onClick={() => setActiveTab('consultancy')}
          >
            Consultancy
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-black text-leaf-700 uppercase tracking-wider ml-1">Case Name</label>
              <input
                type="text"
                name="caseName"
                value={formData.caseName}
                onChange={handleChange}
                required
                placeholder="E.g. Summer Harvest 2024"
                className="w-full px-5 py-3.5 bg-leaf-50/30 border border-leaf-100 rounded-2xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-leaf-700 uppercase tracking-wider ml-1">Client Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  placeholder="Primary Client"
                  className="w-full px-5 py-3.5 bg-leaf-50/30 border border-leaf-100 rounded-2xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition-all"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-leaf-300 w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-black text-leaf-700 uppercase tracking-wider ml-1">Date of Application</label>
              <div className="relative">
                <CustomDatePicker
                  selected={formData.dateOfBirth}
                  onChange={(date) => handleDateChange('dateOfBirth', date)}
                  placeholderText="Select Date"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-leaf-700 uppercase tracking-wider ml-1">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-5 py-3.5 bg-leaf-50/30 border border-leaf-100 rounded-2xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-leaf-700 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="client@example.com"
              className="w-full px-5 py-3.5 bg-leaf-50/30 border border-leaf-100 rounded-2xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-leaf-700 uppercase tracking-wider ml-1">Full Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete farm or business address"
              className="w-full px-5 py-3.5 bg-leaf-50/30 border border-leaf-100 rounded-2xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition-all h-24 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-leaf-700 uppercase tracking-wider ml-1">Case Notes / Details</label>
            <textarea
              name="caseNotes"
              value={formData.caseNotes}
              onChange={handleChange}
              placeholder="Describe the specific requirements or issues..."
              className="w-full px-5 py-3.5 bg-leaf-50/30 border border-leaf-100 rounded-2xl text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition-all h-32 resize-none"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 rounded-2xl text-gray-500 font-bold hover:bg-leaf-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-3.5 bg-leaf-600 hover:bg-leaf-700 text-white font-bold rounded-2xl shadow-xl shadow-leaf-200 transition-all active:scale-95"
            >
              Create Application
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCases;
