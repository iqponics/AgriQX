// WebRTC Service for managing peer-to-peer connections
import logger from '../utils/debug.utils';

class WebRTCService {
    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;

    // STUN servers for NAT traversal
    private iceServers: RTCIceServer[] = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
    ];

    // Callbacks for events
    private onRemoteStreamCallback?: (stream: MediaStream) => void;
    private onIceCandidateCallback?: (candidate: RTCIceCandidate) => void;
    private onConnectionStateChangeCallback?: (state: RTCPeerConnectionState) => void;

    constructor() {
        this.remoteStream = new MediaStream();
    }

    /**
     * Initialize local media stream (camera and microphone)
     */
    async initializeLocalStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
        try {
            logger.media('Requesting user media', constraints);
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            logger.success('Local stream initialized', {
                audioTracks: this.localStream.getAudioTracks().length,
                videoTracks: this.localStream.getVideoTracks().length,
                tracks: this.localStream.getTracks().map(t => ({
                    kind: t.kind,
                    label: t.label,
                    enabled: t.enabled
                }))
            });
            return this.localStream;
        } catch (error: any) {
            logger.error('Error accessing media devices', {
                message: error.message,
                name: error.name,
                constraint: error.constraint
            });
            throw new Error('Failed to access camera/microphone. Please check permissions.');
        }
    }

    /**
     * Create a new peer connection
     */
    createPeerConnection(): RTCPeerConnection {
        try {
            logger.webrtc('Creating peer connection', { iceServers: this.iceServers });

            this.peerConnection = new RTCPeerConnection({
                iceServers: this.iceServers
            });

            // Add local stream tracks to peer connection
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => {
                    this.peerConnection!.addTrack(track, this.localStream!);
                    logger.media('Track added to peer connection', {
                        kind: track.kind,
                        label: track.label
                    });
                });
            }

            // Handle ICE candidates
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    logger.ice('ICE candidate generated', {
                        candidate: event.candidate.candidate,
                        sdpMid: event.candidate.sdpMid
                    });
                    if (this.onIceCandidateCallback) {
                        this.onIceCandidateCallback(event.candidate);
                    }
                } else {
                    logger.ice('ICE candidate gathering complete');
                }
            };

            // Handle remote stream
            this.peerConnection.ontrack = (event) => {
                logger.webrtc('Remote track received', {
                    kind: event.track.kind,
                    streams: event.streams.length,
                    trackId: event.track.id,
                    streamId: event.streams[0]?.id
                });

                // IMPORTANT: Use the stream from the event if possible to ensure sync
                // Or add track to our managed remote stream
                const track = event.track;

                if (track.kind === 'video' || track.kind === 'audio') {
                    this.remoteStream!.addTrack(track);
                    logger.media(`Remote ${track.kind} track added to managed stream`);
                }

                if (this.onRemoteStreamCallback) {
                    // Create a shallow clone or just pass the stream to trigger checking
                    // For React to re-render potentially, we might need a new reference if we are using state
                    // But usually, modifying the stream is enough if the video element ref is updated?
                    // Let's pass a NEW MediaStream containing the tracks to ensure 100% cleanliness
                    const newStreamRef = new MediaStream(this.remoteStream!.getTracks());
                    this.onRemoteStreamCallback(newStreamRef);
                }
            };

            // Handle connection state changes
            this.peerConnection.onconnectionstatechange = () => {
                const state = this.peerConnection!.connectionState;
                logger.state('PeerConnection', state, {
                    iceConnectionState: this.peerConnection!.iceConnectionState,
                    iceGatheringState: this.peerConnection!.iceGatheringState,
                    signalingState: this.peerConnection!.signalingState
                });

                if (this.onConnectionStateChangeCallback) {
                    this.onConnectionStateChangeCallback(state);
                }
            };

            // Handle ICE connection state changes
            this.peerConnection.oniceconnectionstatechange = () => {
                logger.ice('ICE connection state changed', {
                    state: this.peerConnection!.iceConnectionState
                });
            };

            // Handle ICE gathering state changes
            this.peerConnection.onicegatheringstatechange = () => {
                logger.ice('ICE gathering state changed', {
                    state: this.peerConnection!.iceGatheringState
                });
            };

            logger.success('Peer connection created successfully');
            return this.peerConnection;
        } catch (error: any) {
            logger.webrtcError('Error creating peer connection', error);
            throw new Error('Failed to create peer connection');
        }
    }

    /**
     * Create an offer (caller side)
     */
    /**
     * Create an offer (caller side)
     */
    async createOffer(): Promise<RTCSessionDescriptionInit> {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized');
        }

        // Verify tracks are added
        const senders = this.peerConnection.getSenders();
        logger.webrtc('Creating offer. Active senders:', senders.length);
        senders.forEach((sender, idx) => {
            logger.webrtc(`Sender ${idx}:`, {
                kind: sender.track?.kind,
                label: sender.track?.label,
                enabled: sender.track?.enabled
            });
        });

        if (senders.length === 0) {
            logger.warn('WARNING: Creating offer with NO tracks. Media will not be sent.');
        }

        try {
            const offer = await this.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            await this.peerConnection.setLocalDescription(offer);
            logger.success('Offer created and set as local description');
            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw new Error('Failed to create offer');
        }
    }

    /**
     * Create an answer (receiver side)
     */
    /**
     * Create an answer (receiver side)
     */
    async createAnswer(): Promise<RTCSessionDescriptionInit> {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized');
        }

        // Verify tracks
        const senders = this.peerConnection.getSenders();
        logger.webrtc('Creating answer. Active senders:', senders.length);

        try {
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            logger.success('Answer created and set as local description');
            return answer;
        } catch (error) {
            console.error('Error creating answer:', error);
            throw new Error('Failed to create answer');
        }
    }

    /**
     * Set remote description (offer or answer from peer)
     */
    async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized');
        }

        try {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(description));
            console.log('Remote description set');
        } catch (error) {
            console.error('Error setting remote description:', error);
            throw new Error('Failed to set remote description');
        }
    }

    /**
     * Add ICE candidate received from peer
     */
    async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
        if (!this.peerConnection) {
            throw new Error('Peer connection not initialized');
        }

        try {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('ICE candidate added');
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
            // Don't throw - ICE candidates can fail gracefully
        }
    }

    /**
     * Toggle audio (mute/unmute)
     */
    toggleAudio(enabled: boolean): void {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = enabled;
            });
            console.log('Audio toggled:', enabled);
        }
    }

    /**
     * Toggle video (on/off)
     */
    toggleVideo(enabled: boolean): void {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = enabled;
            });
            console.log('Video toggled:', enabled);
        }
    }

    /**
     * Switch camera (front/back on mobile)
     */
    async switchCamera(): Promise<void> {
        if (!this.localStream) {
            throw new Error('Local stream not initialized');
        }

        try {
            const videoTrack = this.localStream.getVideoTracks()[0];
            const currentFacingMode = videoTrack.getSettings().facingMode;
            const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

            // Stop current video track
            videoTrack.stop();

            // Get new video stream with different facing mode
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newFacingMode },
                audio: false
            });

            const newVideoTrack = newStream.getVideoTracks()[0];

            // Replace track in local stream
            this.localStream.removeTrack(videoTrack);
            this.localStream.addTrack(newVideoTrack);

            // Replace track in peer connection
            if (this.peerConnection) {
                const sender = this.peerConnection.getSenders().find(s => s.track?.kind === 'video');
                if (sender) {
                    await sender.replaceTrack(newVideoTrack);
                }
            }

            console.log('Camera switched to:', newFacingMode);
        } catch (error) {
            console.error('Error switching camera:', error);
            throw new Error('Failed to switch camera');
        }
    }

    /**
     * Get connection statistics
     */
    async getConnectionStats(): Promise<RTCStatsReport | null> {
        if (!this.peerConnection) {
            return null;
        }

        try {
            const stats = await this.peerConnection.getStats();
            return stats;
        } catch (error) {
            console.error('Error getting connection stats:', error);
            return null;
        }
    }

    /**
     * Clean up resources
     */
    cleanup(): void {
        console.log('Cleaning up WebRTC resources');

        // Stop all local stream tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                track.stop();
            });
            this.localStream = null;
        }

        // Stop all remote stream tracks
        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(track => {
                track.stop();
            });
            this.remoteStream = null;
        }

        // Close peer connection
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        // Clear callbacks
        this.onRemoteStreamCallback = undefined;
        this.onIceCandidateCallback = undefined;
        this.onConnectionStateChangeCallback = undefined;
    }

    // Getters
    getLocalStream(): MediaStream | null {
        return this.localStream;
    }

    getRemoteStream(): MediaStream | null {
        return this.remoteStream;
    }

    getPeerConnection(): RTCPeerConnection | null {
        return this.peerConnection;
    }

    // Event listeners
    onRemoteStream(callback: (stream: MediaStream) => void): void {
        this.onRemoteStreamCallback = callback;
    }

    onIceCandidate(callback: (candidate: RTCIceCandidate) => void): void {
        this.onIceCandidateCallback = callback;
    }

    onConnectionStateChange(callback: (state: RTCPeerConnectionState) => void): void {
        this.onConnectionStateChangeCallback = callback;
    }
}

export default WebRTCService;
