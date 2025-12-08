import { apiRequest } from "../api/apiClient";

import type { ArticleData } from "../types/article.types";

export const fetchArticleData = async (id: string) => {
    try {
        const data = await apiRequest<ArticleData>(`/articles/${id}`, "GET", {
            credentials: "include",
        });

        return data || null;
    } catch (err: any) {
        throw new Error(err.message || "Something went wrong...")
    }
}