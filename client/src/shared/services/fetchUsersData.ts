import { apiRequest } from "@/shared/api/apiClient";

import type { User } from "@/shared/types/userTypes"

export const fetchAnotherUserData = async (userId: string, currentUserId: number | undefined): Promise<User & { isFollowing?: boolean }> => {
    try {
        const data = await apiRequest<User>(`/users/${userId}?currentUserId=${currentUserId}`, "GET", {
            credentials: "include",
        });

        return data;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}