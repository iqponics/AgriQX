import React, { useEffect, useRef, useState } from 'react';
import CallControls from './CallControls';
import '../styles/call.css';

interface CallInterfaceProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isMuted: boolean;
    isVideoEnabled: boolean;
    callDuration: number;
    participantName?: string;
    onToggleAudio: () => void;
    onToggleVideo: () => void;
    onEndCall: () => void;
    onSwitchCamera?: () => void;
}

const CallInterface: React.FC<CallInterfaceProps> = ({
    localStream,
    remoteStream,
    isMuted,
    isVideoEnabled,
    callDuration,
    participantName = 'Unknown',
    onToggleAudio,
    onToggleVideo,
    onEndCall,
    onSwitchCamera
}) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [localVideoPosition] = useState({ x: 20, y: 20 });

    // Set up local video stream
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Set up remote video stream
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Format call duration
    const formatDuration = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <div className="call-interface">
            {/* Remote video (large) */}
            <div className="remote-video-container">
                {remoteStream && remoteStream.getVideoTracks().length > 0 ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="remote-video"
                    />
                ) : (
                    <div className="video-placeholder">
                        <div className="avatar-placeholder">
                            {participantName.charAt(0).toUpperCase()}
                        </div>
                        <p>{participantName}</p>
                    </div>
                )}
                {/* Hidden audio element for audio-only calls or mixed calls */}
                {remoteStream && (
                    <audio
                        ref={(audio) => {
                            if (audio) audio.srcObject = remoteStream;
                        }}
                        autoPlay
                        playsInline
                    />
                )}
            </div>

            {/* Local video (small, draggable) */}
            {localStream && (
                <div
                    className="local-video-container"
                    style={{
                        left: `${localVideoPosition.x}px`,
                        top: `${localVideoPosition.y}px`
                    }}
                >
                    {isVideoEnabled ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="local-video"
                        />
                    ) : (
                        <div className="video-placeholder-small">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        </div>
                    )}
                </div>
            )}

            {/* Top bar with participant info and timer */}
            <div className="call-top-bar">
                <div className="participant-info">
                    <span className="participant-name">{participantName}</span>
                    <span className="call-status">
                        {remoteStream ? 'Connected' : 'Connecting...'}
                    </span>
                </div>
                <div className="call-timer">{formatDuration(callDuration)}</div>
            </div>

            {/* Connection quality indicator */}
            <div className="connection-quality">
                <div className="quality-indicator">
                    <div className="quality-bar"></div>
                    <div className="quality-bar"></div>
                    <div className="quality-bar"></div>
                </div>
            </div>

            {/* Bottom controls */}
            <div className="call-bottom-bar">
                <CallControls
                    isMuted={isMuted}
                    isVideoEnabled={isVideoEnabled}
                    onToggleAudio={onToggleAudio}
                    onToggleVideo={onToggleVideo}
                    onEndCall={onEndCall}
                    onSwitchCamera={onSwitchCamera}
                    showSwitchCamera={isMobile}
                />
            </div>
        </div>
    );
};

export default CallInterface;
