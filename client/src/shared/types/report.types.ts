export type ReportReason = 
    | "spam"
    | "harassment"
    | "violence"
    | "misinformation"
    | "hate_speech"
    | "inappropriate"
    | "other";

export interface ReportPostPayload {
    postId: number;
    reason: ReportReason;
    description?: string;
}

export interface Report {
    id: number;
    postId: number;
    userId: number;
    reason: ReportReason;
    description?: string;
    status: "pending" | "reviewed" | "resolved" | "dismissed";
    createdAt: string;
}