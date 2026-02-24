import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    className?: string;
    placeholder?: string;
}

export default function CustomSelect({ value, onChange, options, className = '', placeholder = 'Select...' }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={`relative ${className} font-poppins`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full rounded-2xl px-5 py-3.5 bg-leaf-50/30 border-2 border-leaf-100 flex items-center justify-between transition-all duration-300 group
                    ${isOpen ? 'border-leaf-400 bg-white ring-4 ring-leaf-500/10' : 'hover:border-leaf-200 hover:bg-leaf-50/50'}
                `}
            >
                <span className={`text-sm font-bold ${selectedOption ? 'text-charcoal-900' : 'text-gray-400'}`}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-leaf-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-[100] w-full mt-2 bg-white/90 backdrop-blur-xl border border-leaf-100 rounded-2xl shadow-2xl shadow-leaf-200/50 overflow-hidden"
                    >
                        <div className="p-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group
                                        ${option.value === value
                                            ? 'bg-leaf-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-leaf-50 hover:text-leaf-600'
                                        }`}
                                >
                                    <span>{option.label}</span>
                                    {option.value === value && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check className="w-4 h-4 text-white" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
