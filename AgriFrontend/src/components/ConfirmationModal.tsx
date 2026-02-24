import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'success' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}) => {
    if (!isOpen) return null;

    const accentColor = variant === 'danger' ? 'red' : variant === 'success' ? 'green' : 'blue';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-leaf-100 p-8 overflow-hidden"
                    >
                        {/* Upper Decorative Element */}
                        <div className={`absolute top-0 left-0 w-full h-2 bg-${accentColor}-500/20`} />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 bg-${accentColor}-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-${accentColor}-100`}>
                                <AlertTriangle className={`w-8 h-8 text-${accentColor}-500`} />
                            </div>

                            <h3 className="text-2xl font-black text-charcoal-900 mb-2 font-poppins capitalize">
                                {title}
                            </h3>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                                {message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all border border-gray-200"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${variant === 'danger'
                                            ? 'bg-red-500 hover:bg-red-600 shadow-red-100'
                                            : 'bg-leaf-600 hover:bg-leaf-700 shadow-leaf-100'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
