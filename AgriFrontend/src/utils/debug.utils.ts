// Centralized debugging utility for consistent logging across the application

const DEBUG_ENABLED = true; // Set to false to disable all debug logs

interface LogOptions {
    color?: string;
    emoji?: string;
    data?: any;
}

class DebugLogger {
    private getTimestamp(): string {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
        });
    }

    private log(level: string, message: string, options: LogOptions = {}) {
        if (!DEBUG_ENABLED) return;

        const { color = '#888', emoji = '📝', data } = options;
        const timestamp = this.getTimestamp();

        console.log(
            `%c[${timestamp}] ${emoji} ${level}:`,
            `color: ${color}; font-weight: bold;`,
            message,
            data ? data : ''
        );
    }

    // Socket Events
    socket(event: string, data?: any) {
        this.log('SOCKET', `Event: ${event}`, {
            color: '#4CAF50',
            emoji: '🔌',
            data
        });
    }

    socketError(message: string, error?: any) {
        this.log('SOCKET ERROR', message, {
            color: '#f44336',
            emoji: '❌',
            data: error
        });
    }

    // WebRTC Events
    webrtc(event: string, data?: any) {
        this.log('WebRTC', event, {
            color: '#2196F3',
            emoji: '📹',
            data
        });
    }

    webrtcError(message: string, error?: any) {
        this.log('WebRTC ERROR', message, {
            color: '#f44336',
            emoji: '🚫',
            data: error
        });
    }

    // Call Events
    call(event: string, data?: any) {
        this.log('CALL', event, {
            color: '#9C27B0',
            emoji: '📞',
            data
        });
    }

    callError(message: string, error?: any) {
        this.log('CALL ERROR', message, {
            color: '#f44336',
            emoji: '☎️❌',
            data: error
        });
    }

    // Chat/Message Events
    chat(event: string, data?: any) {
        this.log('CHAT', event, {
            color: '#FF9800',
            emoji: '💬',
            data
        });
    }

    chatError(message: string, error?: any) {
        this.log('CHAT ERROR', message, {
            color: '#f44336',
            emoji: '💬❌',
            data: error
        });
    }

    // API Requests
    api(method: string, endpoint: string, data?: any) {
        this.log('API', `${method} ${endpoint}`, {
            color: '#00BCD4',
            emoji: '🌐',
            data
        });
    }

    apiError(message: string, error?: any) {
        this.log('API ERROR', message, {
            color: '#f44336',
            emoji: '🌐❌',
            data: error
        });
    }

    // General Info
    info(message: string, data?: any) {
        this.log('INFO', message, {
            color: '#607D8B',
            emoji: 'ℹ️',
            data
        });
    }

    // Warnings
    warn(message: string, data?: any) {
        this.log('WARNING', message, {
            color: '#FF9800',
            emoji: '⚠️',
            data
        });
    }

    // Errors
    error(message: string, error?: any) {
        this.log('ERROR', message, {
            color: '#f44336',
            emoji: '❌',
            data: error
        });
    }

    // Success
    success(message: string, data?: any) {
        this.log('SUCCESS', message, {
            color: '#4CAF50',
            emoji: '✅',
            data
        });
    }

    // State Changes
    state(component: string, state: string, data?: any) {
        this.log('STATE', `${component} → ${state}`, {
            color: '#673AB7',
            emoji: '🔄',
            data
        });
    }

    // Media Stream Events
    media(event: string, data?: any) {
        this.log('MEDIA', event, {
            color: '#E91E63',
            emoji: '🎥',
            data
        });
    }

    // ICE Events
    ice(event: string, data?: any) {
        this.log('ICE', event, {
            color: '#3F51B5',
            emoji: '🧊',
            data
        });
    }

    // Connection Quality
    quality(level: string, stats?: any) {
        const emoji = level === 'excellent' ? '🟢' : level === 'good' ? '🟡' : '🔴';
        this.log('QUALITY', `Connection: ${level}`, {
            color: '#009688',
            emoji,
            data: stats
        });
    }

    // Group logs by category
    group(title: string, callback: () => void) {
        if (!DEBUG_ENABLED) return;
        console.group(`%c${title}`, 'color: #673AB7; font-weight: bold; font-size: 14px;');
        callback();
        console.groupEnd();
    }

    // Table for structured data
    table(data: any) {
        if (!DEBUG_ENABLED) return;
        console.table(data);
    }
}

// Export singleton instance
export const logger = new DebugLogger();

// Export helper functions for common patterns
export const logSocketEvent = (event: string, data?: any) => logger.socket(event, data);
export const logWebRTCEvent = (event: string, data?: any) => logger.webrtc(event, data);
export const logCallEvent = (event: string, data?: any) => logger.call(event, data);
export const logChatEvent = (event: string, data?: any) => logger.chat(event, data);
export const logAPICall = (method: string, endpoint: string, data?: any) => logger.api(method, endpoint, data);
export const logError = (message: string, error?: any) => logger.error(message, error);
export const logStateChange = (component: string, state: string, data?: any) => logger.state(component, state, data);

export default logger;
