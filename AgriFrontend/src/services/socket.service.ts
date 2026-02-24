import io, { Socket } from 'socket.io-client';
import logger from '../utils/debug.utils';

import { API_BASE_URL } from '../config/api';

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private serverUrl: string;

    private constructor() {
        this.serverUrl = API_BASE_URL;
        logger.info('SocketService initialized', { serverUrl: this.serverUrl });
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    /**
     * Connect to socket server (only once)
     */
    public connect(userId: string, token: string): Socket {
        if (this.socket) {
            if (this.socket.connected) {
                logger.warn('Socket already connected, reusing existing connection', { socketId: this.socket.id });
                // Even if connected, ensure we are registered
                this.socket.emit('addUser', userId);
                return this.socket;
            } else {
                logger.info('Socket instance exists but disconnected. Reconnecting...');
                this.socket.auth = { token };
                this.socket.connect();
                return this.socket;
            }
        }

        logger.info('Connecting to socket server...', {
            userId,
            serverUrl: this.serverUrl,
            hasToken: !!token
        });

        this.socket = io(this.serverUrl, {
            auth: {
                token
            },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true
        });

        this.setupBaseListeners(userId);

        return this.socket;
    }

    private setupBaseListeners(userId: string): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            logger.success('Socket connected', { socketId: this.socket?.id, userId });

            // Register user
            this.socket?.emit('addUser', userId);
            logger.socket('addUser emitted', { userId });
        });

        this.socket.on('disconnect', (reason) => {
            logger.warn('Socket disconnected', { reason });
        });

        this.socket.on('connect_error', (error) => {
            logger.socketError('Socket connection error', {
                message: error.message,
                stack: error.stack
            });
        });

        this.socket.on('error', (error) => {
            logger.socketError('Socket error', error);
        });
    }

    /**
     * Get the socket instance
     */
    public getSocket(): Socket | null {
        return this.socket;
    }

    /**
     * Check if connected
     */
    public isSocketConnected(): boolean {
        return this.socket?.connected || false;
    }

    /**
     * Disconnect socket
     */
    public disconnect(): void {
        if (this.socket) {
            logger.info('Disconnecting socket');
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default SocketService;