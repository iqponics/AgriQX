import { getFullUrl } from './apiConfig';

export const postApi = {
    base: () => getFullUrl('/api/posts'),
    feed: (userId: string) => getFullUrl(`/api/posts/feed/${userId}`),
    like: (postId: string) => getFullUrl(`/api/posts/${postId}/like`),
    addComment: (postId: string) => getFullUrl(`/api/posts/addcomment/${postId}`),
};
