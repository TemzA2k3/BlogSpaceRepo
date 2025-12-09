import { apiRequest } from "@/shared/api/apiClient";

import type { ProfileUserData } from "@/shared/types/user.types"

export const fetchProfileUserData = async (userId: string): Promise<ProfileUserData> => {

    try {
        const data = await apiRequest<ProfileUserData>(`/users/${userId}`, "GET", {
            credentials: "include",
        });

        return data as ProfileUserData;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}