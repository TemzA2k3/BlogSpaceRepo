import { apiRequest } from "../api/apiClient";
import type { SpecificUserPost } from "../types/post.types";

export const fetchPostById = async (postId: number) => {
    try {
        const data = await apiRequest<SpecificUserPost | null>(`/posts/${postId}`, "GET", {
            credentials: "include",
        });

        return data || null;
    } catch (err: any) {
        throw new Error(err.message || "Ошибка загрузки поста");
    }
};
