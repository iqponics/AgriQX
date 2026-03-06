import { getFullUrl } from './apiConfig';

export const fileApi = {
    base: () => getFullUrl('/api/files/'),
    upload: () => getFullUrl('/api/files/fileUpload'),
    permanentDelete: (fileId: string, userId: string) =>
        getFullUrl(`/api/files/permanentDelete?fileId=${fileId}&userId=${userId}`),
    shared: () => getFullUrl('/api/files/shared/'),
    uploadBase: (userId: string) => getFullUrl(`/api/upload/${userId}`),
};
