import { getFullUrl } from './apiConfig';

export const adminApi = {
    getStats: () => getFullUrl('/api/admin/stats'),
    getUsers: (type?: string, search?: string) => {
        let url = '/api/admin/users?';
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (search) params.append('search', search);
        return getFullUrl(url + params.toString());
    },
    verifyLawyer: (id: string) => getFullUrl(`/api/admin/users/${id}/verify`),
    updateUserRole: (id: string) => getFullUrl(`/api/admin/users/${id}/role`),
    deleteUser: (id: string) => getFullUrl(`/api/admin/users/${id}`),
    getAllPosts: () => getFullUrl('/api/admin/posts'),
    deletePost: (id: string) => getFullUrl(`/api/admin/posts/${id}`),

    // Product Approval
    getPendingProducts: () => getFullUrl('/api/admin/products/pending'),
    verifyProduct: (id: string) => getFullUrl(`/api/admin/products/${id}/verify`),
};
