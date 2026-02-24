// API Configuration
// This file centralizes the API base URL configuration

/**
 * Get the API base URL from environment variables
 * Falls back to localhost:5000 if not set
 */
/**
 * Get the API base URL from environment variables
 * Falls back to localhost:5000 if not set
 */
const getBaseUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const API_BASE_URL = getBaseUrl();

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
    // Auth endpoints
    auth: {
        login: `${API_BASE_URL}/api/auth/login`,
        register: `${API_BASE_URL}/api/auth/register`,
        logout: `${API_BASE_URL}/api/auth/logout`,
        google: `${API_BASE_URL}/api/auth/google`,
    },

    // User endpoints
    users: {
        base: `${API_BASE_URL}/api/users`,
        getUser: (userId: string) => `${API_BASE_URL}/api/users/${userId}`,
        search: `${API_BASE_URL}/api/users/search`,
        searchLawyers: `${API_BASE_URL}/api/users/search/lawyers`,
        requestConnect: (userId: string) => `${API_BASE_URL}/api/users/${userId}/requestConnect`,
        acceptConnect: (userId: string) => `${API_BASE_URL}/api/users/${userId}/acceptConnect`,
        declineConnect: (userId: string) => `${API_BASE_URL}/api/users/${userId}/declineConnect`,
    },

    // Posts endpoints
    posts: {
        base: `${API_BASE_URL}/api/posts`,
        feed: (userId: string) => `${API_BASE_URL}/api/posts/feed/${userId}`,
        like: (postId: string) => `${API_BASE_URL}/api/posts/${postId}/like`,
        addComment: (postId: string) => `${API_BASE_URL}/api/posts/addcomment/${postId}`,
    },

    // Conversation endpoints
    conversation: {
        base: (userId: string) => `${API_BASE_URL}/api/conversation/${userId}`,
        find: (userId: string, contactId: string) => `${API_BASE_URL}/api/conversation/find/${userId}/${contactId}`,
        group: `${API_BASE_URL}/api/conversation/group`,
    },

    // Message endpoints
    message: {
        base: `${API_BASE_URL}/api/message`,
        getMessages: (conversationId: string) => `${API_BASE_URL}/api/message/${conversationId}`,
    },

    // File/Upload endpoints
    files: {
        base: `${API_BASE_URL}/api/files/`,
        upload: `${API_BASE_URL}/api/files/fileUpload`,
        permanentDelete: (fileId: string, userId: string) =>
            `${API_BASE_URL}/api/files/permanentDelete?fileId=${fileId}&userId=${userId}`,
        shared: `${API_BASE_URL}/api/files/shared/`,
    },

    // Upload endpoints
    upload: {
        base: (userId: string) => `${API_BASE_URL}/api/upload/${userId}`,
    },
};

export default API_BASE_URL;
