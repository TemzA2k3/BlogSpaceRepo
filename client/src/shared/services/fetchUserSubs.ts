import { apiRequest } from "../api/apiClient";

import type { UserCardProps } from "../types/user.types";

export const fetchUserFollowers = async (
    userId: string | number,
    offset = 0,
    limit = 20,
) => {
    try {
        const data = await apiRequest<UserCardProps[]>(
            `/users/${userId}/followers?offset=${offset}&limit=${limit}`,
            "GET",
            { credentials: "include" }
        );

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...");
    }
};



export const fetchUserFollowing = async (
    userId: string | number,
    offset = 0,
    limit = 20,
) => {
    try {
        const data = await apiRequest<UserCardProps[]>(
            `/users/${userId}/following?offset=${offset}&limit=${limit}`, 
            "GET", { credentials: "include" }
        );

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}