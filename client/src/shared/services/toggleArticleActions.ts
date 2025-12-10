import { apiRequest } from "../api/apiClient";

import type { 
    ToggleLikeResponse,
    ToggleSaveResponse
} from "../types/article.types";

export const toggleArticleLike = async (id: number) => {
  try {
    const data = await apiRequest<ToggleLikeResponse>(`/articles/${id}/like`, "PATCH", {
      credentials: "include",
    });

    return data;
  } catch (err: any) {
    throw new Error(err.message || "Ошибка при лайке статьи");
  }
};

export const toggleArticleSave = async (id: number) => {
  try {
    const data = await apiRequest<ToggleSaveResponse>(`/articles/${id}/save`, "PATCH", {
      credentials: "include",
    });

    return data;
  } catch (err: any) {
    throw new Error(err.message || "Ошибка при сохранении статьи");
  }
};
