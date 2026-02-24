import React, { useEffect } from 'react';
import CustomDatePicker from './CustomDatePicker';

interface ExperienceFormData {
  companyName: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  present?: boolean;
}

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ExperienceFormData;
  onChange: (data: ExperienceFormData) => void;
  onSubmit: () => void;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({
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
        <h3 className="text-2xl font-bold text-leaf-700 mb-6 text-center">Experience</h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Company Name</label>
            <input
              type="text"
              placeholder="e.g. Green Valley Farms"
              className="w-full p-3 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-all font-medium"
              value={formData.companyName}
              onChange={(e) => onChange({ ...formData, companyName: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Role / Position</label>
            <input
              type="text"
              placeholder="e.g. Agricultural Consultant"
              className="w-full p-3 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-all font-medium"
              value={formData.role}
              onChange={(e) => onChange({ ...formData, role: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Start Date</label>
              <CustomDatePicker
                selected={formData.startDate}
                onChange={(date) => onChange({ ...formData, startDate: date })}
                placeholderText="Start Date"
              />
            </div>
            {!formData.present && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 ml-1">End Date</label>
                <CustomDatePicker
                  selected={formData.endDate}
                  onChange={(date) => onChange({ ...formData, endDate: date })}
                  placeholderText="End Date"
                />
              </div>
            )}
          </div>
          <label className="flex items-center space-x-3 cursor-pointer p-1">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-leaf-300 text-leaf-600 focus:ring-leaf-500 cursor-pointer"
              checked={formData.present}
              onChange={(e) => onChange({ ...formData, present: e.target.checked })}
            />
            <span className="text-sm font-medium text-charcoal-900/80">Currently Working Here</span>
          </label>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">Description</label>
            <textarea
              placeholder="Briefly describe your responsibilities..."
              className="w-full p-3 border border-leaf-200 bg-leaf-50/50 text-charcoal-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 transition-all min-h-[100px] font-medium"
              value={formData.description}
              onChange={(e) => onChange({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={onSubmit}
            className="w-full btn-primary py-4 text-lg font-bold"
          >
            Save Experience
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

export default ExperienceModal;