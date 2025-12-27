import { apiRequest } from "@/shared/api/apiClient";
import type { ReportReason } from "@/shared/types/report.types";

export const reportPost = async (
    postId: number, 
    reason: ReportReason, 
    description?: string
): Promise<void> => {
    await apiRequest(`/posts/report`, "POST", {
        body: { postId, reason, description },
        credentials: "include",
    });
};