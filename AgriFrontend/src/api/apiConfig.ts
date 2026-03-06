export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getFullUrl = (endpoint: string) => {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
        return endpoint;
    }
    return `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};
