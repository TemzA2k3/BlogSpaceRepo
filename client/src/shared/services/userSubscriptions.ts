import { apiRequest } from "@/shared/api/apiClient";

export const followUser = async (id: number): Promise<void> => {
    try {        
        await apiRequest(`/users/${id}/follow`, "POST", {
            credentials: "include",
        });
    } catch (err: any) {        
        throw new Error(err.message || "Something went wrong...");
    }
}

export const unfollowUser = async (id: number): Promise<void> => {
    try {
        await apiRequest(`/users/${id}/unfollow`, "DELETE", {
            credentials: "include",
        });
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...");
    }
}
