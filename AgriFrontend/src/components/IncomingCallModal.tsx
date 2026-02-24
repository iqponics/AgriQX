import React, { useEffect, useRef } from 'react';
import { Phone, Video, PhoneOff } from 'lucide-react';

interface IncomingCallModalProps {
    callerName: string;
    callType: 'audio' | 'video';
    onAccept: () => void;
    onReject: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
    callerName,
    callType,
    onAccept,
    onReject
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Play ringtone
        if (audioRef.current) {
            audioRef.current.play().catch(err => {
                console.error('Error playing ringtone:', err);
            });
        }

        return () => {
            // Stop ringtone on unmount
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] animate-fadeIn">
            <div className="bg-white border border-leaf-100 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scaleIn relative overflow-hidden text-center">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-leaf-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-leaf-100 rounded-full blur-3xl opacity-60" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-leaf-400/30 rounded-full animate-ping" />
                            <div className="relative bg-gradient-to-br from-leaf-400 to-leaf-600 p-5 rounded-full shadow-lg shadow-leaf-200 text-white">
                                {callType === 'video' ? (
                                    <Video className="w-10 h-10" />
                                ) : (
                                    <Phone className="w-10 h-10" />
                                )}
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-leaf-700 mb-2 uppercase tracking-wide">Incoming {callType} call</h2>
                    <p className="text-3xl font-bold text-charcoal-900 mb-8 truncate px-4">{callerName}</p>

                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={onReject}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100 shadow-sm transition-all group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-red-200">
                                <PhoneOff className="w-7 h-7" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-red-500 transition-colors">Decline</span>
                        </button>

                        <button
                            onClick={onAccept}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-16 h-16 bg-leaf-50 text-leaf-600 rounded-full flex items-center justify-center border border-leaf-100 shadow-sm transition-all group-hover:bg-leaf-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-leaf-200 animate-bounce-subtle">
                                <Phone className="w-7 h-7" />
                            </div>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-leaf-600 transition-colors">Accept</span>
                        </button>
                    </div>
                </div>

                {/* Ringtone audio */}
                <audio ref={audioRef} loop>
                    <source src="/sounds/incoming-call.mp3" type="audio/mpeg" />
                </audio>
            </div>
            <style>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default IncomingCallModal;
