import { apiRequest } from "@/shared/api/apiClient";

import type { UserCardProps } from "@/shared/types/user.types";

export const searchUsers = async (
    searchStr: string,
    offset = 0,
    limit = 20
): Promise<UserCardProps[]> => {    
    try {
        const data = await apiRequest<UserCardProps[]>(
            `/users/search/users?query=${encodeURIComponent(searchStr)}&offset=${offset}&limit=${limit}`,
            "GET",
            { credentials: "include" }
        );

        return data || [];
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...");
    }
};
