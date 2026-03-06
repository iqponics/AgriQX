import { getFullUrl } from './apiConfig';

export const authApi = {
    login: () => getFullUrl('/api/auth/login'),
    register: () => getFullUrl('/api/auth/register'),
    logout: () => getFullUrl('/api/auth/logout'),
    google: () => getFullUrl('/api/auth/google'),
    confirmEmail: (code: string) => getFullUrl(`/api/auth/confirm/${code}`),
};
