import React, { useEffect } from 'react';

interface ProfessionalFormData {
  barCouncilNumber?: string;
  practiceArea?: string;
  extraCertificates?: string;
  languages?: string;
}

interface ProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ProfessionalFormData;
  onChange: (data: ProfessionalFormData) => void;
  onSubmit: () => void;
}

const ProfessionalModal: React.FC<ProfessionalModalProps> = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] overflow-y-auto p-4 sm:p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-leaf-100 my-auto">
        <h3 className="text-2xl font-bold text-leaf-700 mb-6 text-center">Professional</h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Bar Council Number</label>
            <input
              type="text"
              placeholder="e.g. BC/2023/1234"
              className="w-full p-3 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-all font-medium"
              value={formData.barCouncilNumber}
              onChange={(e) => onChange({ ...formData, barCouncilNumber: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Practice Area</label>
            <input
              type="text"
              placeholder="e.g. Civil Law, Agri-Law"
              className="w-full p-3 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-all font-medium"
              value={formData.practiceArea}
              onChange={(e) => onChange({ ...formData, practiceArea: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Extra Certificates</label>
            <input
              type="text"
              placeholder="e.g. Certified Agri-Consultant"
              className="w-full p-3 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-all font-medium"
              value={formData.extraCertificates}
              onChange={(e) => onChange({ ...formData, extraCertificates: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Languages Known</label>
            <input
              type="text"
              placeholder="e.g. English, Hindi, Punjabi"
              className="w-full p-3 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-all font-medium"
              value={formData.languages}
              onChange={(e) => onChange({ ...formData, languages: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={onSubmit}
            className="w-full btn-primary py-4 text-lg font-bold"
          >
            Save Information
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

export default ProfessionalModal;