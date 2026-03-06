import { getFullUrl } from './apiConfig';

export const messageApi = {
    base: () => getFullUrl('/api/message'),
    getMessages: (conversationId: string) => getFullUrl(`/api/message/${conversationId}`),
    conversationBase: (userId: string) => getFullUrl(`/api/conversation/${userId}`),
    conversationFind: (userId: string, contactId: string) => getFullUrl(`/api/conversation/find/${userId}/${contactId}`),
    conversationGroup: () => getFullUrl('/api/conversation/group'),
};
