import { apiRequest } from "@/shared/api/apiClient";

import type { ProfileUserData } from "@/shared/types/userTypes"

export const fetchProfileUserData = async (userId: string, currentUserId: number | undefined): Promise<ProfileUserData> => {
    
    const url = currentUserId && currentUserId !== +userId
                ? `/users/${userId}?currentUserId=${currentUserId}` 
                : `/users/${userId}`

    try {
        const data = await apiRequest<ProfileUserData>(url, "GET", {
            credentials: "include",
        });

        return data;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}