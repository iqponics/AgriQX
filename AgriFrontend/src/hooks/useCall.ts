import { useState, useEffect, useRef, useCallback } from 'react';
import WebRTCService from '../services/webrtc.service';
import CallSocketService from '../services/call.socket';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/debug.utils';

type CallState = 'idle' | 'initiating' | 'ringing' | 'connecting' | 'active' | 'ended';
type CallType = 'audio' | 'video';

interface CallData {
    callId: string;
    callerId: string;
    receiverId: string;
    type: CallType;
    conversationId: string;
}

interface IncomingCallData {
    callId: string;
    callerId: string;
    callerName: string;
    type: CallType;
    conversationId: string;
}

interface UseCallReturn {
    // State
    callState: CallState;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isMuted: boolean;
    isVideoEnabled: boolean;
    callDuration: number;
    incomingCall: IncomingCallData | null;
    currentCallId: string | null;
    currentCallData: React.MutableRefObject<CallData | null>;
    error: string | null;
    connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';

    // Methods
    initiateCall: (receiverId: string, type: CallType, conversationId: string) => Promise<void>;
    acceptCall: () => Promise<void>;
    rejectCall: () => void;
    endCall: () => void;
    toggleAudio: () => void;
    toggleVideo: () => void;
    switchCamera: () => Promise<void>;
}

import { API_BASE_URL } from '../config/api';

const API_URL = API_BASE_URL;

const useCall = (userId: string): UseCallReturn => {
    // State
    const [callState, setCallState] = useState<CallState>('idle');
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [callDuration, setCallDuration] = useState(0);
    const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
    const [currentCallId, setCurrentCallId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'unknown'>('unknown');

    // Services
    const webrtcService = useRef<WebRTCService>(new WebRTCService());
    const socketService = useRef<CallSocketService>(new CallSocketService());
    const callTimerRef = useRef<number | null>(null);
    const currentCallData = useRef<CallData | null>(null);
    const isInitiator = useRef<boolean>(false);

    // Audio Refs for Ringtones
    const ringingAudioRef = useRef<HTMLAudioElement | null>(null);
    const incomingAudioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio elements
    useEffect(() => {
        ringingAudioRef.current = new Audio('/ringing_tone.mp3');
        ringingAudioRef.current.loop = true;

        incomingAudioRef.current = new Audio('/incoming_tone.mp3');
        incomingAudioRef.current.loop = true;

        logger.info('Ringtone audio elements initialized');

        return () => {
            ringingAudioRef.current?.pause();
            incomingAudioRef.current?.pause();
            ringingAudioRef.current = null;
            incomingAudioRef.current = null;
        };
    }, []);

    const playRinging = () => {
        if (ringingAudioRef.current) {
            ringingAudioRef.current.currentTime = 0;
            ringingAudioRef.current.play().catch(err => logger.warn('Failed to play ringing tone', err));
            logger.info('Playing ringing tone');
        }
    };

    const stopRinging = () => {
        if (ringingAudioRef.current) {
            ringingAudioRef.current.pause();
            ringingAudioRef.current.currentTime = 0;
            logger.info('Stopped ringing tone');
        }
    };

    const playIncoming = () => {
        if (incomingAudioRef.current) {
            incomingAudioRef.current.currentTime = 0;
            incomingAudioRef.current.play().catch(err => logger.warn('Failed to play incoming tone', err));
            logger.info('Playing incoming tone');
        }
    };

    const stopIncoming = () => {
        if (incomingAudioRef.current) {
            incomingAudioRef.current.pause();
            incomingAudioRef.current.currentTime = 0;
            logger.info('Stopped incoming tone');
        }
    };

    const stopAllTones = () => {
        stopRinging();
        stopIncoming();
    };


    // ICE Candidate Queue
    const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]);
    const isRemoteDescriptionSet = useRef<boolean>(false);

    // Initialize socket connection (uses shared socket)
    useEffect(() => {
        if (!userId) {
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            return;
        }

        // Just ensure we are connected
        socketService.current.connect(userId, token);

        return () => {
            // Don't remove listeners here, let them be overwritten or explicitly removed on cleanup
        };
    }, [userId]);

    // Setup socket event listeners
    useEffect(() => {
        if (!userId) return;

        const socket = socketService.current;

        // Incoming call
        socket.onIncomingCall((data) => {
            // Check if we are already in a call
            if (callState !== 'idle') {
                logger.warn('Received incoming call while busy', { currentCallId, newCallId: data.callId });
                // Automatically reject/busy? For now just ignore or show notification
                // Ideally emit "busy"
                return;
            }

            logger.call('Incoming call received', data);
            setIncomingCall(data);
            setCallState('ringing');
            setCurrentCallId(data.callId);

            // Play incoming tone
            playIncoming();

            // Store call data for receiver
            currentCallData.current = {
                callId: data.callId,
                callerId: data.callerId,
                receiverId: userId,
                type: data.type,
                conversationId: data.conversationId
            };
        });

        // Call accepted
        socket.onCallAccepted(async (data) => {
            logger.call('Call accepted', data);
            setCallState('connecting');

            // Stop ringing tone (for caller)
            stopAllTones();

            // Create and send offer (initiator side)
            if (isInitiator.current && currentCallData.current) {
                try {
                    logger.webrtc('Creating offer as initiator');
                    const offer = await webrtcService.current.createOffer();

                    logger.webrtc('Sending offer to receiver', {
                        to: currentCallData.current.receiverId,
                        callId: data.callId
                    });

                    socket.sendOffer({
                        callId: data.callId,
                        offer,
                        to: currentCallData.current.receiverId
                    });
                } catch (err: any) {
                    logger.webrtcError('Error creating offer', err);
                    setError('Failed to establish connection');
                }
            }
        });

        // Call rejected
        socket.onCallRejected((data) => {
            logger.call('Call rejected', data);
            setError('Call was rejected');
            cleanup();
        });

        // Call ended
        socket.onCallEnded((data) => {
            logger.call('Call ended', data);
            cleanup();
        });

        // Call timeout
        socket.onCallTimeout((data) => {
            logger.call('Call timeout', data);
            setError('Call timed out');
            cleanup();
        });

        // Call error
        socket.onCallError((data) => {
            logger.callError('Call error', data);
            setError(data.message);
            cleanup();
        });

        // WebRTC Offer received
        socket.onWebRTCOffer(async (data) => {
            logger.webrtc('WebRTC offer received', {
                callId: data.callId,
                from: data.from
            });

            // Stop info tone if playing (should be stopped on accept, but double check)
            stopAllTones();

            try {
                await webrtcService.current.setRemoteDescription(data.offer);
                isRemoteDescriptionSet.current = true;
                processIceCandidateQueue(); // Process any queued candidates

                logger.success('Remote description (offer) set successfully');

                const answer = await webrtcService.current.createAnswer();
                logger.webrtc('Answer created, sending to caller');

                // Send answer back to the caller (use 'from' field which is the caller's userId)
                socket.sendAnswer({
                    callId: data.callId,
                    answer,
                    to: data.from // ✅ Use 'from' field (caller's userId)
                });

                logger.success('Answer sent to caller');
            } catch (err: any) {
                logger.webrtcError('Error handling offer', err);
                setError('Failed to establish connection');
            }
        });

        // WebRTC Answer received
        socket.onWebRTCAnswer(async (data) => {
            logger.webrtc('WebRTC answer received', {
                callId: data.callId,
                from: data.from
            });

            try {
                await webrtcService.current.setRemoteDescription(data.answer);
                isRemoteDescriptionSet.current = true;
                processIceCandidateQueue(); // Process any queued candidates

                logger.success('Remote description (answer) set successfully');
            } catch (err: any) {
                logger.webrtcError('Error handling answer', err);
                setError('Failed to establish connection');
            }
        });

        // ICE Candidate received
        socket.onICECandidate(async (data) => {
            logger.ice('ICE candidate received', {
                callId: data.callId,
                from: data.from
            });

            if (isRemoteDescriptionSet.current) {
                try {
                    await webrtcService.current.addIceCandidate(data.candidate);
                    logger.success('ICE candidate added successfully');
                } catch (err: any) {
                    logger.error('Error adding ICE candidate', err);
                }
            } else {
                logger.warn('Remote description not set yet, queuing ICE candidate');
                iceCandidateQueue.current.push(data.candidate);
            }
        });

        // Peer audio toggle
        socket.onPeerAudioToggle((data) => {
            logger.media('Peer audio toggled', data);
            // You can update UI to show peer is muted/unmuted
        });

        // Peer video toggle
        socket.onPeerVideoToggle((data) => {
            logger.media('Peer video toggled', data);
            // You can update UI to show peer video is off/on
        });

        return () => {
            socket.removeAllListeners();
            stopAllTones();
        };
    }, [userId, callState, currentCallId]); // Add dependencies to ensure updated state access

    // Process queued ICE candidates
    const processIceCandidateQueue = async () => {
        if (iceCandidateQueue.current.length > 0) {
            logger.info(`Processing ${iceCandidateQueue.current.length} queued ICE candidates`);
            for (const candidate of iceCandidateQueue.current) {
                try {
                    await webrtcService.current.addIceCandidate(candidate);
                } catch (err) {
                    logger.error('Error processing queued ICE candidate', err);
                }
            }
            iceCandidateQueue.current = [];
        }
    };

    // Setup WebRTC event listeners
    useEffect(() => {
        const webrtc = webrtcService.current;

        // Remote stream received
        webrtc.onRemoteStream((stream) => {
            logger.success('Remote stream received', {
                id: stream.id,
                active: stream.active,
                audioTracks: stream.getAudioTracks().length,
                videoTracks: stream.getVideoTracks().length,
                tracks: stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, label: t.label }))
            });

            setRemoteStream(stream);
            setCallState('active');
            startCallTimer();
        });

        // ICE candidate generated
        webrtc.onIceCandidate((candidate) => {
            logger.ice('Local ICE candidate generated');

            if (currentCallId && currentCallData.current) {
                // Determine who to send the candidate to
                const to = isInitiator.current
                    ? currentCallData.current.receiverId
                    : currentCallData.current.callerId;

                logger.ice('Sending ICE candidate', {
                    callId: currentCallId,
                    to
                });

                socketService.current.sendIceCandidate({
                    callId: currentCallId,
                    candidate: candidate.toJSON(),
                    to
                });
            }
        });

        // Connection state changed
        webrtc.onConnectionStateChange((state) => {
            logger.state('PeerConnection', state);

            if (state === 'connected') {
                setCallState('active');
                stopAllTones(); // Ensure tones are stopped
                if (!callTimerRef.current) startCallTimer();
                logger.success('Call connected successfully!');
            } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                logger.warn('Call connection ended', { state });
                cleanup();
            }
        });
    }, [currentCallId]);

    // Call timer
    const startCallTimer = () => {
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
        }

        setCallDuration(0);
        callTimerRef.current = window.setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
    };

    const stopCallTimer = () => {
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
            callTimerRef.current = null;
        }
        setCallDuration(0);
    };

    // Initiate a call
    const initiateCall = useCallback(async (receiverId: string, type: CallType, conversationId: string) => {
        try {
            if (!socketService.current.isConnected()) {
                throw new Error('Socket not connected. Please wait or refresh.');
            }

            logger.call('Initiating call', { receiverId, type, conversationId });
            setError(null);
            setCallState('initiating');
            isInitiator.current = true;
            isRemoteDescriptionSet.current = false;
            iceCandidateQueue.current = [];

            // Start ringing tone
            playRinging();

            // Generate call ID
            const callId = uuidv4();
            setCurrentCallId(callId);
            logger.info('Generated call ID', { callId });

            // Store call data
            currentCallData.current = {
                callId,
                callerId: userId,
                receiverId,
                type,
                conversationId
            };

            // Initialize local stream
            const constraints: MediaStreamConstraints = {
                audio: true,
                video: type === 'video'
            };

            logger.media('Requesting media stream', constraints);
            const stream = await webrtcService.current.initializeLocalStream(constraints);
            setLocalStream(stream);
            setIsVideoEnabled(type === 'video');
            logger.success('Local stream initialized', {
                audioTracks: stream.getAudioTracks().length,
                videoTracks: stream.getVideoTracks().length
            });

            // Create peer connection
            logger.webrtc('Creating peer connection');
            webrtcService.current.createPeerConnection();
            logger.success('Peer connection created');

            // Create call record in backend
            const apiUrl = `${API_URL}/api/call/initiate`;
            logger.api('POST', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    conversationId,
                    initiator: userId,
                    participants: [userId, receiverId],
                    type
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                logger.apiError('Failed to create call record', {
                    status: response.status,
                    error: errorData
                });
                throw new Error('Failed to create call record');
            }

            const callData = await response.json();
            logger.success('Call record created in backend', callData);

            // Initiate call via socket
            socketService.current.initiateCall({
                callId,
                callerId: userId,
                receiverId,
                type,
                conversationId
            });

            logger.success('Call initiated successfully', { callId });
        } catch (err: any) {
            stopAllTones();
            logger.callError('Error initiating call', {
                message: err.message,
                stack: err.stack
            });
            setError(err.message || 'Failed to initiate call');
            cleanup();
        }
    }, [userId]);

    // Accept incoming call
    const acceptCall = useCallback(async () => {
        if (!incomingCall) {
            logger.error('No incoming call to accept');
            return;
        }

        // Stop incoming tone
        stopAllTones();

        try {
            if (!socketService.current.isConnected()) {
                throw new Error('Socket not connected');
            }

            logger.call('Accepting call', { callId: incomingCall.callId });
            setError(null);
            setCallState('connecting');
            isInitiator.current = false;
            isRemoteDescriptionSet.current = false;
            iceCandidateQueue.current = [];

            // Initialize local stream
            const constraints: MediaStreamConstraints = {
                audio: true,
                video: incomingCall.type === 'video'
            };

            logger.media('Requesting media stream', constraints);
            const stream = await webrtcService.current.initializeLocalStream(constraints);
            setLocalStream(stream);
            setIsVideoEnabled(incomingCall.type === 'video');
            logger.success('Local stream initialized');

            // Create peer connection
            logger.webrtc('Creating peer connection');
            webrtcService.current.createPeerConnection();
            logger.success('Peer connection created');

            // Accept call via socket
            socketService.current.acceptCall({
                callId: incomingCall.callId,
                userId
            });

            logger.success('Call acceptance sent to backend');

            // Update call status in backend
            await fetch(`${API_URL}/api/call/${incomingCall.callId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ status: 'active' })
            });

            setIncomingCall(null);
            logger.success('Call accepted successfully');
        } catch (err: any) {
            logger.callError('Error accepting call', err);
            setError(err.message || 'Failed to accept call');
            cleanup();
        }
    }, [incomingCall, userId]);

    // Reject incoming call
    const rejectCall = useCallback(() => {
        if (!incomingCall) {
            logger.error('No incoming call to reject');
            return;
        }

        stopAllTones();

        logger.call('Rejecting call', { callId: incomingCall.callId });

        socketService.current.rejectCall({
            callId: incomingCall.callId,
            userId
        });

        // Update call status in backend
        fetch(`${API_URL}/api/call/${incomingCall.callId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ status: 'rejected' })
        }).catch(err => logger.error('Error updating call status', err));

        setIncomingCall(null);
        cleanup();
        logger.success('Call rejected');
    }, [incomingCall, userId]);

    // End active call
    const endCall = useCallback(() => {
        if (!currentCallId) {
            logger.error('No active call to end');
            return;
        }

        stopAllTones();

        logger.call('Ending call', { callId: currentCallId });

        socketService.current.endCall({
            callId: currentCallId,
            userId
        });

        // Update call status in backend
        fetch(`${API_URL}/api/call/${currentCallId}/end`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                duration: callDuration
            })
        }).catch(err => logger.error('Error updating call', err));

        cleanup();
        logger.success('Call ended');
    }, [currentCallId, userId, callDuration]);

    // Toggle audio (mute/unmute)
    const toggleAudio = useCallback(() => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        webrtcService.current.toggleAudio(!newMutedState);

        if (currentCallId) {
            socketService.current.toggleAudio(currentCallId, userId, newMutedState);
        }

        logger.media('Audio toggled', { isMuted: newMutedState });
    }, [isMuted, currentCallId, userId]);

    // Toggle video (on/off)
    const toggleVideo = useCallback(() => {
        const newVideoState = !isVideoEnabled;
        setIsVideoEnabled(newVideoState);
        webrtcService.current.toggleVideo(newVideoState);

        if (currentCallId) {
            socketService.current.toggleVideo(currentCallId, userId, newVideoState);
        }

        logger.media('Video toggled', { isVideoEnabled: newVideoState });
    }, [isVideoEnabled, currentCallId, userId]);

    // Switch camera (front/back)
    const switchCamera = useCallback(async () => {
        try {
            await webrtcService.current.switchCamera();
            logger.success('Camera switched');
        } catch (err: any) {
            logger.error('Error switching camera', err);
            setError(err.message || 'Failed to switch camera');
        }
    }, []);

    // Cleanup function
    const cleanup = () => {
        logger.info('Cleaning up call resources');

        stopCallTimer();
        webrtcService.current.cleanup();

        setCallState('idle');
        setLocalStream(null);
        setRemoteStream(null);
        setIsMuted(false);
        setIsVideoEnabled(true);
        setCurrentCallId(null);
        setIncomingCall(null);
        currentCallData.current = null;
        isInitiator.current = false;

        // Reset WebRTC state
        isRemoteDescriptionSet.current = false;
        iceCandidateQueue.current = [];

        logger.success('Cleanup complete');
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            logger.info('useCall hook unmounting');
            cleanup();
        };
    }, []);

    return {
        // State
        callState,
        localStream,
        remoteStream,
        isMuted,
        isVideoEnabled,
        callDuration,
        incomingCall,
        currentCallId,
        currentCallData,
        error,
        connectionQuality,

        // Methods
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleAudio,
        toggleVideo,
        switchCamera
    };
};

export default useCall;
export type { CallState, CallType, CallData, IncomingCallData, UseCallReturn };