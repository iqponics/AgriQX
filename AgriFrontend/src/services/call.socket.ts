import SocketService from './socket.service';
import logger from '../utils/debug.utils';
import { Socket } from 'socket.io-client';

interface CallInitiateData {
    callId: string;
    callerId: string;
    receiverId: string;
    type: 'audio' | 'video';
    conversationId: string;
}

interface CallIncomingData {
    callId: string;
    callerId: string;
    callerName: string;
    type: 'audio' | 'video';
    conversationId: string;
}

interface CallAcceptData {
    callId: string;
    userId: string;
}

interface CallRejectData {
    callId: string;
    userId: string;
}

interface CallEndData {
    callId: string;
    userId: string;
}

interface WebRTCOfferData {
    callId: string;
    offer: RTCSessionDescriptionInit;
    to: string;
}

interface WebRTCAnswerData {
    callId: string;
    answer: RTCSessionDescriptionInit;
    to: string;
}

interface ICECandidateData {
    callId: string;
    candidate: RTCIceCandidateInit;
    to: string;
}

interface CallErrorData {
    message: string;
    callId?: string;
    error?: string;
}

class CallSocketService {
    private socketService: SocketService;

    constructor() {
        this.socketService = SocketService.getInstance();
        logger.info('CallSocketService initialized');
    }

    /**
     * Connect to the socket server (uses shared connection)
     */
    connect(userId: string, token?: string): void {
        const authToken = token || localStorage.getItem('authToken');

        if (!authToken) {
            logger.error('No authentication token found');
            return;
        }

        // We just ensure connection here, but don't store the reference
        this.socketService.connect(userId, authToken);
        logger.info('CallSocketService ensured connection to shared socket');
    }

    /**
     * Get socket instance (safe - doesn't throw)
     */
    private getSocket(): Socket | null {
        return this.socketService.getSocket();
    }

    /**
     * Get socket or throw error
     */
    private requireSocket(): Socket {
        const socket = this.getSocket();
        if (!socket || !socket.connected) {
            throw new Error('Socket not connected. Call connect() first.');
        }
        return socket;
    }

    /**
     * Disconnect (doesn't actually disconnect shared socket)
     */
    disconnect(): void {
        // We do nothing here as we share the socket
        logger.info('CallSocketService disconnect called (no-op for shared socket)');
    }

    /**
     * Check if socket is connected
     */
    isConnected(): boolean {
        return this.socketService.isSocketConnected();
    }

    // ============ Call Events ============

    initiateCall(data: CallInitiateData): void {
        logger.call('Initiating call', data);
        this.requireSocket().emit('call:initiate', data);
        logger.socket('call:initiate emitted', data);
    }

    acceptCall(data: CallAcceptData): void {
        logger.call('Accepting call', data);
        this.requireSocket().emit('call:accept', data);
        logger.socket('call:accept emitted', data);
    }

    rejectCall(data: CallRejectData): void {
        logger.call('Rejecting call', data);
        this.requireSocket().emit('call:reject', data);
        logger.socket('call:reject emitted', data);
    }

    endCall(data: CallEndData): void {
        logger.call('Ending call', data);
        this.requireSocket().emit('call:end', data);
        logger.socket('call:end emitted', data);
    }

    toggleAudio(callId: string, userId: string, isMuted: boolean): void {
        logger.media('Toggle audio', { callId, userId, isMuted });
        this.requireSocket().emit('call:toggle-audio', { callId, userId, isMuted });
        logger.socket('call:toggle-audio emitted', { callId, userId, isMuted });
    }

    toggleVideo(callId: string, userId: string, isVideoEnabled: boolean): void {
        logger.media('Toggle video', { callId, userId, isVideoEnabled });
        this.requireSocket().emit('call:toggle-video', { callId, userId, isVideoEnabled });
        logger.socket('call:toggle-video emitted', { callId, userId, isVideoEnabled });
    }

    // ============ WebRTC Signaling Events ============

    sendOffer(data: WebRTCOfferData): void {
        logger.webrtc('Sending WebRTC offer', { callId: data.callId, to: data.to });
        this.requireSocket().emit('webrtc:offer', data);
        logger.socket('webrtc:offer emitted', { callId: data.callId, to: data.to });
    }

    sendAnswer(data: WebRTCAnswerData): void {
        logger.webrtc('Sending WebRTC answer', { callId: data.callId, to: data.to });
        this.requireSocket().emit('webrtc:answer', data);
        logger.socket('webrtc:answer emitted', { callId: data.callId, to: data.to });
    }

    sendIceCandidate(data: ICECandidateData): void {
        logger.ice('Sending ICE candidate', { callId: data.callId, to: data.to });
        this.requireSocket().emit('webrtc:ice-candidate', data);
        logger.socket('webrtc:ice-candidate emitted', { callId: data.callId, to: data.to });
    }

    // ============ Event Listeners (Safe) ============

    /**
     * Setup listener with safety check
     */
    private setupListener(event: string, callback: (...args: any[]) => void): void {
        const socket = this.getSocket();

        if (socket) {
            // Remove previous listener to avoid duplicates
            socket.off(event);
            socket.on(event, callback);
            logger.info(`Listener registered: ${event}`);
        } else {
            logger.warn(`Socket not ready, cannot register listener: ${event}`);
            // Retry once after short delay
            setTimeout(() => {
                const s = this.getSocket();
                if (s) {
                    s.off(event);
                    s.on(event, callback);
                    logger.info(`Retry: Listener registered: ${event}`);
                }
            }, 1000);
        }
    }

    onIncomingCall(callback: (data: CallIncomingData) => void): void {
        this.setupListener('call:incoming', (data: CallIncomingData) => {
            logger.call('Incoming call received', data);
            callback(data);
        });
    }

    onCallAccepted(callback: (data: { callId: string; acceptedBy: string }) => void): void {
        this.setupListener('call:accepted', (data: { callId: string; acceptedBy: string }) => {
            logger.call('Call accepted', data);
            callback(data);
        });
    }

    onCallRejected(callback: (data: { callId: string; rejectedBy: string }) => void): void {
        this.setupListener('call:rejected', (data: { callId: string; rejectedBy: string }) => {
            logger.call('Call rejected', data);
            callback(data);
        });
    }

    onCallEnded(callback: (data: { callId: string; endedBy: string; reason?: string }) => void): void {
        this.setupListener('call:ended', (data: { callId: string; endedBy: string; reason?: string }) => {
            logger.call('Call ended', data);
            callback(data);
        });
    }

    onCallTimeout(callback: (data: { callId: string }) => void): void {
        this.setupListener('call:timeout', (data: { callId: string }) => {
            logger.call('Call timeout', data);
            callback(data);
        });
    }

    onCallError(callback: (data: CallErrorData) => void): void {
        this.setupListener('call:error', (data: CallErrorData) => {
            logger.callError('Call error received', data);
            callback(data);
        });
    }

    onWebRTCOffer(callback: (data: { callId: string; offer: RTCSessionDescriptionInit; from: string }) => void): void {
        this.setupListener('webrtc:offer', (data: { callId: string; offer: RTCSessionDescriptionInit; from: string }) => {
            logger.webrtc('WebRTC offer received', { callId: data.callId, from: data.from });
            callback(data);
        });
    }

    onWebRTCAnswer(callback: (data: { callId: string; answer: RTCSessionDescriptionInit; from: string }) => void): void {
        this.setupListener('webrtc:answer', (data: { callId: string; answer: RTCSessionDescriptionInit; from: string }) => {
            logger.webrtc('WebRTC answer received', { callId: data.callId, from: data.from });
            callback(data);
        });
    }

    onICECandidate(callback: (data: { callId: string; candidate: RTCIceCandidateInit; from: string }) => void): void {
        this.setupListener('webrtc:ice-candidate', (data: { callId: string; candidate: RTCIceCandidateInit; from: string }) => {
            logger.ice('ICE candidate received', { callId: data.callId, from: data.from });
            callback(data);
        });
    }

    onPeerAudioToggle(callback: (data: { callId: string; userId: string; isMuted: boolean }) => void): void {
        this.setupListener('call:peer-audio-toggle', (data: { callId: string; userId: string; isMuted: boolean }) => {
            logger.media('Peer audio toggled', data);
            callback(data);
        });
    }

    onPeerVideoToggle(callback: (data: { callId: string; userId: string; isVideoEnabled: boolean }) => void): void {
        this.setupListener('call:peer-video-toggle', (data: { callId: string; userId: string; isVideoEnabled: boolean }) => {
            logger.media('Peer video toggled', data);
            callback(data);
        });
    }

    // ============ Cleanup ============

    removeAllListeners(): void {
        const socket = this.getSocket();
        if (socket) {
            socket.off('call:incoming');
            socket.off('call:accepted');
            socket.off('call:rejected');
            socket.off('call:ended');
            socket.off('call:timeout');
            socket.off('call:error');
            socket.off('webrtc:offer');
            socket.off('webrtc:answer');
            socket.off('webrtc:ice-candidate');
            socket.off('call:peer-audio-toggle');
            socket.off('call:peer-video-toggle');

            logger.info('Call-specific listeners removed');
        }
    }

    removeListener(event: string): void {
        const socket = this.getSocket();
        if (socket) {
            socket.off(event);
        }
    }
}

export default CallSocketService;
export type {
    CallInitiateData,
    CallIncomingData,
    CallAcceptData,
    CallRejectData,
    CallEndData,
    WebRTCOfferData,
    WebRTCAnswerData,
    ICECandidateData,
    CallErrorData
};