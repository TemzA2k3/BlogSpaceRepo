import { apiRequest } from "@/shared/api/apiClient";

export const followUser = async (id: number): Promise<{ message: string }> => {
    try {
        const data = await apiRequest<{ message: string }>(`/users/${id}/follow`, "POST", {
            credentials: "include",
        });

        return data;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}

export const unfollowUser = async (id: number): Promise<{ message: string }> => {
    try {
        const data = await apiRequest<{ message: string }>(`/users/${id}/unfollow`, "DELETE", {
            credentials: "include",
        });

        return data;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}