import { apiRequest } from "@/shared/api/apiClient";

import type { User } from "@/shared/types/userTypes"

export const fetchAnotherUserData = async (id: string): Promise<User> => {
    try {
        const data = await apiRequest<User>(`/users/${id}`, "GET", {
            credentials: "include",
        });

        return data;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}