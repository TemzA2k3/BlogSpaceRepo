import { apiRequest } from "../api/apiClient";

import type { UserCardProps } from "../types/userTypes";

export const fetchUserFollowers = async (userId: string | number) => {
    try {
        const data = await apiRequest<UserCardProps[]>(`/users/${userId}/followers`, "GET", {
            credentials: "include",
        });

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}


export const fetchUserFollowing = async (userId: string | number) => {
    try {
        const data = await apiRequest<UserCardProps[]>(`/users/${userId}/following`, "GET", {
            credentials: "include",
        });

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}