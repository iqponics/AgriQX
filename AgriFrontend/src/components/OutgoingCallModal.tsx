import React from 'react';
import { Phone, Video, X } from 'lucide-react';

interface OutgoingCallModalProps {
    recipientName: string;
    callType: 'audio' | 'video';
    onCancel: () => void;
}

const OutgoingCallModal: React.FC<OutgoingCallModalProps> = ({
    recipientName,
    callType,
    onCancel
}) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white border border-leaf-100 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scaleIn relative overflow-hidden">
                {/* Call Icon */}
                <div className="flex justify-center mb-6 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-leaf-400/30 rounded-full animate-ping" />
                        <div className="relative bg-gradient-to-br from-leaf-400 to-leaf-600 p-6 rounded-full shadow-lg shadow-leaf-200">
                            {callType === 'video' ? (
                                <Video className="w-12 h-12 text-white" />
                            ) : (
                                <Phone className="w-12 h-12 text-white" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Recipient Info */}
                <div className="text-center mb-8 relative z-10">
                    <h3 className="text-2xl font-bold text-charcoal-900 mb-2">
                        {recipientName}
                    </h3>
                    <p className="text-leaf-600 font-medium text-lg animate-pulse">
                        Calling...
                    </p>
                    <p className="text-gray-400 text-sm mt-1 uppercase tracking-wider font-bold">
                        {callType === 'video' ? 'Video Call' : 'Audio Call'}
                    </p>
                </div>

                {/* Cancel Button */}
                <div className="flex justify-center relative z-10">
                    <button
                        onClick={onCancel}
                        className="group bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                        <X className="w-6 h-6" />
                        <span className="font-bold text-lg">Cancel</span>
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-leaf-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-leaf-100 rounded-full blur-3xl opacity-60" />
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default OutgoingCallModal;
