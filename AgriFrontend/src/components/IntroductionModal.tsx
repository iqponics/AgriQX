import React, { useEffect } from 'react';
import CustomDatePicker from './CustomDatePicker';

interface IntroFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  summary: string;
  profilePic: string;
}

interface IntroductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: IntroFormData;
  onChange: (data: IntroFormData) => void;
  onSubmit: () => void;
  onImageUpload: (file: File) => void;
}

const IntroductionModal: React.FC<IntroductionModalProps> = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  onImageUpload,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] overflow-y-auto p-4 sm:p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-leaf-100 my-auto">
        <h3 className="text-2xl font-bold text-leaf-700 mb-6 text-center">Introduction</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-all font-medium"
              value={formData.firstName}
              onChange={(e) => onChange({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-all font-medium"
              value={formData.lastName}
              onChange={(e) => onChange({ ...formData, lastName: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Date of Birth</label>
            <CustomDatePicker
              selected={formData.birthDate}
              onChange={(date) => onChange({ ...formData, birthDate: date })}
              placeholderText="dd-mm-yyyy"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">About You</label>
            <textarea
              placeholder="Tell us about yourself..."
              className="w-full p-3 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-all min-h-[120px] font-medium"
              value={formData.summary}
              onChange={(e) => onChange({ ...formData, summary: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-leaf-600 file:text-white hover:file:bg-leaf-700"
            />
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={onSubmit}
            className="w-full btn-primary py-4 text-lg font-bold"
          >
            Save Profile
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-charcoal-900 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default IntroductionModal;
