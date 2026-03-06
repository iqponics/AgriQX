import { getFullUrl } from './apiConfig';

export const userApi = {
    base: () => getFullUrl('/api/users'),
    getUser: (userId: string) => getFullUrl(`/api/users/${userId}`),
    search: () => getFullUrl('/api/users/search'),
    searchQuery: (query: string) => getFullUrl(`/api/users/search/query?q=${query}`),
    searchLawyers: () => getFullUrl('/api/users/search/lawyers'),
    getContacts: (userId: string) => getFullUrl(`/api/users/contacts/${userId}`),
    requestConnect: (userId: string) => getFullUrl(`/api/users/${userId}/requestConnect`),
    acceptConnect: (userId: string) => getFullUrl(`/api/users/${userId}/acceptConnect`),
    declineConnect: (userId: string) => getFullUrl(`/api/users/${userId}/declineConnect`),
};
