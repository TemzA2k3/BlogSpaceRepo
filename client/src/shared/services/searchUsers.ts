import { apiRequest } from "@/shared/api/apiClient";

import type { UserCardProps } from "@/shared/types/userTypes"

export const searchUsers = async (searchStr: string) => {
    try {
        const data = await apiRequest<UserCardProps[]>(`/users/search/users?query=${searchStr}`, "GET", {
            credentials: "include",
        });

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}