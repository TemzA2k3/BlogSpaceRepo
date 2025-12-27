import { apiRequest } from "@/shared/api/apiClient";

import type { RecommendationsResponse } from "@/shared/types/post.types";

export const getPostsRecommendations = async () => {
    try {
        const data = await apiRequest<RecommendationsResponse>("/posts/recommendations", "GET", {
            credentials: "include",
        });

        return data;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong while fetching recommendations");
    }
};
