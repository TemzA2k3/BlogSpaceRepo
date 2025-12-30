import { UPLOADS_URL } from "@/shared/constants/urls"

export const getAvatarUrl = (
    fname: string, 
    lname: string,
    path?: string | null,
) => {
    if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fname + ' ' + lname)}&background=gray&color=fff&rounded=true&size=32`;
    
    return `${UPLOADS_URL}${path}`;
};

export const getImageUrl = (path: string) => {
    return `${UPLOADS_URL}${path}`;
}
  