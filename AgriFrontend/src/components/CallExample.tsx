import React from 'react';
import useCall from '../hooks/useCall';
import CallInterface from '../components/CallInterface';
import IncomingCallModal from '../components/IncomingCallModal';
import { Phone, Video } from 'lucide-react';

/**
 * Example integration of video/audio calling functionality
 * 
 * This component demonstrates how to integrate the call features into your application.
 * You can adapt this pattern to any page where you want to enable calling.
 */

interface CallExampleProps {
    currentUserId: string; // The logged-in user's ID
    recipientUserId: string; // The user you want to call
    recipientName?: string; // The recipient's name (for display)
    conversationId: string; // The conversation ID (from your chat system)
}

const CallExample: React.FC<CallExampleProps> = ({
    currentUserId,
    recipientUserId,
    recipientName = 'Unknown User',
    conversationId
}) => {
    // Initialize the call hook
    const {
        callState,
        localStream,
        remoteStream,
        isMuted,
        isVideoEnabled,
        callDuration,
        incomingCall,
        error,
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleAudio,
        toggleVideo,
        switchCamera
    } = useCall(currentUserId);

    // Handle initiating an audio call
    const handleAudioCall = async () => {
        try {
            await initiateCall(recipientUserId, 'audio', conversationId);
        } catch (err) {
            console.error('Failed to initiate audio call:', err);
        }
    };

    // Handle initiating a video call
    const handleVideoCall = async () => {
        try {
            await initiateCall(recipientUserId, 'video', conversationId);
        } catch (err) {
            console.error('Failed to initiate video call:', err);
        }
    };

    return (
        <div className="call-example-container">
            {/* Call buttons - show when not in a call */}
            {callState === 'idle' && (
                <div className="flex gap-4">
                    <button
                        onClick={handleAudioCall}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        <span>Audio Call</span>
                    </button>

                    <button
                        onClick={handleVideoCall}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Video className="w-5 h-5" />
                        <span>Video Call</span>
                    </button>
                </div>
            )}

            {/* Show call status */}
            {callState !== 'idle' && callState !== 'active' && (
                <div className="call-status">
                    <p className="text-white">
                        {callState === 'initiating' && 'Initiating call...'}
                        {callState === 'ringing' && 'Ringing...'}
                        {callState === 'connecting' && 'Connecting...'}
                    </p>
                </div>
            )}

            {/* Show error if any */}
            {error && (
                <div className="error-message bg-red-500 text-white p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Incoming call modal */}
            {incomingCall && (
                <IncomingCallModal
                    callerName={incomingCall.callerName}
                    callType={incomingCall.type}
                    onAccept={acceptCall}
                    onReject={rejectCall}
                />
            )}

            {/* Active call interface */}
            {callState === 'active' && (
                <CallInterface
                    localStream={localStream}
                    remoteStream={remoteStream}
                    isMuted={isMuted}
                    isVideoEnabled={isVideoEnabled}
                    callDuration={callDuration}
                    participantName={recipientName}
                    onToggleAudio={toggleAudio}
                    onToggleVideo={toggleVideo}
                    onEndCall={endCall}
                    onSwitchCamera={switchCamera}
                />
            )}
        </div>
    );
};

export default CallExample;

/**
 * USAGE EXAMPLE:
 * 
 * In your chat page or any component where you want to enable calling:
 * 
 * import CallExample from './CallExample';
 * 
 * function ChatPage() {
 *   const currentUserId = "user123"; // Get from your auth context
 *   const recipientUserId = "user456"; // Get from selected conversation
 *   const conversationId = "conv789"; // Get from your chat system
 * 
 *   return (
 *     <div>
 *       <div className="chat-header">
 *         <h2>Chat with John Doe</h2>
 *         <CallExample
 *           currentUserId={currentUserId}
 *           recipientUserId={recipientUserId}
 *           recipientName="John Doe"
 *           conversationId={conversationId}
 *         />
 *       </div>
 *       {/* Rest of your chat UI *\/}
 *     </div>
 *   );
 * }
 */
