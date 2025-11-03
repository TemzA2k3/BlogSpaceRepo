import { API_BASE_URL } from "@/shared/constants/urls"

export const getAvatarUrl = (
    fname: string, 
    lname: string,
    path?: string | null,
) => {
    if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fname + ' ' + lname)}&background=gray&color=fff&rounded=true&size=32`;
    
    return `${API_BASE_URL}${path}`;
};

export const getImageUrl = (path: string) => {
    return `${API_BASE_URL}${path}`;
}
  